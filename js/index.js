const header = document.querySelector("header");
const navbar = document.querySelector("nav");
const main = document.querySelector("main");
const divs = Array.prototype.slice.call(document.querySelectorAll("main > div"));
const headerMarginTop = 15;
const sticky = header.offsetTop - headerMarginTop;
let divsVertical = false;
let divsScrollWidthHorizontal = divs[0].scrollWidth;
let navbarVertical = false;
let navbarScrollWidthHorizontal = navbar.scrollWidth;

const checkNavbarWidth = () => {
	if (!navbarVertical && navbar.scrollWidth > navbar.clientWidth) {
		navbarScrollWidthHorizontal = navbar.scrollWidth;
		navbar.classList.add("flex-column");
		navbarVertical = true;
		navbar.style.height = (1.1 * navbar.scrollHeight).toString() + "px";

	}
	if (navbarVertical && navbar.clientWidth >= navbarScrollWidthHorizontal) {
		navbar.classList.remove("flex-column");
		navbarVertical = false;
		navbar.style.height = "fit-content";
	}
	if (!divsVertical && divs[0].scrollWidth > divs[0].clientWidth) {
		divsScrollWidthHorizontal = divs[0].scrollWidth;
		divs.map(div => div.classList.add("flex-column"));
		divsVertical = true;
	}
	if (divsVertical && divs[0].clientWidth >= divsScrollWidthHorizontal) {
		divs.map(div => div.classList.remove("flex-column"));
		divsVertical = false;
	}
};

window.onscroll = () => {
	if (window.scrollY >= sticky) {
		header.classList.add("sticky");
		main.style.paddingTop = (header.scrollHeight + 2*headerMarginTop).toString() + "px";
		console.log(main.style.paddingTop);
	} else {
		header.classList.remove("sticky");
		main.style.paddingTop = "0";
	}
};

window.onresize = checkNavbarWidth;
window.onload = checkNavbarWidth;
window.ondeviceorientation = checkNavbarWidth;