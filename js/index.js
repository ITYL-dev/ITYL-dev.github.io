const header = document.querySelector("header");
const navbar = document.querySelector("nav");
const main = document.querySelector("main");
const footer = document.querySelector("footer");
const divs = Array.prototype.slice.call(document.querySelectorAll("main > div"));
const headerMarginTop = 15;
const sticky = header.offsetTop - headerMarginTop;
let divsVertical = false;
let maxDivsScrollWidthHorizontalSaved;
let maxDivsScrollWidthHorizontalSavedIndex;
let navbarVertical = false;
let navbarScrollWidthHorizontal;

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

	if (!divsVertical) {
		const divsScrollWidthHorizontals = divs.map(div => div.scrollWidth);
		let maxDivsScrollWidthHorizontal = divsScrollWidthHorizontals[0];
		let iMax = 0;
		divsScrollWidthHorizontals.forEach((w, i) => {
			if (w > maxDivsScrollWidthHorizontal) {
				maxDivsScrollWidthHorizontal = w;
				iMax = i;
			}
		});
		maxDivsScrollWidthHorizontalSaved = maxDivsScrollWidthHorizontal;
		maxDivsScrollWidthHorizontalSavedIndex = iMax;
	}

	if (!divsVertical && maxDivsScrollWidthHorizontalSaved > divs[maxDivsScrollWidthHorizontalSavedIndex].clientWidth) {
		divs.map(div => div.classList.add("flex-column"));
		footer.classList.add("full-width");
		divsVertical = true;
	}
	if (divsVertical && divs[maxDivsScrollWidthHorizontalSavedIndex].clientWidth >= maxDivsScrollWidthHorizontalSaved) {
		divs.map(div => div.classList.remove("flex-column"));
		footer.classList.remove("full-width");
		divsVertical = false;
	}
};

window.onscroll = () => {
	if (window.scrollY >= sticky) {
		header.classList.add("sticky");
		main.style.paddingTop = (header.scrollHeight + 2*headerMarginTop).toString() + "px";
	} else {
		header.classList.remove("sticky");
		main.style.paddingTop = "0";
	}
};

window.onresize = checkNavbarWidth;
window.onload = checkNavbarWidth;
window.ondeviceorientation = checkNavbarWidth;