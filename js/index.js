/* eslint-disable no-undef */
const astCnv = document.getElementById("asteroids");
const astCtx = astCnv.getContext("2d");
const rotationSpeed = 3;
const thrust = 10;

const setUpAnim = () => {
	astCtx.fillStyle = "rgba(0, 0, 0, 0.5)";
	astCtx.strokeStyle = "white";
	astCtx.lineWidth = 1.5;
};

astCnv.height = innerHeight * 0.8;
astCnv.width = innerWidth * 0.96;

window.onresize = () => {
	astCnv.height = innerHeight * 0.8;
	astCnv.width = innerWidth * 0.96;
	setUpAnim();
};

let rotation = 0;
let forward = false;

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
		forward = true;
		break;
	}
	case "KeyW": {
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
	}
});

let isFirstTimer = true;

if (astCtx) {
	setUpAnim();
	const rocket = new Rocket(astCnv.width/2, astCnv.height/2);
	let time = [new Date().getTime(), new Date().getTime(), new Date().getTime()];
	setInterval(() => {
		const elapsedTime = (time[2] - time[0]) / 1000;
		const secondes = Math.round(elapsedTime % 60);
		const minutes = Math.round((elapsedTime - secondes) / 60);
		document.getElementById("timer").innerHTML = `Time: ${minutes > 0 ? `${minutes}:` : ""}${secondes}`;
	}, () => {
		if (isFirstTimer) {
			isFirstTimer = false;
			return 0;
		} else {
			return 1000;
		}
	});
	const animate = () => {
		time[2] = new Date().getTime();
		const dT = (time[2] - time[1])/1000;
		if (forward) {
			rocket.move(dT,thrust);
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
		myAnim = requestAnimationFrame(animate);
		time[1] = time[2];
	};
	animate();	
} else {
	throw new Error("canvas unsupported by the browser");
}