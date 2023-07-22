const astCnv = document.getElementById("asteroids");
astCnv.height = innerHeight * 0.8;
astCnv.width = innerWidth * 0.96;
const astCtx = astCnv.getContext("2d");

if (astCtx) {

	// eslint-disable-next-line no-undef
	const rocket = new Rocket(astCnv.width/2, astCnv.height/2);
	const rotationSpeed = 3;
	const thrust = 10;
	const rocketSound = new Audio("sounds/rocket.mp3");
	rocketSound.loop = true;
	rocketSound.volume = 0.1;
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
	let time = [new Date().getTime(), new Date().getTime(), new Date().getTime()]; // initial time, last time, current time

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
		frameCount = frameCount + 1;
		time[2] = new Date().getTime();
		const dT = (time[2] - time[1]) / 1000;
		if (forward) {
			rocket.lightUpFlame();
			rocket.move(dT,thrust);
			if (frameCount % 10 === 0) {
				rocket.variateFlame();
			}
		} else {
			rocket.estinguishFlame();
		}
		switch (rotation) {
		case 0: {
			rocket.move(dT);
			break;
		}
		case 1: {
			rocket.rotate(-rotationSpeed);
			rocket.move(dT);
			break;
		}
		case 2: {
			rocket.rotate(rotationSpeed);
			rocket.move(dT);
			break;
		}
		}
		astCtx.fillRect(0, 0, astCnv.width, astCnv.height);
		rocket.drawSolid(astCtx, astCnv);
		requestAnimationFrame(animate);
		time[1] = time[2];
	};
	
	setUpAnim();
	animate();	
} else {
	throw new Error("canvas unsupported by the browser");
}