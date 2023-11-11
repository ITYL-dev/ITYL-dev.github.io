/* eslint-disable no-unused-vars */
const randint = (min, max) => min + Math.floor(Math.random() * (max - min + 1));

class Vector2D {
	constructor(x,y) {
		this.x = x;
		this.y = y;
	}

	add(vector2D) {
		const newV = new Vector2D(0,0);
		newV.x = this.x + vector2D.x;
		newV.y = this.y + vector2D.y;
		return newV;
	}

	multiply(n) {
		const newV = new Vector2D(0,0);
		newV.x = this.x * n;
		newV.y = this.y * n;
		return newV;
	}

	norm() {
		return Math.sqrt(this.x * this.x + this.y * this.y);
	}

	unit() {
		const copyV = new Vector2D(this.x,this.y);
		return copyV.multiply(1/this.norm());
	}

	sub(vector2D) {
		return this.add(vector2D.multiply(-1));
	}

	distance(vector2D) {
		return this.sub(vector2D).norm();
	}

	scal(vecteur2D) {
		return (this.x * vecteur2D.x) + (this.y * vecteur2D.y);
	}
}

class RotationMatrix2D {
	#matrix;

	constructor(theta) {
		this.#matrix = [[null, null], [null, null]];
		this.#matrix[0][0] = Math.cos(theta);
		this.#matrix[0][1] = -Math.sin(theta);
		this.#matrix[1][0] = Math.sin(theta);
		this.#matrix[1][1] = Math.cos(theta);
	}

	dot(vector2D) {
		const newV = new Vector2D();
		newV.x = vector2D.x * this.#matrix[0][0] + vector2D.y * this.#matrix[0][1];
		newV.y = vector2D.x * this.#matrix[1][0] + vector2D.y * this.#matrix[1][1];
		return newV;
	}
}

class Solid2D {
	origin;
	vectors;
	#speedVector;
	#mass;
	#drag;
	totalRotation;
	radius;

	constructor(x, y, m, d) {
		this.origin = new Vector2D(x, y);
		this.vectors = [];
		this.#speedVector = new Vector2D(0,0);
		this.#mass = m;
		this.#drag = d;
		this.totalRotation = 0;
		this.radius = 0;
	}

	addPoint(x, y, toDraw=true) {
		this.vectors.push([new Vector2D(x,y), toDraw]);
		let max = this.radius;
		let value = 0;
		this.vectors.forEach(el => {
			value = el[0].norm();
			if (value > max) {
				max = value;
			}
		});
		this.radius = max;
	}

	rotate(theta) {
		const alpha = theta * Math.PI / 180;
		this.totalRotation = this.totalRotation + alpha;
		this.vectors = this.vectors.map(([vector, toDraw]) => {
			const matrix = new RotationMatrix2D(alpha);
			const newV = matrix.dot(vector);
			return [newV, toDraw];
		});
	}

	move(dT, F=0) {
		if (this.vectors.length > 0) {
			this.#speedVector = this.#speedVector.add(this.vectors[0][0].unit().multiply(F).add(this.#speedVector.multiply(-this.#drag)).multiply(dT / this.#mass));
			this.origin = this.origin.add(this.#speedVector);
		} else {
			throw new Error("No first vector to indicate the way forward");
		}
	}

	#isOutOfBounds(cnv) {
		return (this.origin.x - this.radius > cnv.width) || (this.origin.x + this.radius < 0) || (this.origin.y - this.radius > cnv.height) || (this.origin.y + this.radius < 0);
	}

	#replaceOnOtherSide(cnv) {
		if (this.#isOutOfBounds(cnv)) {
			this.origin.x = cnv.width - this.origin.x;
			this.origin.y = cnv.height - this.origin.y;
		}
	}

	drawSolid(ctx, cnv) {
		this.#replaceOnOtherSide(cnv);
		ctx.beginPath();
		this.vectors.map(([vector, toDraw], i) => {
			if (i !== 0 && toDraw) {
				ctx.lineTo(this.origin.x + vector.x, this.origin.y + vector.y);
			} else {
				ctx.moveTo(this.origin.x + vector.x, this.origin.y + vector.y);
			}
		});
		ctx.stroke();
	}	
}

