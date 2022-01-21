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
const toggleMusic = document.getElementById("showmusic");
const musicSpan = document.getElementById("musiclinks");
const togglePatrons = document.getElementById("showpatrons");
const patronSpan = document.getElementById("patronlinks");

const animationSpeed = 0.1;
const logoV = -1;
const logoA = 0.025;
const logoOpaRate = 0.025;
const slideStart = 10;
const slideRate = 0.3;
const restartOpaRate = 0.05;
const frameRate = 1000 / 60;
const logoTimeout = 300;
const elemTimeout = 150;
const loadBound = 0.93;

let musicHidden = true;
let patronsHidden = true;
let animIdx = 0;
let animator = null;

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

function getWindowHeight() {
    return window.innerHeight || document.documentElement.clientHeight ||
        document.body.clientHeight;
}
function isElemVisible(elem) {
    const bound = elem.getBoundingClientRect();
    return (bound.top < (getWindowHeight() * loadBound));
}

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

////////////////////////////////////////////////////////////////////////////

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
    infoRunning = false;

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

if (toggleMusic) toggleMusic.onclick = function() {
    if (musicHidden) {
        toggleMusic.title = "hide music links";
        musicSpan.style.display = "inline";
        musicHidden = false;
    } else {
        toggleMusic.title = "show music links";
        musicSpan.style.display = "none";
        musicHidden = true;
    }
    document.activeElement.blur();
}
if (togglePatrons) togglePatrons.onclick = function() {
    if (patronsHidden) {
        togglePatrons.title = "hide patron links";
        patronSpan.style.display = "inline";
        patronsHidden = false;
    } else {
        togglePatrons.title = "show patron links";
        patronSpan.style.display = "none";
        patronsHidden = true;
    }
    document.activeElement.blur();
}

document.onkeydown = function(event) {
    if (event.key === "Enter" || event.keyCode === 13 ||
            event.which === 13) {
        if (document.activeElement === toggleMusic) {
            event.preventDefault();
            toggleMusic.click();
        } else if (document.activeElement === togglePatrons) {
            event.preventDefault();
            togglePatrons.click();
        }
    }
};

////////////////////////////////////////////////////////////////////////////

// begin routine
resetScroll();
setTimeout(revealLogo, logoTimeout);

////////////////////////////////////////////////////////////////////////////
//
// buried forever
// this little island of mine
// my lovely sunset



