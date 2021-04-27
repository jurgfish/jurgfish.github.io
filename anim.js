// Copyright © 2021, jurgfish. All rights reserved.
//
// https://github.com/jurgfish/jurgfish.github.io
//
////////////////////////////////////////////////////////////////////////////

const allContent = document.getElementById("content");
const inContent = document.getElementById("in");
const outContent = document.getElementById("out");
const logoElem = document.getElementById("logo");
const jurgfishElem = document.getElementById("jurgfish");
const lastEntry = document.getElementById("end");
const cpyrElem = document.getElementById("copyright");
const noanim = document.getElementsByClassName("noanim");
const elems = document.getElementsByClassName("anim");
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
const logoV = -3;
const logoA = 0.1;
const logoOpaRate = 0.005;
const titleTypeSpeed = 0.4;
const typeSpeed = 6;
const slideStart = 100;
const slideRate = 10;
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
const loadBound = 0.93;
const lagBound = 3;
const scrollOffset = 28;
const endspOffset = 87;
const jumpScroll = scrollOffset + 2;
const entryIdxLen = 3;
const noanimEntryCnt = 1;
const nonNovelEndCnt = 2;
const novelLength = elems.length - nonNovelEndCnt;

const entryIdxBuf = "0000";
const txx = "translateX(";
const txy = "translateY(";
const tpx = "px)";
const endTxtA = "[Island of Mind ";
const endTxtB = "+] will appear when ready";
const placeTxt = "1~ ";
const toggleTxtHide = "(hide jump)";
const toggleTitleHide = "hide jump ability (press 'a')";
const toggleTxtShow = "use jump";
const toggleTitleShow = "show jump ability (press 'a')";
var inputHidden = true;
var elemRunning = true;
var showRunning = false;
var fillRunning = false;
var buttShown = false;
var elemIdx = 0;
var noanimIdx = 0;
var animator = null;
var scrollTimer = null;

////////////////////////////////////////////////////////////////////////////

window.requestAnimationFrame = window.requestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.msRequestAnimationFrame ||
    function(callback) { return setTimeout(callback, frameRate); };

function slideIn(elem, left) {
    const opaRate = slideRate / slideStart;
    var t0 = null;
    var opa = 0;
    elem.style.opacity = opa;
    if (left) elem.style.transform = txx + slideStart + tpx;
    else elem.style.transform = txy + slideStart + tpx;
    elem.style.visibility = "visible";

    function frame(t) {
        if (!t0) t0 = t;
        const elap = (t - t0) * animationSpeed;
        const p = slideStart - (slideRate * elap);
        if (left) elem.style.transform = txx + p + tpx;
        else elem.style.transform = txy + p + tpx;
        if (opa < 1) {
            elem.style.opacity = opa;
            opa = opaRate * elap;
        }
        if (p < 0 || !elemRunning) {
            if (left) elem.style.transform = txx + 0 + tpx;
            else elem.style.transform = txy + 0 + tpx;
            elem.style.opacity = 1;
        } else {
            window.requestAnimationFrame(frame);
        }
    }
    window.requestAnimationFrame(frame);
}

