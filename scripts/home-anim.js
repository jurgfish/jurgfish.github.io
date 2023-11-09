// Copyright © 2021-2022, jurgfish. All rights reserved.
//
// https://github.com/jurgfish/jurgfish.github.io
//
////////////////////////////////////////////////////////////////////////////

const allContent = document.getElementById("content");
const logoElem = document.getElementById("logo");
const logoTxtElem = document.getElementById("logotxt");
const infoElem = document.getElementById("info");
const cprElem = document.getElementById("cpr");
const toggleAnnounce = document.getElementById("showannounce");
const announceSpan = document.getElementById("announcelinks");

const animationSpeed = 0.1;
const logoV = -1;
const logoA = 0.025;
const logoOpaRate = 0.025;
const slideStart = 10;
const slideRate = 0.3;
const restartOpaRate = 0.05;
const frameRate = 1000 / 60;
const logoTimeout = 300;

let announceHidden = true;

////////////////////////////////////////////////////////////////////////////

// animation compatibility
window.requestAnimationFrame = window.requestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.msRequestAnimationFrame ||
    function(callback) { return setTimeout(callback, frameRate); };

function resetScroll() {
    if ("scrollRestoration" in history) {
        history.scrollRestoration = "manual";
    }
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
}

////////////////////////////////////////////////////////////////////////////

function slideElemIn(elem, xdir) {
    const opaRate = slideRate / slideStart;
    const dir = (xdir) ? 'X' : 'Y';
    let t0 = null;
    let opa = 0;
    elem.style.opacity = 0;
    elem.style.transform = `translate${dir}(${slideStart}px)`;
    elem.style.visibility = "visible";

    function frame(t) {
        if (!t0) t0 = t;
        const elap = (t - t0) * animationSpeed;
        const p = slideStart - (slideRate * elap);
        elem.style.transform = `translate${dir}(${p}px)`;
        if (opa < 1) {
            elem.style.opacity = opa;
            opa = opaRate * elap;
        }
        if (p < 0) {
            elem.style.transform = `translate${dir}(0px)`;
            elem.style.opacity = 1;
        } else {
            window.requestAnimationFrame(frame);
        }
    }
    window.requestAnimationFrame(frame);
}

function revealLogoTxt() {
    let t0 = null;
    let opa = 0;
    logoTxtElem.style.opacity = 0;
    logoTxtElem.style.visibility = "visible";

    function frame(t) {
        if (!t0) t0 = t;
        const elap = (t - t0) * animationSpeed;
        const y = (-logoV * elap) - (logoA * (elap * elap));
        logoTxtElem.style.transform = `translateY(${y}px)`;
        if (opa < 1) {
            logoTxtElem.style.opacity = opa;
            opa = logoOpaRate * elap;
        }
        if (y < 0) {
            logoTxtElem.style.transform = "translateY(0px)";
            logoTxtElem.style.opacity = 1;
            slideElemIn(infoElem, true);
            slideElemIn(cprElem, false);
        } else {
            window.requestAnimationFrame(frame);
        }
    }
    window.requestAnimationFrame(frame);
}

function revealLogo() {
    let t0 = null;
    let opa = 0;
    logoElem.style.opacity = 0;
    logoElem.style.visibility = "visible";

    function frame(t) {
        if (!t0) t0 = t;
        const elap = (t - t0) * animationSpeed;
        const y = (logoV * elap) + (logoA * (elap * elap)) - 1;
        logoElem.style.transform = `translateY(${y}px)`;
        if (opa < 1) {
            logoElem.style.opacity = opa;
            opa = logoOpaRate * elap;
        }
        if (y > 0) {
            logoElem.style.transform = "translateY(0px)";
            logoElem.style.opacity = 1;
            revealLogoTxt();
        } else {
            window.requestAnimationFrame(frame);
        }
    }
    window.requestAnimationFrame(frame);
}

////////////////////////////////////////////////////////////////////////////

function refreshPage() {
    let t0 = null;
    let opa = 1;

    function frame(t) {
        if (!t0) t0 = t;
        const elap = (t - t0) * animationSpeed;
        allContent.style.opacity = opa;
        opa = 1 - (restartOpaRate * elap);
        if (opa < 0) {
            allContent.style.opacity = 0;
            location.reload();
        } else {
            window.requestAnimationFrame(frame);
        }
    }
    window.requestAnimationFrame(frame);
}

logoElem.onclick = refreshPage;
logoTxtElem.onclick = refreshPage;

toggleAnnounce.onclick = function() {
    if (announceHidden) {
        toggleAnnounce.title = "hide announcement links";
        announceSpan.style.display = "inline";
        announceHidden = false;
    } else {
        toggleAnnounce.title = "show announcement links";
        announceSpan.style.display = "none";
        announceHidden = true;
    }
    document.activeElement.blur();
};

document.onkeydown = function(event) {
    if (event.key === "Enter" || event.keyCode === 13 ||
            event.which === 13) {
        if (document.activeElement === toggleMusic) {
            event.preventDefault();
            toggleMusic.click();
        } else if (document.activeElement === toggleAnnounce) {
            event.preventDefault();
            toggleAnnounce.click();
        }
    }
};

function toggleDarkMode() {
    const dark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    if (dark) {
        logoElem.src = "vis/jurgfishdarkmode.png";
        logoTxtElem.src = "vis/jurgfishtxtdarkmode.png";
    } else {
        logoElem.src = "vis/jurgfish.png";
        logoTxtElem.src = "vis/jurgfishtxt.png";
    }
}

if (window.matchMedia) {
    const darkQuery = window.matchMedia("(prefers-color-scheme: dark)");
    darkQuery.addEventListener("change", toggleDarkMode);
    toggleDarkMode();
}

////////////////////////////////////////////////////////////////////////////

// begin routine
resetScroll();
setTimeout(revealLogo, logoTimeout);

////////////////////////////////////////////////////////////////////////////


