
"use client";
import { MenuItems } from "@/shared/layout-components/sidebar/nav";
import store from "@/shared/redux/store";
import {  useState } from "react";

export function Dark(actionfunction) {
	const theme  = store.getState();
	actionfunction({
		...theme,
		"class": "dark",
		"dataHeaderStyles": "dark",
		"dataMenuStyles": "dark",
		"bodyBg": "",
		"darkBg": "",
		"inputBorder": "",
		"Light": "",
        
	});
	localStorage.setItem("ynexdarktheme", "dark");
	localStorage.removeItem("ynexlighttheme");
	localStorage.removeItem("darkBgRGB");
}
export function Light(actionfunction) {
	const theme = store.getState();
	actionfunction({
		...theme,
		"class": "light",
		"dataHeaderStyles": "light",
		"bodyBg": "",
		"darkBg": "",
		"inputBorder": "",
		"Light": "",
		"dataMenuStyles": "dark",
        
	});
	localStorage.setItem("ynexlighttheme", "light");
	localStorage.removeItem("ynexdarktheme");
	localStorage.removeItem("bodyBgRGB");
	localStorage.removeItem("primaryRGB");
	localStorage.removeItem("primaryRGB1");
	localStorage.removeItem("inputBorder");
	localStorage.removeItem("Light");
	localStorage.removeItem("ynexMenu");
	localStorage.removeItem("ynexHeader");

}

export function Ltr(actionfunction) {
	const theme = store.getState();
	actionfunction({
		...theme, "dir": "ltr",
        
	});
	localStorage.removeItem("ynexrtl");
}
export function Rtl(actionfunction) {
	const theme = store.getState();
	actionfunction({
		...theme, "dir": "rtl",
        
	});
	localStorage.setItem("ynexrtl", "rtl");
}
export const Vertical = (actionfunction) => {
	const theme = store.getState();
	actionfunction({
		...theme,
		"dataNavLayout": "vertical",
		// "dataMenuStyles": "dark",
		"dataVerticalStyle": "overlay",
		"dataToggled": "",
		"dataNavStyle": "",
        
	});
	localStorage.setItem("ynexlayout", "vertical");
	localStorage.removeItem("ynexnavstyles");

};

export const HorizontalClick = (actionfunction) => {
	const theme = store.getState();
	setTimeout(() => {
		document.querySelector(".main-content").click();
	}, 100);
	actionfunction({
		...theme,
		"dataNavLayout": "horizontal",
		"dataVerticalStyle": "",
		"dataNavStyle": localStorage.ynexnavstyles ? localStorage.ynexnavstyles : "menu-click",
        
	});
	localStorage.setItem("ynexlayout", "horizontal");
	localStorage.removeItem("ynexverticalstyles");
	const Sidebar = document.querySelector(".main-menu");
	if(Sidebar){
		Sidebar.style.marginInline = "0px";
	}
	closeMenu();
};
export const Menuclick = (actionfunction) => {
	const theme = store.getState();
	actionfunction({
		...theme,
		"dataNavStyle": "menu-click",
		"dataToggled": "menu-click-closed",
		"dataVerticalStyle": "",
        
	});
	localStorage.setItem("ynexnavstyles", "menu-click");

};
export const MenuHover = (actionfunction) => {
	const theme = store.getState();
	actionfunction({
		...theme,
		"dataNavStyle": "menu-hover",
		"dataVerticalStyle": "",
		"dataToggled": "menu-hover-closed",
		"horStyle": "",
        
	});
	localStorage.setItem("ynexnavstyles", "menu-hover");
	localStorage.removeItem("ynexverticalstyles");
	closeMenu();
};

export const IconClick = (actionfunction) => {
	const theme = store.getState();
	actionfunction({
		...theme,
		"dataVerticalStyle": "",
		"dataNavStyle": "icon-click",
		"dataToggled": "icon-click-closed",
        
	});
	localStorage.setItem("ynexnavstyles", "icon-click");
	localStorage.removeItem("ynexverticalstyles");
	const Sidebar = document.querySelector(".main-menu");
	if(Sidebar){
		Sidebar.style.marginInline = "0px";
	}
};
function closeMenu() {
	const closeMenudata = (items) => {
		items?.forEach((item) => {
			item.active = false;
			closeMenudata(item.children);
		});
	};
	closeMenudata(MenuItems);
}

