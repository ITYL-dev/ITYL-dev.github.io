const header = document.querySelector("header");
const navbar = document.querySelector("nav");
const sticky = header.offsetTop;
let vertical = false;
let navbarScrollWidthHorizontal = navbar.scrollWidth;

const checkNavbarWidth = () => {
	if (!vertical && navbar.scrollWidth > navbar.clientWidth) {
		navbarScrollWidthHorizontal = navbar.scrollWidth;
		navbar.classList.add("flex-column");
		vertical = true;
	}
	if (vertical && navbar.clientWidth >= navbarScrollWidthHorizontal) {
		navbar.classList.remove("flex-column");
		vertical = false;
	}
};

window.onscroll = () => {
	if (window.scrollY >= sticky) {
		header.classList.add("sticky");
	} else {
		header.classList.remove("sticky");
	}
};

window.onresize = checkNavbarWidth;
window.onload = checkNavbarWidth;
