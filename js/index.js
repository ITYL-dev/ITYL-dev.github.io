/* eslint-disable no-undef */
const astCnv = document.getElementById("asteroids");
const astCtx = astCnv.getContext("2d");
const rotationSpeed = 2;
const thrust = 7;

const setUpAnim = () => {
	astCtx.fillStyle = "rgba(0, 0, 0, 0.25)";
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

let movement = "none";

addEventListener("keydown", event => {
	switch (event.code) {
	case "KeyA": {
		movement = "rotateLeft";
		break;
	}
	case "KeyD": {
		movement = "rotateRight";
		break;
	}
	case "ArrowLeft": {
		movement = "rotateLeft";
		break;
	}
	case "ArrowRight": {
		movement = "rotateRight";
		break;
	}
	case "ArrowUp": {
		movement = "applyForce";
		break;
	}
	case "KeyW": {
		movement = "applyForce";
		break;
	}
	default: {
		console.log("unbound key: ", event.key);
	}	
	}
});

addEventListener("keyup", () => {
	movement = "none";
});

let isFirstTimer = true;

if (astCtx) {
	setUpAnim();
	const rocket = new Rocket(astCnv.width/2, astCnv.height/2);
	let time = [new Date().getTime(), new Date().getTime(), new Date().getTime()];
	setInterval(() => {
		const elapsedTime =(time[2] - time[0]) / 1000;
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
		switch (movement) {
		case "rotateLeft": {
			rocket.rotate(rotationSpeed);
			rocket.move(dT);
			break;
		}
		case "rotateRight": {
			rocket.rotate(-rotationSpeed);
			rocket.move(dT);
			break;
		}
		case "applyForce": {
			rocket.move(dT,thrust);
			break;
		}
		case "none": {
			rocket.move(dT);
			break;
		}
		default: {
			rocket.move(dT);
			throw new Error("unvalid movement id");
		}
		}
		astCtx.fillRect(0, 0, astCnv.width, astCnv.height);
		rocket.drawSolid(astCtx);
		myAnim = requestAnimationFrame(animate);
		time[1] = time[2];
	};
	animate();	
} else {
	throw new Error("canvas unsupported by the browser");
}