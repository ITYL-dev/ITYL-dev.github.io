/* eslint-disable no-unused-vars */
class Vector2D {
	constructor(x,y) {
		this.x = x;
		this.y = y;
	}

	sub(vector2D) {
		const newV = new Vector2D();
		newV.x = this.x - vector2D.x;
		newV.y = this.y - vector2D.y;
		return newV;
	}
}

class RotationMatrix2D {
	constructor(theta) {
		this.matrix = [[null, null], [null, null]];
		this.matrix[0][0] = Math.cos(theta);
		this.matrix[0][1] = -Math.sin(theta);
		this.matrix[1][0] = Math.sin(theta);
		this.matrix[1][1] = Math.cos(theta);
	}

	dot(vector2D) {
		const newV = new Vector2D();
		newV.x = vector2D.x * this.matrix[0][0] + vector2D.y * this.matrix[0][1];
		newV.y = vector2D.x * this.matrix[1][0] + vector2D.y * this.matrix[1][1];
		return newV;
	}
}

class Solid2D {
	constructor(x,y) {
		this.origin = new Vector2D(x, y);
		this.vectors = [];
	}

	addPoint(x,y,toDraw=true) {
		this.vectors.push([new Vector2D(x,y), toDraw]);
	}

	rotate(theta) {
		const alpha = theta * Math.PI / 180;
		this.vectors = this.vectors.map(([vector, toDraw]) => {
			const matrix = new RotationMatrix2D(alpha);
			const newV = matrix.dot(vector);
			return [newV, toDraw];
		});
	}

	drawSolid(ctx) {
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
	constructor(x, y, L=30, theta=15) {
		super(x, y);
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
	}
}