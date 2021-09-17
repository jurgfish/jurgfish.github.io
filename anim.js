// Copyright © 2021, jurgfish. All rights reserved.
//
// https://github.com/jurgfish/jurgfish.github.io
//
////////////////////////////////////////////////////////////////////////////

const allContent = document.getElementById("content");
const inContent = document.getElementById("in");
const outContent = document.getElementById("out");
const logoElem = document.getElementById("logo");
const logoTxtElem = document.getElementById("logotxt");
const lastEntry = document.getElementById("end");
const cpyrElem = document.getElementById("copyright");
const anims = document.getElementsByClassName("anim");
const noanims = document.getElementsByClassName("noanim");
const jumpGo = document.getElementById("jump");
const toggleJump = document.getElementById("showjump");
const inputEntry = document.getElementById("entry");
const divForm = document.getElementById("form");
const tbeginElem = document.getElementById("tbegin");
const tendElem = document.getElementById("tend");
const homeElem = document.getElementById("home");
const buttElem = document.getElementById("butt");
const endspaceElem = document.getElementById("endspace");

const animationSpeed = 0.1;
const logoV = -1;
const logoA = 0.025;
const logoOpaRate = 0.018;
const typeSpeed = 6;
const slideStart = 10;
const slideRate = 0.3;
const restartOpaRate = 0.05;
const buttOpa = 0.6;
const buttOpaRate = 0.015;
const buttSpeed = 0.3;
const buttShowPos = 0;
const buttHidePos = 10;
const frameRate = 1000 / 60;
const logoTimeout = 300;
const elemTimeout = 150;
const scrollTimeout = 400;
const jumpTimeout = 100;
const buttTimeout = 1;
const loadBound = 0.93;
const lagBound = 3;
const scrollOffset = 28;
const endspOffset = 87;
const jumpScroll = scrollOffset + 2;

const noanimEntryCnt = 1;
const nonNovelEndCnt = 2;
const entryIdxLen = 3;
const animsCnt = anims.length;
const noanimsCnt = noanims.length;
const novelLength = animsCnt - nonNovelEndCnt;
let inputHidden = true;
let elemRunning = true;
let buttShowRunning = false;
let buttFillRunning = false;
let buttShown = false;
let animIdx = 0;
let noanimIdx = 0;
let animator = null;
let scrollTimer = null;

////////////////////////////////////////////////////////////////////////////

// animation compatibility
window.requestAnimationFrame = window.requestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.msRequestAnimationFrame ||
    function(callback) { return setTimeout(callback, frameRate); };

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
        if (p < 0 || !elemRunning) {
            elem.style.transform = `translate${dir}(0px)`;
            elem.style.opacity = 1;
        } else {
            window.requestAnimationFrame(frame);
        }
    }
    window.requestAnimationFrame(frame);
}

function typeElemWords(elem) {
    const fullText = elem.textContent.trim();
    const wordSet = fullText.split(" ");
    let currText = "";
    let wordSetIdx = 0;
    let currSetIdx = 0;
    let t0 = null;
    elem.textContent = currText;
    elem.style.visibility = "visible";

    function frame(t) {
        if (!t0) t0 = t;
        const elap = (t - t0) * animationSpeed;
        wordSetIdx = Math.floor(typeSpeed * elap);
        while (currSetIdx <= wordSetIdx) {
            if (currSetIdx >= wordSet.length - 1) break;
            currText += wordSet[currSetIdx] + " ";
            currSetIdx++;
        }
        elem.textContent = currText;
        if (wordSetIdx >= wordSet.length - 1 || !elemRunning) {
            elem.textContent = fullText;
        } else {
            window.requestAnimationFrame(frame);
        }
    }
    window.requestAnimationFrame(frame);
}

////////////////////////////////////////////////////////////////////////////

function setDocEntryCount() {
    const cntStr = `0000${novelLength + 1}`.slice(-entryIdxLen);
    inputEntry.placeholder = `1~ ${novelLength}`
    lastEntry.textContent = `[Alka & Allias ${cntStr}+]
        will appear when ready`;
}

