/* eslint-disable no-undef */
const astCnv = document.getElementById("asteroids");
const astCtx = astCnv.getContext("2d");
const rotationSpeed = 5;

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

if (astCtx) {
	setUpAnim();
	const rocket = new Rocket(astCnv.width/2, astCnv.height/2);
	const animate = () => {
		myAnim = requestAnimationFrame(animate);
		astCtx.fillRect(0, 0, astCnv.width, astCnv.height);
		rocket.drawSolid(astCtx);
		switch (movement) {
		case "rotateLeft": {
			rocket.rotate(rotationSpeed);
			break;
		}
		case "rotateRight": {
			rocket.rotate(-rotationSpeed);
			break;
		}
		case "applyForce": {
			break;
		}
		case "none": {
			break;
		}
		default: {
			throw new Error("unvalid movement id");
		}
		}
	};
	animate();	
} else {
	throw new Error("canvas unsupported by the browser");
}