function typeWords(elem) {
    const fullText = elem.textContent.trim();
    const wordSet = fullText.split(" ");
    var currText = "";
    var wordSetIdx = 0;
    var currSetIdx = 0;
    var t0 = null;
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

function formatNum(n) {
    var res = entryIdxBuf + n;
    return res.substring(res.length - entryIdxLen);
}

function setDocEntryCount() {
    lastEntry.textContent = endTxtA + formatNum(novelLength + 1) + endTxtB;
    inputEntry.placeholder = placeTxt + novelLength;
}

function getWindowHeight() {
    return window.innerHeight || document.documentElement.clientHeight ||
        document.body.clientHeight;
}

function setBodyHeight() {
    endspaceElem.style.height = (getWindowHeight() - endspOffset) + "px";
    const h = inContent.scrollHeight + outContent.scrollHeight;
    const hh = Math.min(allContent.scrollHeight, h);
    allContent.style.height = hh + "px";
}

function verifyBound(elem) {
    const bound = elem.getBoundingClientRect();
    return (bound.top < (getWindowHeight() * loadBound));
}

function pastFirstBound() {
    const check = elems[0] ? elems[0] : noanim[1];
    return check.getBoundingClientRect().top < jumpScroll;
}

////////////////////////////////////////////////////////////////////////////

function animateEntries() {
    elemRunning = true;
    var loadIdx = 0;
    var skipTimer = null;

    animator = setInterval(function() {
        if (noanimIdx < noanimEntryCnt ||
                (elemIdx >= elems.length && noanimIdx < noanim.length)) {
            const elem = noanim[noanimIdx];
            if (verifyBound(elem)) {
                slideIn(elem, noanimIdx != noanim.length - 1);
                noanimIdx++;
            }

        } else if (elemIdx < elems.length) {
            const elem = elems[elemIdx];
            const valid = verifyBound(elem);
            if (valid) elemIdx++;
            while (loadIdx < novelLength && verifyBound(elems[loadIdx])) {
                loadIdx++;
            }
            while (loadIdx > elemIdx && !verifyBound(elems[loadIdx])) {
                loadIdx--;
            }

            const lag = loadIdx - elemIdx;
            if (lag > lagBound) {
                elemRunning = false;
                if (skipTimer !== null) clearTimeout(skipTimer);

                skipTimer = setTimeout(function() {
                    const k = loadIdx - lagBound;
                    for (elemIdx; elemIdx < k; elemIdx++) {
                        elems[elemIdx].style.visibility = "visible";
                    }
                    elemRunning = true;
                }, jumpTimeout);
            }

            if (valid) {
                typeWords(elem);
                slideIn(elem, true);
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
        const elem = elems[elemIdx - 1];
        window.scroll(0, elem.offsetTop - scrollOffset);
    } else {
        if ("scrollRestoration" in history)
            history.scrollRestoration = "manual";
        document.body.scrollTop = 0;
        document.documentElement.scrollTop = 0;
    }
}

function resetEntries() {
    var j = 0;
    const k = elems.length;
    const kk = noanim.length;
    for (j; j < k; j++) {
        if (j < elemIdx) {
            elems[j].style.transform = txx + 0 + tpx;
            elems[j].style.visibility = "visible";
            elems[j].style.opacity = 1;
        } else {
            elems[j].style.visibility = "hidden";
        }
    }
    for (j = noanimEntryCnt; j < kk; j++) {
        noanim[j].style.visibility = "hidden";
    }
}

function jumpToEntryIdx(idx) {
    if (animator !== null) clearInterval(animator);
    animator = null;
    elemRunning = false;
    elemIdx = idx;
    noanimIdx = noanimEntryCnt;
    var entryFlag = true;

    if (elemIdx < 1) {
        elemIdx = 1;
        entryFlag = false;
        scrollToEntryIdx(false);
    } else if (elemIdx > (novelLength + 1)) {
        elemIdx = novelLength + 1;
    }

    resetEntries();
    setTimeout(function() {
        if (entryFlag) scrollToEntryIdx(true);
        animateEntries();
    }, jumpTimeout);
}

////////////////////////////////////////////////////////////////////////////

function revealjurgfish() {
    const word = jurgfishElem.textContent;
    var t0 = null;
    var c = 0;
    jurgfishElem.textContent = "";
    jurgfishElem.style.visibility = "visible";

    function frame(t) {
        if (!t0) t0 = t;
        const elap = (t - t0) * animationSpeed;
        c = Math.floor(titleTypeSpeed * elap);
        jurgfishElem.textContent = word.substring(0, c);
        if (c >= word.length) {
            jurgfishElem.textContent = word;
            animateEntries();
        } else {
            window.requestAnimationFrame(frame);
        }
    }
    window.requestAnimationFrame(frame);
}

function revealLogo() {
    setBodyHeight();
    var t0 = null;
    var opa = 0;
    logoElem.style.opacity = 0;
    logoElem.style.visibility = "visible";

    function frame(t) {
        if (!t0) t0 = t;
        const elap = (t - t0) * animationSpeed;
        const y = (logoV*elap)+(logoA*(elap*elap))-1;
        logoElem.style.transform = txy + y + tpx;
        if (opa < 1) {
            logoElem.style.opacity = opa;
            opa = logoOpaRate * elap;
        }
        if (y > 0) {
            logoElem.style.transform = txy + 0 + tpx;
            logoElem.style.opacity = 1;
            revealjurgfish();
        } else {
            window.requestAnimationFrame(frame);
        }
    }
    window.requestAnimationFrame(frame);
}

function fillButt() {
    var t0 = null;
    var opa = buttOpa;
    fillRunning = true;

    function frame(t) {
        if (!t0) t0 = t;
        const elap = (t - t0) * animationSpeed;
        buttElem.style.opacity = opa;
        opa = buttOpa + buttOpaRate * elap;
        if (!fillRunning) {
            buttElem.style.opacity = buttOpa;
        } else if (opa > 1) {
            fillRunning = false;
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
    var opa = (show) ? 0 : buttOpa;
    var t0 = null;
    buttElem.style.opacity = opa;
    buttElem.style.transform = txy + p0 + tpx;
    buttElem.style.display = "block";

    function frame(t) {
        if (!t0) t0 = t;
        const elap = (t - t0) * animationSpeed;
        const y = p0 + (delta * elap);
        buttElem.style.transform = txy + y + tpx;

        if (show && opa < buttOpa) {
            buttElem.style.opacity = opa;
            opa = buttOpa * opaRate * elap;
        } else if (!show && opa > 0) {
            buttElem.style.opacity = opa;
            opa = buttOpa - (buttOpa * opaRate * elap);
        }
        if (show && y < buttShowPos) {
            showRunning = false;
            buttElem.style.transform = txy + buttShowPos + tpx;
            buttElem.style.opacity = buttOpa;
            scrollTimer = setTimeout(fillButt, scrollTimeout);
        } else if (!show && y > buttHidePos) {
            showRunning = false;
            buttElem.style.transform = txy + buttHidePos + tpx;
            buttElem.style.opacity = 0;
            buttElem.style.display = "none";
        } else {
            window.requestAnimationFrame(frame);
        }
    }
    window.requestAnimationFrame(frame);
}

function refreshPage() {
    if (animator !== null) clearInterval(animator);
    animator = null;
    elemRunning = false;
    buttElem.style.display = "none";
    var t0 = null;
    var opa = 1;

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

////////////////////////////////////////////////////////////////////////////

window.onresize = setBodyHeight;
logoElem.onclick = refreshPage;
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
    const validBound = elems[0].getBoundingClientRect().top > jumpScroll;

    if (inputHidden) {
        toggleJump.textContent = toggleTxtHide;
        toggleJump.title = toggleTitleHide;
        divForm.style.display = "block";
        inputHidden = false;
        setBodyHeight();
        if (!validBound) {
            window.scroll(0, inputEntry.offsetTop - scrollOffset);
        }
        setTimeout(function() { inputEntry.focus(); }, jumpTimeout);
    } else {
        if (validBound) {
            toggleJump.textContent = toggleTxtShow;
            toggleJump.title = toggleTitleShow;
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
    const inputEntryVal = parseInt(inputEntry.value);
    if (!(isNaN(inputEntryVal))) {
        jumpToEntryIdx(inputEntryVal);
        inputEntry.value = "";
    }
    document.activeElement.blur();
};

window.onscroll = function() {
    if (!showRunning) {
        if (pastFirstBound()) {
            if (scrollTimer !== null) clearTimeout(scrollTimer);
            fillRunning = false;
            if (!buttShown) {
                showRunning = true;
                moveButt(true);
                buttShown = true;
            } else {
                buttElem.style.opacity = buttOpa;
                scrollTimer = setTimeout(fillButt, scrollTimeout);
            }

        } else if (buttShown) {
            if (scrollTimer !== null) clearTimeout(scrollTimer);
            fillRunning = false;
            showRunning = true;
            moveButt(false);
            buttShown = false;
        }
    }
};

buttElem.onclick = function() {
    jumpToEntryIdx(-1);
    if (toggleJump) toggleJump.focus();
    else homeElem.focus();
    document.activeElement.blur();
    setBodyHeight();
    if (!showRunning && buttShown) {
        if (scrollTimer !== null) clearTimeout(scrollTimer);
        fillRunning = false;
        showRunning = true;
        moveButt(false);
        buttShown = false;
    }
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
    } else if (toggleJump && elemIdx > 0 &&
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