function getWindowHeight() {
    return window.innerHeight || document.documentElement.clientHeight ||
        document.body.clientHeight;
}

function setBodyHeight() {
    endspaceElem.style.height = `${getWindowHeight() - endspOffset}px`;
    allContent.style.height = `${Math.min(allContent.scrollHeight,
        inContent.scrollHeight + outContent.scrollHeight)}px`;
}

function isElemVisible(elem) {
    const bound = elem.getBoundingClientRect();
    return (bound.top < (getWindowHeight() * loadBound));
}

////////////////////////////////////////////////////////////////////////////

function animateEntries() {
    elemRunning = true;
    let loadIdx = 0;
    let skipTimer = null;

    // an entry has its own animation, and entry animations are triggered
    // at set intervals depending on entry visibility.
    animator = setInterval(function() {

        // entries with links cannot have typing animations (noanims).
        // current noanims are the first and last entries. last entry
        // slides up, all other entries slide left.
        if (noanimIdx < noanimEntryCnt ||
                (animIdx >= animsCnt && noanimIdx < noanimsCnt)) {

            const elem = noanims[noanimIdx];
            if (isElemVisible(elem)) {
                slideElemIn(elem, noanimIdx !== noanimsCnt- 1);
                noanimIdx++;
            }

        // remaining entries with both slide and typing animations (anims).
        } else if (animIdx < animsCnt) {

            // update the current anim index when the next entry becomes
            // visible. a separate load index updates what the "real"
            // visible entry should be (when the user quickly scrolls
            // down much faster than the set animation timing)
            const elem = anims[animIdx];
            const valid = isElemVisible(elem);
            if (valid) animIdx++;
            while (loadIdx < novelLength && isElemVisible(anims[loadIdx])) {
                loadIdx++;
            }

            // if the index lag count is high enough, skip animating and
            // make the skipped entries visible.
            if ((loadIdx - animIdx) > lagBound) {
                elemRunning = false;
                if (skipTimer !== null) clearTimeout(skipTimer);
                skipTimer = setTimeout(function() {
                    const skipIdx = loadIdx - lagBound;
                    for (animIdx; animIdx < skipIdx; animIdx++) {
                        anims[animIdx].style.visibility = "visible";
                    }
                    elemRunning = true;
                }, jumpTimeout);
            }

            if (valid) {
                typeElemWords(elem);
                slideElemIn(elem, true);
            }

        } else {
            if (animator !== null) clearInterval(animator);
            animator = null;
            return;
        }
    }, elemTimeout);
}

////////////////////////////////////////////////////////////////////////////

function scrollToEntryIdx(entryFlag) {
    if (entryFlag) {
        const elem = anims[animIdx - 1];
        window.scroll(0, elem.offsetTop - scrollOffset);
    } else {
        if ("scrollRestoration" in history) {
            history.scrollRestoration = "manual";
        }
        document.body.scrollTop = 0;
        document.documentElement.scrollTop = 0;
    }
}

function resetEntries() {
    let idx = 0;
    for (idx; idx < animsCnt; idx++) {
        if (idx < animIdx) {
            anims[idx].style.transform = "translateX(0px)";
            anims[idx].style.visibility = "visible";
            anims[idx].style.opacity = 1;
        } else {
            anims[idx].style.visibility = "hidden";
        }
    }
    for (idx = noanimEntryCnt; idx < noanimsCnt; idx++) {
        noanims[idx].style.visibility = "hidden";
    }
}