export const IconHover = (actionfunction) => {

	const theme = store.getState();
	actionfunction({
		...theme,
		"dataNavStyle": "icon-hover",
		"dataToggled": "icon-hover-closed",
		"dataVerticalStyle": "",
        
	});
	localStorage.setItem("ynexnavstyles", "icon-hover");
	localStorage.removeItem("ynexverticalstyles");
	const Sidebar = document.querySelector(".main-menu");
	if(Sidebar){
		Sidebar.style.marginInline = "0px";
	}
	// closeMenu();
	//  if(theme.dataNavStyle== "icon-hover"){
	//  }
};

export const Regular = (actionfunction) => {
	const theme = store.getState();
	actionfunction({
		...theme,
		"dataPageStyle": "regular",
        
	});
	localStorage.setItem("ynexregular", "Regular");
	localStorage.removeItem("ynexclassic");
	localStorage.removeItem("ynexmodern");
};
export const Classic = (actionfunction) => {
	const theme = store.getState();
	actionfunction({
		...theme,
		"dataPageStyle": "classic",
        
	});
	localStorage.setItem("ynexclassic", "Classic");
	localStorage.removeItem("ynexregular");
	localStorage.removeItem("ynexmodern");
};
export const Modern = (actionfunction) => {
	const theme = store.getState();
	actionfunction({
		...theme,
		"dataPageStyle": "modern",
        
	});
	localStorage.setItem("ynexmodern", "Modern");
	localStorage.removeItem("ynexregular");
	localStorage.removeItem("ynexclassic");
};
export function Enable(actionfunction) {
	const theme = store.getState();
	actionfunction({
		...theme,
		"loader": "enable",
        
	});
	localStorage.setItem("ynexloaderenable", "enable");
	localStorage.removeItem("ynexloaderdisable");
}
export function Disable(actionfunction) {
	const theme = store.getState();
	actionfunction({
		...theme,
		"loader": "disable",
        
	});
	localStorage.setItem("ynexloaderdisable", "disable");
	localStorage.removeItem("ynexloaderenable");
}

export const Fullwidth = (actionfunction) => {
	const theme = store.getState();
	actionfunction({
		...theme,
		"dataWidth": "fullwidth",
        
	});
	localStorage.setItem("ynexfullwidth", "Fullwidth");
	localStorage.removeItem("ynexboxed");

};
export const Boxed = (actionfunction) => {
	const theme = store.getState();
	actionfunction({
		...theme,
		"dataWidth": "boxed",
        
	});
	localStorage.setItem("ynexboxed", "Boxed");
	localStorage.removeItem("ynexfullwidth");
};
export const FixedMenu = (actionfunction) => {
	const theme = store.getState();
	actionfunction({
		...theme,
		"dataMenuPosition": "fixed",
        
	});
	localStorage.setItem("ynexmenufixed", "MenuFixed");
	localStorage.removeItem("ynexmenuscrollable");
};
export const scrollMenu = (actionfunction) => {
	const theme = store.getState();
	actionfunction({
		...theme,
		"dataMenuPosition": "scrollable",
        
	});
	localStorage.setItem("ynexmenuscrollable", "Menuscrolled");
	localStorage.removeItem("ynexmenufixed");
};
export const Headerpostionfixed = (actionfunction) => {
	const theme = store.getState();
	actionfunction({
		...theme,
		"dataHeaderPosition": "fixed",
        
	});
	localStorage.setItem("ynexheaderfixed", "FixedHeader");
	localStorage.removeItem("ynexheaderscrollable");
};
export const Headerpostionscroll = (actionfunction) => {
	const theme = store.getState();
	actionfunction({
		...theme,
		"dataHeaderPosition": "scrollable",
        
	});
	localStorage.setItem("ynexheaderscrollable", "ScrollableHeader");
	localStorage.removeItem("ynexheaderfixed");
};