class Rocket extends Solid2D {
	#L;

	constructor(x, y, L=40, theta=15, flameRatio = 0.6) {
		super(x, y, 2, 1);
		this.#L = L;
		const alpha = theta * Math.PI / 180;
		const a = L / 2;
		const b = 3 * L * Math.tan(alpha) / 2;
		const c = L * Math.tan(alpha);
		this.addPoint(0, -L);
		this.addPoint(b, a);
		this.addPoint(-b, a, false);
		this.addPoint(0, -L);
		this.addPoint(c, 0, false);
		this.addPoint(-c, 0);
		this.addPoint(c * -flameRatio, 0, false);
		this.addPoint(0, L);
		this.addPoint(c * flameRatio, 0);
	}

	estinguishFlame() {
		this.vectors[this.vectors.length-1][1] = false;
		this.vectors[this.vectors.length-2][1] = false;
	}

	lightUpFlame() {
		this.vectors[this.vectors.length-1][1] = true;
		this.vectors[this.vectors.length-2][1] = true;
	}

	variateFlame() {
		const matrix =  new RotationMatrix2D(this.totalRotation);
		this.vectors[this.vectors.length-2][0] = matrix.dot(new Vector2D(0, 0.75 * this.#L * (1 - Math.random() / 3)));
	}
}

class Asteroid extends Solid2D {
	constructor(x, y, meanSize) {
		super(x, y, 1, 0);
		const n = randint(7,14);
		for (let i = 0; i < n; i++) {
			const vec = new RotationMatrix2D(i * 2 * Math.PI / n).dot(new Vector2D(0, -randint(0.5 * meanSize, 1.5 * meanSize)));
			this.addPoint(vec.x, vec.y);
		}
		this.addPoint(this.vectors[0][0].x, this.vectors[0][0].y);
	}
}

class collisionHandler {
	#solids;
	#n;

	constructor(rocket, asteroids) {
		this.#solids = [rocket].concat(asteroids);
		this.#n = this.#solids.length; 
	}

	#checkCollision(solid1, solid2) {
		if (solid1.origin.distance(solid2.origin) > solid1.radius + solid2.radius) {
			return false;
		} else {
			let i_min = 0;
			let j_min = 0;
			let d_min = solid1.origin.add(solid1.vectors[i_min][0]).distance(solid2.origin.add(solid2.vectors[j_min][0]));
			let d;
			for (let i = 0; i < solid1.vectors.length; i++) {
				for (let j = 0; j < solid2.vectors.length; j++) {
					d = solid1.origin.add(solid1.vectors[i][0]).distance(solid2.origin.add(solid2.vectors[j][0]));
					if (d < d_min) {
						d_min = d;
						i_min = i;
						j_min = j;
					}
				}
			}
			let j_sec_min = (j_min + 1) % solid2.vectors.length;
			d_min = solid1.origin.add(solid1.vectors[i_min][0]).distance(solid2.origin.add(solid2.vectors[j_sec_min][0]));
			for (let j = 0; j < solid2.vectors.length; j++) {
				d = solid1.origin.add(solid1.vectors[i_min][0]).distance(solid2.origin.add(solid2.vectors[j][0]));
				if (d < d_min && j != j_min) {
					d_min = d;
					j_sec_min = j;
				}
			}
			const u = solid1.vectors[i_min][0].add(solid1.origin.sub(solid2.origin));
			let v = solid2.vectors[j_min][0];
			const norm_v = v.norm();
			v = v.multiply(1/norm_v);
			let w = solid2.vectors[j_sec_min][0];
			const norm_w = w.norm();
			w = w.multiply(1/norm_w);
			if (u.scal(v) <= norm_v && u.scal(w) <= norm_w) {
				return true;
			} else {
				return false;
			}
		}
	}

	checkCollisions() {
		const collisions = [];
		for (let i = this.#n - 1; i >= 0; i--)
			for (let j = 0; j < i; j++) {
				if (this.#checkCollision(this.#solids[i], this.#solids[j])) {
					collisions.push([i,j]);
				}
			}
		return collisions;
	}}