function jumpToEntryIdx(idx) {
    if (animator !== null) clearInterval(animator);
    animator = null;
    elemRunning = false;
    animIdx = idx;
    noanimIdx = noanimEntryCnt;
    let entryFlag = true;

    if (animIdx < 1) {
        animIdx = 1;
        entryFlag = false;
        scrollToEntryIdx(false);
    } else if (animIdx > (novelLength + 1)) {
        animIdx = novelLength + 1;
    }

    resetEntries();
    setTimeout(function() {
        if (entryFlag) scrollToEntryIdx(true);
        animateEntries();
    }, jumpTimeout);
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
        const y = (-logoV*elap)-(logoA*(elap*elap));
        logoTxtElem.style.transform = `translateY(${y}px)`;
        if (opa < 1) {
            logoTxtElem.style.opacity = opa;
            opa = logoOpaRate * elap;
        }
        if (y < 0) {
            logoTxtElem.style.transform = "translateY(0px)";
            logoTxtElem.style.opacity = 1;
            animateEntries();
        } else {
            window.requestAnimationFrame(frame);
        }
    }
    window.requestAnimationFrame(frame);
}

function revealLogo() {
    setBodyHeight();
    let t0 = null;
    let opa = 0;
    logoElem.style.opacity = 0;
    logoElem.style.visibility = "visible";

    function frame(t) {
        if (!t0) t0 = t;
        const elap = (t - t0) * animationSpeed;
        const y = (logoV*elap)+(logoA*(elap*elap))-1;
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

// 'scroll to top' button animation and handling

function fillButt() {
    let t0 = null;
    let opa = buttOpa;
    buttFillRunning = true;

    function frame(t) {
        if (!t0) t0 = t;
        const elap = (t - t0) * animationSpeed;
        buttElem.style.opacity = opa;
        opa = buttOpa + buttOpaRate * elap;
        if (!buttFillRunning) {
            buttElem.style.opacity = buttOpa;
        } else if (opa > 1) {
            buttFillRunning = false;
            buttElem.style.opacity = 1;
        } else {
            window.requestAnimationFrame(frame);
        }
    }
    window.requestAnimationFrame(frame);
}

function moveButt(show) {
    const p0 = (show) ? buttHidePos : buttShowPos;
    const delta = (show) ? -buttSpeed : buttSpeed;
    const opaRate = buttSpeed / Math.abs(buttShowPos - buttHidePos);
    let opa = (show) ? 0 : buttOpa;
    let t0 = null;
    buttElem.style.opacity = opa;
    buttElem.style.transform = `translateY(${p0}px)`;
    buttElem.style.display = "block";

    function frame(t) {
        if (!t0) t0 = t;
        const elap = (t - t0) * animationSpeed;
        const y = p0 + (delta * elap);
        buttElem.style.transform = `translateY(${y}px)`;

        if (show && opa < buttOpa) {
            buttElem.style.opacity = opa;
            opa = buttOpa * opaRate * elap;
        } else if (!show && opa > 0) {
            buttElem.style.opacity = opa;
            opa = buttOpa - (buttOpa * opaRate * elap);
        }
        if (show && y < buttShowPos) {
            buttShowRunning = false;
            buttElem.style.transform = `translateY(${buttShowPos}px)`;
            buttElem.style.opacity = buttOpa;
            scrollTimer = setTimeout(fillButt, scrollTimeout);
        } else if (!show && y > buttHidePos) {
            buttShowRunning = false;
            buttElem.style.transform = `translateY(${buttHidePos}px)`;
            buttElem.style.opacity = 0;
            buttElem.style.display = "none";
        } else {
            window.requestAnimationFrame(frame);
        }
    }
    window.requestAnimationFrame(frame);
}

window.onscroll = function() {
    setTimeout(function() {
        if (!buttShowRunning) {
            const check = anims[0] ? anims[0] : noanims[1];
            if (check.getBoundingClientRect().top < jumpScroll) {
                if (scrollTimer !== null) clearTimeout(scrollTimer);
                buttFillRunning = false;
                if (!buttShown) {
                    buttShowRunning = true;
                    moveButt(true);
                    buttShown = true;
                } else {
                    buttElem.style.opacity = buttOpa;
                    scrollTimer = setTimeout(fillButt, scrollTimeout);
                }

            } else if (buttShown) {
                if (scrollTimer !== null) clearTimeout(scrollTimer);
                buttFillRunning = false;
                buttShowRunning = true;
                moveButt(false);
                buttShown = false;
            }
        }
    }, buttTimeout);
};

buttElem.onclick = function() {
    jumpToEntryIdx(-1);
    if (toggleJump) toggleJump.focus();
    else homeElem.focus();
    document.activeElement.blur();
    setBodyHeight();
    if (!buttShowRunning && buttShown) {
        if (scrollTimer !== null) clearTimeout(scrollTimer);
        buttFillRunning = false;
        buttShowRunning = true;
        moveButt(false);
        buttShown = false;
    }
};

////////////////////////////////////////////////////////////////////////////

function refreshPage() {
    if (animator !== null) clearInterval(animator);
    animator = null;
    elemRunning = false;
    buttElem.style.display = "none";
    let t0 = null;
    let opa = 1;

    function frame(t) {
        if (!t0) t0 = t;
        const elap = (t - t0) * animationSpeed;
        allContent.style.opacity = opa;
        opa = 1 - restartOpaRate * elap;
        if (opa < 0) {
            allContent.style.opacity = 0;
            location.reload();
        } else {
            window.requestAnimationFrame(frame);
        }
    }
    window.requestAnimationFrame(frame);
}

window.onresize = setBodyHeight;
logoElem.onclick = refreshPage;
logoTxtElem.onclick = refreshPage;
if (cpyrElem) cpyrElem.onclick = refreshPage;

if (tbeginElem) tbeginElem.onclick = function() {
    jumpToEntryIdx(1);
    document.activeElement.blur();
};
if (tendElem) tendElem.onclick = function() {
    jumpToEntryIdx(novelLength + 1);
    document.activeElement.blur();
};

if (toggleJump) toggleJump.onclick = function() {
    const validBound = anims[0].getBoundingClientRect().top > jumpScroll;

    if (inputHidden) {
        toggleJump.textContent = "(hide jump)";
        toggleJump.title = "hide jump ability (press 'a')";
        divForm.style.display = "block";
        inputHidden = false;
        setBodyHeight();
        if (!validBound) {
            window.scroll(0, inputEntry.offsetTop - scrollOffset);
        }
        setTimeout(function() { inputEntry.focus(); }, jumpTimeout);
    } else {
        if (validBound) {
            toggleJump.textContent = "use jump";
            toggleJump.title = "show jump ability (press 'a')";
            divForm.style.display = "none";
            inputEntry.value = "";
            inputHidden = true;
            setBodyHeight();
            document.activeElement.blur();
        } else {
            window.scroll(0, inputEntry.offsetTop - scrollOffset);
            setTimeout(function() { inputEntry.focus(); }, jumpTimeout);
        }
    }
};

if (jumpGo) jumpGo.onclick = function() {
    const inputEntryVal = parseInt(inputEntry.value, 10);
    if (!(isNaN(inputEntryVal))) {
        jumpToEntryIdx(inputEntryVal);
        inputEntry.value = "";
    }
    document.activeElement.blur();
};

document.onkeydown = function(event) {
    if (event.key === "Enter" || event.keyCode === 13 ||
            event.which === 13) {
        if (document.activeElement === tbeginElem) {
            event.preventDefault();
            tbeginElem.click();
        } else if (document.activeElement === tendElem) {
            event.preventDefault();
            tendElem.click();
        } else if (document.activeElement === toggleJump) {
            event.preventDefault();
            toggleJump.click();
        } else if ((document.activeElement === inputEntry) ||
                 (document.activeElement === jumpGo)) {
            event.preventDefault();
            jumpGo.click();
        } else if (document.activeElement === cpyrElem) {
            event.preventDefault();
            cpyrElem.click();
        }
    } else if (toggleJump && animIdx > 0 &&
            (event.keyCode === 65 || event.which === 65)) {
        event.preventDefault();
        toggleJump.click();
    }
};

////////////////////////////////////////////////////////////////////////////

// begin routine
scrollToEntryIdx(false);
if (lastEntry) setDocEntryCount();
setTimeout(revealLogo, logoTimeout);

////////////////////////////////////////////////////////////////////////////
//
// buried forever
// this little island of mine
// my lovely sunset