export const Defaultmenu = (actionfunction) => {
	const theme = store.getState();
	actionfunction({
		...theme,
		"dataVerticalStyle": "overlay",
		"dataNavLayout": "vertical",
		"dataToggled": "",
		"dataNavStyle": "",
        
	});
	localStorage.removeItem("ynexverticalstyles");
	localStorage.setItem("ynexverticalstyles", "default");
	// let icon = document.getElementById("switcher-default-menu")as HTMLInputElement;
	// if (icon) {
	// 	icon.checked = true;
	// }

};

export const Closedmenu = (actionfunction) => {
	const theme = store.getState();
	actionfunction({
		...theme,
		"dataNavLayout": "vertical",
		"dataVerticalStyle": "closed",
		"dataToggled": "close-menu-close",
        
	});
	localStorage.setItem("ynexverticalstyles", "closed");

};
function icontextOpenFn() {
	let html = document.documentElement;
	if (html.getAttribute("data-toggled") === "icon-text-close") {
		html.setAttribute("data-icon-text", "open");
	}
}
function icontextCloseFn() {
	let html = document.documentElement;
	if (html.getAttribute("data-toggled") === "icon-text-close") {
		html.removeAttribute("data-icon-text");
	}
}
export const iconText = (actionfunction) => {
	const theme = store.getState();
	actionfunction({
		...theme,
		"dataNavLayout": "vertical",
		"dataVerticalStyle": "icontext",
		"dataToggled": "icon-text-close",
		"dataNavStyle": "",
        
	});
	localStorage.setItem("ynexverticalstyles", "icontext");
	setTimeout(() => {
		const MainContent = document.querySelector(".main-content");
		const appSidebar = document.querySelector(".app-sidebar");
	
		appSidebar?.addEventListener("click", () => {
			icontextOpenFn();
		});
		MainContent?.addEventListener("click", () => {
			icontextCloseFn();
		});
	}, 300);
};

export const iconOverayFn = (actionfunction) => {
	var icon = document.getElementById("switcher-icon-overlay");
	const theme = store.getState();
	actionfunction({
		...theme,
		"dataNavLayout": "vertical",
		"dataVerticalStyle": "overlay",
		"dataToggled": "icon-overlay-close",
        
	});
	localStorage.setItem("ynexverticalstyles", "overlay");

	if(icon){
		icon.checked=true;
	}
	setTimeout(() => {
		const MainContent = document.querySelector(".main-content");
		const appSidebar = document.querySelector(".app-sidebar");
		appSidebar?.addEventListener("click", () => {
			DetachedOpenFn();
		});
		MainContent?.addEventListener("click", () => {
			DetachedCloseFn();
		});
	}, 200);
};
function DetachedOpenFn() {
	if (window.innerWidth > 992) {
		console.log("detachedopen");
		let html = document.documentElement;
		if (html.getAttribute("data-toggled") === "detached-close" || html.getAttribute("data-toggled") === "icon-overlay-close") {
			html.setAttribute("data-icon-overlay", "open");
		}
	}
}
function DetachedCloseFn() {
	if (window.innerWidth > 992) {
		console.log("detachedclose");
		let html = document.documentElement;
		if (html.getAttribute("data-toggled") === "detached-close" || html.getAttribute("data-toggled") === "icon-overlay-close") {
			html.removeAttribute("data-icon-overlay");
		}
	}
}
export const DetachedFn = (actionfunction) => {
	const theme = store.getState();
	actionfunction({
		...theme,
		"dataNavLayout": "vertical",
		"dataVerticalStyle": "detached",
		"dataToggled": "detached-close",
		"dataNavStyle": "",
        
	});
	localStorage.setItem("ynexverticalstyles", "detached");

	setTimeout(() => {
		const MainContent = document.querySelector(".main-content");
		const appSidebar = document.querySelector(".app-sidebar");

		appSidebar?.addEventListener("click", () => {
			DetachedOpenFn();
		});
		MainContent?.addEventListener("click", () => {

			DetachedCloseFn();
		});
	}, 300);
};
export const DoubletFn = (actionfunction) => {
	const theme = store.getState();
	actionfunction({
		...theme,
		"dataNavLayout": "vertical",
		"dataVerticalStyle": "doublemenu",
		"dataToggled": "double-menu-open",
		"dataNavStyle": "",
        
	});
	localStorage.removeItem("ynexnavstyles"); 
	localStorage.setItem("ynexverticalstyles", "doublemenu");

	setTimeout(() => {
		if (!document.querySelector(".main-menu .slide.active ul")) {
			const theme = store.getState();
			actionfunction(
				{
					...theme,
					"dataToggled": "double-menu-close",
                    
				}
			);
		}
	}, 100);
};

