/* eslint-disable no-undef */
const astCnv = document.getElementById("asteroids");
astCnv.height = innerHeight * 0.8;
astCnv.width = innerWidth * 0.96;
const astCtx = astCnv.getContext("2d");

if (astCtx) {

	const rocket = new Rocket(astCnv.width/2, astCnv.height/2);
	const rotationSpeed = 5;
	const thrust = 25;
	const rocketSound = new Audio("sounds/rocket.mp3");
	rocketSound.loop = true;
	rocketSound.volume = 0.1;

	const spawnAsts = (meanSize) => {
		const a = 3 * meanSize; // max diameter of asteroid
		const b = a * (1 / Math.SQRT2 - 1 / 6); // corner margin
		const asteroids = [];
		if (astCnv.height - (2 * b /*margin between the spawn areas*/) > a && astCnv.width - (2 * b + 2 * a /*same*/) > 3 * a) {
			asteroids.push(new Asteroid(-0.5 * meanSize, randint(b, astCnv.height - b), meanSize));
			asteroids.push(new Asteroid(0.5 * meanSize + astCnv.width, randint(b, astCnv.height - b), meanSize));
			asteroids.push(new Asteroid(randint(b, astCnv.width / 3 - a / 2), -0.5 * meanSize, meanSize));
			asteroids.push(new Asteroid(randint(astCnv.width / 3 + a / 2, 2 * astCnv.width / 3 - a / 2), -0.5 * meanSize, meanSize));
			asteroids.push(new Asteroid(randint(2 * astCnv.width / 3 + a / 2, astCnv.width - b), -0.5 * meanSize, meanSize));
			asteroids.push(new Asteroid(randint(b, astCnv.width / 3 - a / 2), 0.5 * meanSize + astCnv.height, meanSize));
			asteroids.push(new Asteroid(randint(astCnv.width / 3 + a / 2, 2 * astCnv.width / 3 - a / 2), 0.5 * meanSize + astCnv.height, meanSize));
			asteroids.push(new Asteroid(randint(2 * astCnv.width / 3 + a / 2, astCnv.width - b), 0.5 * meanSize + astCnv.height, meanSize));
			asteroids.forEach(ast => {
				ast.rotate(randint(0, 360));
			});
		} else {
			throw new Error("Canva too small to spawn asteroids");
		}
		return asteroids;
	};
	
	const asteroids = spawnAsts(60);
	const astAccTime = 0.25;
	const astInitialThrust = 5;

	const colHandler = new collisionHandler(rocket, asteroids);

	const setUpAnim = () => {
		astCtx.fillStyle = "black";
		astCtx.strokeStyle = "white";
		astCtx.lineWidth = 1.5;
	};

	const minTwoDigits = (n) => {
		const nStr = n.toString();
		if (nStr.length === 1) {
			return "0" + nStr;
		} else {
			return nStr;
		}
	};

	let rotation = 0;
	let forward = false;

	let frameCount = 0;
	const time = [new Date().getTime(), new Date().getTime(), new Date().getTime()]; // initial time, last time, current time

	setInterval(() => {
		const elapsedTime = (time[2] - time[0]) / 1000;
		const secondes = Math.round(elapsedTime % 60);
		const minutes = Math.round((elapsedTime - secondes) / 60);
		document.getElementById("timer").innerHTML = `Time: ${minTwoDigits(minutes)}:${minTwoDigits(secondes)}`;
	}, 1000);
	
	window.onresize = () => {
		astCnv.height = innerHeight * 0.8;
		astCnv.width = innerWidth * 0.96;
		setUpAnim();
	};
	
	addEventListener("keydown", event => {
		switch (event.code) {
		case "KeyA": {
			rotation = 1;
			break;
		}
		case "KeyD": {
			rotation = 2;
			break;
		}
		case "ArrowLeft": {
			rotation = 1;
			break;
		}
		case "ArrowRight": {
			rotation = 2;
			break;
		}
		case "ArrowUp": {
			if (!forward) {
				rocketSound.play();
			}
			forward = true;
			break;
		}
		case "KeyW": {
			if (!forward) {
				rocketSound.play();
			}
			forward = true;
			break;
		}	
		}
	});
	
	addEventListener("keyup", event => {
		if (event.code === "KeyA" || event.code === "KeyD" || event.code === "ArrowLeft" || event.code === "ArrowRight") {
			rotation = 0;
		} else if (event.code === "ArrowUp" || event.code === "KeyW") {
			forward = false;
			rocketSound.pause();
		}
	});

	const animate = () => {
		colHandler.checkCollisions();
		frameCount = frameCount + 1;
		time[2] = new Date().getTime();
		const dT = (time[2] - time[1]) / 1000;

		if (forward) {
			rocket.lightUpFlame();
			if (frameCount % 10 === 0) {
				rocket.variateFlame();
			}
			rocket.move(dT,thrust);
		} else {
			rocket.move(dT);
			rocket.estinguishFlame();
		}

		switch (rotation) {
		case 1: {
			rocket.rotate(-rotationSpeed);
			break;
		}
		case 2: {
			rocket.rotate(rotationSpeed);
			break;
		}
		}

		astCtx.fillRect(0, 0, astCnv.width, astCnv.height);

		asteroids.forEach(ast => {
			ast.move(dT,  time[2] - time[0] < astAccTime * 1000 ? astInitialThrust : 0);
			ast.drawSolid(astCtx, astCnv);
		});

		rocket.drawSolid(astCtx, astCnv);

		requestAnimationFrame(animate);
		time[1] = time[2];
	};
	
	setUpAnim();
	animate();	
} else {
	throw new Error("canvas unsupported by the browser");
}