export const colorMenu = (actionfunction) => {
	const theme = store.getState();
	actionfunction({
		...theme,
		"dataMenuStyles": "color",
        
	});
	localStorage.setItem("ynexMenu", "color");
	localStorage.removeItem("gradient");

};

export const lightMenu = (actionfunction) => {
	const theme = store.getState();
	actionfunction({
		...theme,
		"dataMenuStyles": "light",
        
	});
	localStorage.setItem("ynexMenu", "light");
	localStorage.removeItem("dark");
};

export const darkMenu = (actionfunction) => {
	const theme = store.getState();
	actionfunction({
		...theme,
		"dataMenuStyles": "dark",
        
	});
	localStorage.setItem("ynexMenu", "dark");
	localStorage.removeItem("light");
};

export const gradientMenu = (actionfunction) => {
	const theme = store.getState();
	actionfunction({
		...theme,
		"dataMenuStyles": "gradient",
        
	});
	localStorage.setItem("ynexMenu", "gradient");
	localStorage.removeItem("color");
};
export const transparentMenu = (actionfunction) => {
	const theme = store.getState();
	actionfunction({
		...theme,
		"dataMenuStyles": "transparent",
        
	});
	localStorage.setItem("ynexMenu", "transparent");
	localStorage.removeItem("gradient");
};

export const lightHeader = (actionfunction) => {
	const theme = store.getState();
	actionfunction({
		...theme,
		"dataHeaderStyles": "light",
        
	});
	localStorage.setItem("ynexHeader", "light");
	localStorage.removeItem("dark");
};
export const darkHeader = (actionfunction) => {
	const theme = store.getState();
	actionfunction({
		...theme,
		"dataHeaderStyles": "dark",
        
	});
	localStorage.setItem("ynexHeader", "dark");
	localStorage.removeItem("light");
};
export const colorHeader = (actionfunction) => {
	const theme = store.getState();
	actionfunction({
		...theme,
		"dataHeaderStyles": "color",
        
	});
	localStorage.removeItem("dark");
	localStorage.setItem("ynexHeader", "color");
};
export const gradientHeader = (actionfunction) => {
	const theme = store.getState();
	actionfunction({
		...theme,
		"dataHeaderStyles": "gradient",
        
	});
	localStorage.removeItem("transparent");
	localStorage.setItem("ynexHeader", "gradient");
};
export const transparentHeader = (actionfunction) => {
	const theme = store.getState();
	actionfunction({
		...theme,
		"dataHeaderStyles": "transparent",
        
	});
	localStorage.removeItem("gradient");
	localStorage.setItem("ynexHeader", "transparent");
};

export const primaryColor1 = (actionfunction) => {
	const theme = store.getState();
	actionfunction({
		...theme,
		"colorPrimaryRgb": "58, 88, 146",
		"colorPrimary": "58 88 146",
        
	});
	localStorage.setItem("primaryRGB", "58, 88, 146");
	localStorage.setItem("primaryRGB1", "58 88 146");
};
export const primaryColor2 = (actionfunction) => {
	const theme = store.getState();
	actionfunction({
		...theme,
		"colorPrimaryRgb": "92, 144, 163",
		"colorPrimary": "92 144 163",
        
	});
	localStorage.setItem("primaryRGB", "92, 144, 163");
	localStorage.setItem("primaryRGB1", "92 144 163");
};
export const primaryColor3 = (actionfunction) => {
	const theme = store.getState();
	actionfunction({
		...theme,
		"colorPrimaryRgb": "161, 90, 223",
		"colorPrimary": "161 90 223",
        
	});
	localStorage.setItem("primaryRGB", "161, 90, 223");
	localStorage.setItem("primaryRGB1", "161 90 223");
};
export const primaryColor4 = (actionfunction) => {
	const theme = store.getState();
	actionfunction({
		...theme,
		"colorPrimaryRgb": "78, 172, 76",
		"colorPrimary": "78 172 76",
        
	});
	localStorage.setItem("primaryRGB", "78, 172, 76");
	localStorage.setItem("primaryRGB1", "78 172 76");
};
export const primaryColor5 = (actionfunction) => {
	const theme = store.getState();
	actionfunction({
		...theme,
		"colorPrimaryRgb": "223, 90, 90",
		"colorPrimary": "223 90 90",
        
	});
	localStorage.setItem("primaryRGB", "223, 90, 90");
	localStorage.setItem("primaryRGB1", "223 90 90");
};

export const backgroundColor1 = (actionfunction) => {
	const theme = store.getState();
	actionfunction({
		...theme,
		"darkBg": "34 44 110",
		"bodyBg": "20 30 96",
		"inputBorder": "55 67 98",
		"Light": "25 38 101",
		"class": "dark",
		"dataMenuStyles": "dark",
		"dataHeaderStyles": "dark",
        
	});
	localStorage.setItem("darkBgRGB", "34 44 110");
	localStorage.setItem("bodyBgRGB", "20 30 96");
	localStorage.setItem("Light", "25 38 101");
	localStorage.setItem("inputBorder", "55 67 98");
	localStorage.setItem("ynexMenu", "dark");
	localStorage.setItem("ynexHeader", "dark");

};
export const backgroundColor2 = (actionfunction) => {
	const theme = store.getState();
	actionfunction({
		...theme,
		"darkBg": "22 92 129",
		"bodyBg": "8 78 115",
		"Light": "13 86 120",
		"inputBorder": "86 98 55",
		"class": "dark",
		"dataMenuStyles": "dark",
		"dataHeaderStyles": "dark",
        
	});
	localStorage.setItem("darkBgRGB", "22 92 129");
	localStorage.setItem("bodyBgRGB", "8 78 115");
	localStorage.setItem("Light", "13 86 120",);
	localStorage.setItem("inputBorder", "86 98 55",);
	localStorage.setItem("ynexMenu", "dark");
	localStorage.setItem("ynexHeader", "dark");
};
export const backgroundColor3 = (actionfunction) => {
	const theme = store.getState();
	actionfunction({
		...theme,
		"darkBg": "104 51 149",
		"bodyBg": "90 37 135",
		"Light": "95 45 140",
		"inputBorder": "84 55 98",
		"class": "dark",
		"dataMenuStyles": "dark",
		"dataHeaderStyles": "dark",
        
	});
	localStorage.setItem("darkBgRGB", "104 51 149");
	localStorage.setItem("bodyBgRGB", "90 37 135");
	localStorage.setItem("Light", "95 45 140");
	localStorage.setItem("inputBorder", "84 55 98");
	localStorage.setItem("ynexMenu", "dark");
	localStorage.setItem("ynexHeader", "dark");
};
export const backgroundColor4 = (actionfunction) => {
	const theme = store.getState();
	actionfunction({
		...theme,
		"darkBg": "24 101 51",
		"bodyBg": "38 115 65",
		"Light": "29 106 56",
		"inputBorder": "55 93 98",
		"class": "dark",
		"dataMenuStyles": "dark",
		"dataHeaderStyles": "dark",
        
	});
	localStorage.setItem("darkBgRGB", "24 101 51");
	localStorage.setItem("bodyBgRGB", "38 115 65");
	localStorage.setItem("Light", "29 106 56");
	localStorage.setItem("inputBorder", "55 93 98");
	localStorage.setItem("ynexMenu", "dark");
	localStorage.setItem("ynexHeader", "dark");
};
export const backgroundColor5 = (actionfunction) => {
	const theme = store.getState();
	actionfunction({
		...theme,
		"darkBg": "120 66 20",
		"bodyBg": "134 80 34",
		"Light": "125 74 25",
		"inputBorder": "98 55 55",
		"class": "dark",
		"dataMenuStyles": "dark",
		"dataHeaderStyles": "dark",
        
	});
	localStorage.setItem("darkBgRGB", "120 66 20");
	localStorage.setItem("bodyBgRGB", "134 80 34");
	localStorage.setItem("Light", "124 74 25");
	localStorage.setItem("inputBorder", "98 55 55");
	localStorage.setItem("ynexMenu", "dark");
	localStorage.setItem("ynexHeader", "dark");
};

const ColorPicker = (props) => {
	return (
		<div className="color-picker-input">
			<input type="color" {...props} />
		</div>
	);
};

function hexToRgb(hex) {
	var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
	return result ? {
		r: parseInt(result[1], 16),
		g: parseInt(result[2], 16),
		b: parseInt(result[3], 16)
	} : null;
}
//themeprimarycolor
const Themeprimarycolor = ({ actionfunction }) => {
   
	const theme = store.getState();
	const [state, updateState] = useState("#FFFFFF");
	const handleInput = (e) => {
		let { r, g, b } = hexToRgb(e.target.value);
		updateState(e.target.value);
		actionfunction({
			...theme,
			"colorPrimaryRgb": `${r} ${g} ${b}`,
			"colorPrimary": `${r} ${g} ${b}`
		});
		localStorage.setItem("dynamiccolor", `${r} ${g} ${b}`);
	};
	return (
		<div className="Themeprimarycolor theme-container-primary pickr-container-primary">
			<ColorPicker onChange={handleInput} value={state} />
		</div>
	);
};

export default Themeprimarycolor;

//themeBackground
export const Themebackgroundcolor = ({ actionfunction }) => {
   
	const theme = store.getState();
	const [state, updateState] = useState("#FFFFFF");
	const handleInput = (e) => {
		let { r, g, b } = hexToRgb(e.target.value);
		updateState(e.target.value);
		actionfunction({
			...theme,
			"bodyBg": `${r + 14} ${g + 14} ${b + 14}`,
			"darkBg": `${r} ${g} ${b}`,
			"inputBorder": `${r + 5} ${g + 5} ${b + 5}`,
			"Light": `${r + 5} ${g + 5} ${b + 5}`,
			"class": "dark",
			"dataHeaderStyles": "dark",
			"dataMenuStyles": "dark",
		});
		localStorage.setItem("darkBgRGB", `${r} ${g} ${b}`);
		localStorage.setItem("bodyBgRGB", `${r + 14} ${g + 14} ${b + 14}`);
		localStorage.setItem("Light", `${r + 5} ${g + 5} ${b + 5}`);
		localStorage.setItem("inputBorder", `${r + 5} ${g + 5} ${b + 5}`);
		localStorage.setItem("ynexMenu", "dark");
		localStorage.setItem("ynexHeader", "dark");

	};
	return (
		<div className="Themebackgroundcolor">
			<ColorPicker onChange={handleInput} value={state} />
		</div>
	);
};

export const bgImage1 = (actionfunction) => {
	const theme = store.getState();
	actionfunction({
		...theme,
		"bgImg": "bgimg1",
        
	});
	localStorage.setItem("bgimage1", "bgimg1");
};
export const bgImage2 = (actionfunction) => {
	const theme = store.getState();
	actionfunction({
		...theme,
		"bgImg": "bgimg2",
        
	});
	localStorage.setItem("bgimage2", "bgimg2");
};
export const bgImage3 = (actionfunction) => {
	const theme = store.getState();
	actionfunction({
		...theme,
		"bgImg": "bgimg3",
        
	});
	localStorage.setItem("bgimage3", "bgimg3");
};
export const bgImage4 = (actionfunction) => {
	const theme = store.getState();
	actionfunction({
		...theme,
		"bgImg": "bgimg4",
        
	});
	localStorage.setItem("bgimage4", "bgimg4");
};
export const bgImage5 = (actionfunction) => {
	const theme = store.getState();
	actionfunction({
		...theme,
		"bgImg": "bgimg5",
        
	});
	localStorage.setItem("bgimage5", "bgimg5");
};
export const Reset = (actionfunction) => {
	const theme = store.getState();
	Vertical(actionfunction);
	actionfunction({
		...theme,
		lang: "en",
		dir: "ltr",
		class: "light",
		dataMenuStyles: "dark",
		dataNavLayout: "vertical",
		dataHeaderStyles: "light",
		dataVerticalStyle: "overlay",
		dataToggled: "",
		dataNavStyle: "",
		horStyle: "",
		dataPageStyle: "regular",
		dataWidth: "fullwidth",
		dataMenuPosition: "fixed",
		dataHeaderPosition: "fixed",
		iconOverlay: "",
		colorPrimaryRgb: "",
		colorPrimary: "",
		bodyBg: "",
		darkBg: "",
		inputBorder: "",
		Light: "",
		bgImg: "",
		loader: "disable",
		iconText: "",
		body: {
			class: ""
		}
	});
	localStorage.clear();
	const icon = document.getElementById("switcher-default-menu");
	if(icon){
		icon.checked=true;
	}
};

export const LocalStorageBackup = (actionfunction, setpageloading) => {

	(localStorage.ynexdarktheme) ? Dark(actionfunction) : "";
	(localStorage.ynexlighttheme) ? Light(actionfunction) : "";
	(localStorage.ynexrtl) ? Rtl(actionfunction) : "";
	(localStorage.ynexregular) ? Regular(actionfunction) : "";
	(localStorage.ynexclassic) ? Classic(actionfunction) : "";
	(localStorage.ynexmodern) ? Modern(actionfunction) : "";
	(localStorage.ynexloaderenable) ? Enable(actionfunction) : "";
	(localStorage.ynexloaderdisable) ? Disable(actionfunction) : "";
	(localStorage.ynexfullwidth) ? Fullwidth(actionfunction) : "";
	(localStorage.ynexboxed) ? Boxed(actionfunction) : "";
	(localStorage.ynexmenufixed) ? FixedMenu(actionfunction) : "";
	(localStorage.ynexmenuscrollable) ? scrollMenu(actionfunction) : "";
	(localStorage.ynexheaderfixed) ? Headerpostionfixed(actionfunction) : "";
	(localStorage.ynexheaderscrollable) ? Headerpostionscroll(actionfunction) : "";
	(localStorage.bgimage1) ? bgImage1(actionfunction) : "";
	(localStorage.bgimage2) ? bgImage2(actionfunction) : "";
	(localStorage.bgimage3) ? bgImage3(actionfunction) : "";
	(localStorage.bgimage4) ? bgImage4(actionfunction) : "";
	(localStorage.bgimage5) ? bgImage5(actionfunction) : "";

	(localStorage.ynexnavstyles === "menu-click") ? Menuclick(actionfunction) : "";
	(localStorage.ynexnavstyles === "menu-hover") ? MenuHover(actionfunction) : "";
	(localStorage.ynexnavstyles === "icon-click") ? IconClick(actionfunction) : "";
	(localStorage.ynexnavstyles === "icon-hover") ? IconHover(actionfunction) : "";

	(localStorage.ynexlayout == "horizontal") && HorizontalClick(actionfunction);

	// // ThemeColor MenuColor Start
	switch (localStorage.ynexMenu) {
	case "light":
		lightMenu(actionfunction);
		break;
	case "dark":
		darkMenu(actionfunction);

		break;
	case "color":
		colorMenu(actionfunction);

		break;
	case "gradient":
		gradientMenu(actionfunction);

		break;
	case "transparent":
		transparentMenu(actionfunction);

		break;
	default:
		break;
	}

	// ThemeColor MenuColor End

	// ThemeColor Header Colors: start
	switch (localStorage.ynexHeader) {
	case "light":
		lightHeader(actionfunction);

		break;
	case "dark":
		darkHeader(actionfunction);

		break;
	case "color":
		colorHeader(actionfunction);

		break;
	case "gradient":
		gradientHeader(actionfunction);

		break;
	case "transparent":
		transparentHeader(actionfunction);

		break;
	default:
		break;
	}
	// ThemeColor Header Colors: End

	// Theme Primary: Colors: Start
	switch (localStorage.primaryRGB) {
	case "58, 88, 146":
		primaryColor1(actionfunction);

		break;
	case "92, 144, 163":
		primaryColor2(actionfunction);

		break;
	case "161, 90, 223":
		primaryColor3(actionfunction);

		break;
	case "78, 172, 76":
		primaryColor4(actionfunction);

		break;
	case "223, 90, 90":
		primaryColor5(actionfunction);

		break;
	default:
		break;
	}
	// Theme Primary: Colors: End
	switch (localStorage.darkBgRGB) {
	case "34 44 110":
		backgroundColor1(actionfunction);

		break;
	case "22 92 129":
		backgroundColor2(actionfunction);

		break;
	case "84 55 98":
		backgroundColor3(actionfunction);

		break;
	case "24 101 51":
		backgroundColor4(actionfunction);

		break;
	case "120 66 20":
		backgroundColor5(actionfunction);

		break;
	default:
		break;
	}

	if (localStorage.ynexverticalstyles) {
		let verticalStyles = localStorage.getItem("ynexverticalstyles");

		switch (verticalStyles) {
		case "default":
			let defaultid = document.getElementById("switcher-default-menu");
			if(defaultid){
				defaultid.checked = true;
			}
			Defaultmenu(actionfunction);

			break;
		case "closed":
			let closedid = document.getElementById("switcher-icontext-menu");
			if(closedid){
				closedid.checked = true;
			}
			Closedmenu(actionfunction);

			break;
		case "icontext":
			let icontextid = document.getElementById("switcher-icontext-menu");
			if(icontextid){
				icontextid.checked = true;
			}
			iconText(actionfunction);

			break;
		case "overlay":
			let overlayid = document.getElementById("switcher-detached");
			if(overlayid){
				overlayid.checked = true;
			}
			iconOverayFn(actionfunction);

			break;
		case "detached":
			let detachedid = document.getElementById("switcher-detached");
			if(detachedid){
				detachedid.checked = true;
			}
			DetachedFn(actionfunction);

			break;
		case "doublemenu":
			let doubleMenuid = document.getElementById("switcher-double-menu"); 
			if(doubleMenuid){
				doubleMenuid.checked = true;
			}
			DoubletFn(actionfunction);

			break;

		default:
			let defaultbutton = document.getElementById("switcher-default-menu");
			if(defaultbutton){
				defaultbutton.checked = true;
			}
			break;
		}
	}

	//Theme Primary:
	if (localStorage.dynamiccolor) {
		const theme = store.getState();
		actionfunction({
			...theme,
			"colorPrimaryRgb": localStorage.dynamiccolor,
			"colorPrimary": localStorage.dynamiccolor,
            
		});
	}
	//Theme BAckground:

	if (localStorage.bodyBgRGB) {
		let updateddarkBg = `${Number(localStorage.bodyBgRGB.split(" ")[0]) + 14} ${Number(localStorage.bodyBgRGB.split(" ")[1]) + 14} ${Number(localStorage.bodyBgRGB.split(" ")[2]) + 14}`;
		const theme = store.getState();
		actionfunction({
			...theme,
			"bodyBg": localStorage.bodyBgRGB,
			"darkBg": updateddarkBg,
			"class": "dark",
			"dataHeaderStyles": "dark",
			"Light": localStorage.Light,
			"inputBorder": localStorage.inputBorder,
            
		});
	}

	switch (localStorage.ynexMenu) {
	case "light":
		lightMenu(actionfunction);
		break;
	case "dark":
		darkMenu(actionfunction);

		break;
	case "color":
		colorMenu(actionfunction);

		break;
	case "gradient":
		gradientMenu(actionfunction);

		break;
	case "transparent":
		transparentMenu(actionfunction);

		break;
	default:
		break;
	}
	// ThemeColor Header Colors: start
	switch (localStorage.ynexHeader) {
	case "light":
		lightHeader(actionfunction);

		break;
	case "dark":
		darkHeader(actionfunction);

		break;
	case "color":
		colorHeader(actionfunction);

		break;
	case "gradient":
		gradientHeader(actionfunction);

		break;
	case "transparent":
		transparentHeader(actionfunction);

		break;
	default:
		break;
	}
	setpageloading(true);

};
