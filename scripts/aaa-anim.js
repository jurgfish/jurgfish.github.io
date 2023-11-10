// Copyright © 2021-2023, jurgfish. All rights reserved.
//
// https://github.com/jurgfish/jurgfish.github.io
//
////////////////////////////////////////////////////////////////////////////

const allContent = document.getElementById("content");
const inContent = document.getElementById("in");
const outContent = document.getElementById("out");
const lastEntry = document.getElementById("end");
const sectionQueue = document.getElementsByClassName("section");
const typedQueue = document.getElementsByClassName("anim-typed");
const slideQueue = document.getElementsByClassName("anim-slide");
const aaaElem = document.getElementById("aaa");
const jumpGo = document.getElementById("jump");
const inputEntry = document.getElementById("entry");
const bottElem = document.getElementById("bott");
const ttopElem = document.getElementById("ttop");
const endspaceElem = document.getElementById("endspace");

const animationSpeed = 0.1;
const typeSpeed = 2;
const slidePStart = 10;
const slideRate = 0.3;
const restartOpaRate = 0.05;
const ttopOpa = 0.6;
const ttopOpaRate = 0.015;
const ttopSpeed = 0.3;
const ttopShowPos = 0;
const ttopHidePos = 10;
const frameRate = 1000 / 60;
const elemTimeout = 150;
const scrollTimeout = 400;
const jumpTimeout = 100;
const ttopTimeout = 1;
const loadBound = 0.93;
const lagBound = 2;
const lagFadeBound = 12;
const scrollOffset = 28;
const endspOffset = 87;
const marginBuff = 30;
const jumpScroll = scrollOffset + 2;

const slideStartCnt = 4;
const nonStoryTypedEndCnt = 2;
const entryIdxLen = 3; // number of digits in section count
const sectionCnt = sectionQueue.length;
const typedCnt = typedQueue.length;
const slideCnt = slideQueue.length;
const storyCnt = typedCnt - nonStoryTypedEndCnt;
let sectionDict = {}
let typerRunning = true;
let ttopShowRunning = false;
let ttopFillRunning = false;
let ttopShown = false;
let typedIdx = 0;
let slideIdx = 0;
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
    const opaRate = slideRate / slidePStart;
    const dir = (xdir) ? 'X' : 'Y';
    let t0 = null;
    let opa = 0;
    elem.style.opacity = 0;
    elem.style.transform = `translate${dir}(${slidePStart}px)`;
    elem.style.visibility = "visible";

    function frame(t) {
        if (!t0) t0 = t;
        const elap = (t - t0) * animationSpeed;
        const p = slidePStart - (slideRate * elap);
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
        if (wordSetIdx >= wordSet.length - 1 || !typerRunning) {
            elem.textContent = fullText;
        } else {
            window.requestAnimationFrame(frame);
        }
    }
    window.requestAnimationFrame(frame);
}

////////////////////////////////////////////////////////////////////////////

function setDocEntryCount() {
    const cntStr = `0000${sectionCnt + 1}`.slice(-entryIdxLen);
    inputEntry.placeholder = `1~ ${sectionCnt}`;
    inputEntry.value = "";
    lastEntry.textContent = `[ ${cntStr}+ ] will be released when ready`;
}

function getWindowHeight() {
    return window.innerHeight || document.documentElement.clientHeight ||
        document.body.clientHeight;
}

function setBodyHeight() {
    endspaceElem.style.height = `${getWindowHeight() - endspOffset}px`;
    allContent.style.height = `${Math.min(allContent.scrollHeight,
        inContent.scrollHeight + outContent.scrollHeight) + marginBuff}px`;
}

function isElemVisible(elem) {
    const bound = elem.getBoundingClientRect();
    return (bound.top < (getWindowHeight() * loadBound));
}

////////////////////////////////////////////////////////////////////////////

function animateEntries() {
    setBodyHeight();
    typerRunning = true;
    let loadIdx = 0;
    let skipTimer = null;

    // an entry has its own animation, and entry animations are triggered
    // at set intervals depending on entry visibility.
    animator = setInterval(function() {

        // intial entries and the last entry only have slide animations.
        // the last entry slides up, all other entries slide left.
        if (slideIdx < slideStartCnt ||
                (typedIdx >= typedCnt && slideIdx < slideCnt)) {

            const elem = slideQueue[slideIdx];
            if (isElemVisible(elem)) {
                slideElemIn(elem, slideIdx !== slideCnt - 1);
                slideIdx++;
            }

        // remaining entries with both slide and typing animations.
        } else if (typedIdx < typedCnt) {

            // update the current index when the next entry becomes
            // visible. a separate load index updates what the "real"
            // visible entry should be (when the user quickly scrolls
            // down much faster than the set animation timing)
            const elem = typedQueue[typedIdx];
            const valid = isElemVisible(elem);
            if (valid) typedIdx++;
            while (loadIdx < storyCnt &&
                    isElemVisible(typedQueue[loadIdx])) {
                loadIdx++;
            }

            // if the index lag count is high enough, skip animating and
            // make the skipped entries visible.
            if ((loadIdx - typedIdx) > lagBound) {
                typerRunning = false;
                if (skipTimer !== null) clearTimeout(skipTimer);
                skipTimer = setTimeout(function() {

                    const skipIdx = loadIdx - lagBound;
                    for (typedIdx; typedIdx < skipIdx; typedIdx++) {
                        var skpElem = typedQueue[typedIdx]
                        if ((skipIdx - typedIdx) > lagFadeBound) {
                            skpElem.style.visibility = "visible";
                        } else {
                            slideElemIn(skpElem, true);
                        }
                    }

                    typerRunning = true;
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
        let elem = typedQueue[typedIdx - 1];
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
    for (idx; idx < typedCnt; idx++) {
        if (idx < typedIdx) {
            typedQueue[idx].style.transform = "translateX(0px)";
            typedQueue[idx].style.visibility = "visible";
            typedQueue[idx].style.opacity = 1;
        } else {
            typedQueue[idx].style.visibility = "hidden";
        }
    }
    for (idx = slideIdx; idx < slideCnt; idx++) {
        slideQueue[idx].style.visibility = "hidden";
    }
}

function jumpToSectionIdx(idx) {
    if (animator !== null) clearInterval(animator);
    animator = null;
    typerRunning = false;
    slideIdx = slideStartCnt;
    let entryFlag = true;

    if (idx < 1) {
        typedIdx = 1;
        entryFlag = false;
        scrollToEntryIdx(false);
    } else if (idx > sectionCnt) {
        // go to end entry (not last section)
        typedIdx = storyCnt + 1;
    } else {
        // section idx is offset from typed idx by 1
        typedIdx = sectionDict[idx] + 1;
    }

    resetEntries();
    setTimeout(function() {
        if (entryFlag) scrollToEntryIdx(true);
        animateEntries();
    }, jumpTimeout);
}

function generateSectionDict() {
    let tIdx = 0;
    let sIdx = 1;
    for (tIdx; tIdx < typedCnt; tIdx++) {
        if (typedQueue[tIdx].className == "anim-typed section") {
            sectionDict[sIdx] = tIdx;
            sIdx++;
        }
    }
}

////////////////////////////////////////////////////////////////////////////

// 'scroll to top' button animation and handling

function fillTopButton() {
    let t0 = null;
    let opa = ttopOpa;
    ttopFillRunning = true;

    function frame(t) {
        if (!t0) t0 = t;
        const elap = (t - t0) * animationSpeed;
        ttopElem.style.opacity = opa;
        opa = ttopOpa + ttopOpaRate * elap;
        if (!ttopFillRunning) {
            ttopElem.style.opacity = ttopOpa;
        } else if (opa > 1) {
            ttopFillRunning = false;
            ttopElem.style.opacity = 1;
        } else {
            window.requestAnimationFrame(frame);
        }
    }
    window.requestAnimationFrame(frame);
}

function moveTopButton(show) {
    const p0 = (show) ? ttopHidePos : ttopShowPos;
    const delta = (show) ? -ttopSpeed : ttopSpeed;
    const opaRate = ttopSpeed / Math.abs(ttopShowPos - ttopHidePos);
    let opa = (show) ? 0 : ttopOpa;
    let t0 = null;
    ttopElem.style.opacity = opa;
    ttopElem.style.transform = `translateY(${p0}px)`;
    ttopElem.style.display = "block";

    function frame(t) {
        if (!t0) t0 = t;
        const elap = (t - t0) * animationSpeed;
        const y = p0 + (delta * elap);
        ttopElem.style.transform = `translateY(${y}px)`;

        if (show && opa < ttopOpa) {
            ttopElem.style.opacity = opa;
            opa = ttopOpa * opaRate * elap;
        } else if (!show && opa > 0) {
            ttopElem.style.opacity = opa;
            opa = ttopOpa - (ttopOpa * opaRate * elap);
        }
        if (show && y < ttopShowPos) {
            ttopShowRunning = false;
            ttopElem.style.transform = `translateY(${ttopShowPos}px)`;
            ttopElem.style.opacity = ttopOpa;
            scrollTimer = setTimeout(fillTopButton, scrollTimeout);
        } else if (!show && y > ttopHidePos) {
            ttopShowRunning = false;
            ttopElem.style.transform = `translateY(${ttopHidePos}px)`;
            ttopElem.style.opacity = 0;
            ttopElem.style.display = "none";
        } else {
            window.requestAnimationFrame(frame);
        }
    }
    window.requestAnimationFrame(frame);
}

window.onscroll = function() {
    setTimeout(function() {
        if (!ttopShowRunning) {
            const check = typedQueue[0] ? typedQueue[0] : typedQueue[1];
            if (check.getBoundingClientRect().top < jumpScroll) {
                if (scrollTimer !== null) clearTimeout(scrollTimer);
                ttopFillRunning = false;
                if (!ttopShown) {
                    ttopShowRunning = true;
                    moveTopButton(true);
                    ttopShown = true;
                } else {
                    ttopElem.style.opacity = ttopOpa;
                    scrollTimer = setTimeout(fillTopButton, scrollTimeout);
                }

            } else if (ttopShown) {
                if (scrollTimer !== null) clearTimeout(scrollTimer);
                ttopFillRunning = false;
                ttopShowRunning = true;
                moveTopButton(false);
                ttopShown = false;
            }
        }
    }, ttopTimeout);
};

ttopElem.onclick = function() {
    jumpToSectionIdx(-1);
    if (jumpGo) jumpGo.focus();
    document.activeElement.blur();
    setBodyHeight();
    if (!ttopShowRunning && ttopShown) {
        if (scrollTimer !== null) clearTimeout(scrollTimer);
        ttopFillRunning = false;
        ttopShowRunning = true;
        moveTopButton(false);
        ttopShown = false;
    }
};

////////////////////////////////////////////////////////////////////////////

function refreshPage() {
    if (animator !== null) clearInterval(animator);
    animator = null;
    typerRunning = false;
    ttopElem.style.display = "none";
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

window.onresize = setBodyHeight;
aaaElem.onclick = refreshPage;
bottElem.onclick = function() {
    jumpToSectionIdx(storyCnt + 1);
    document.activeElement.blur();
};

////////////////////////////////////////////////////////////////////////////

// section jump logic

function setJumpGoEnabled(enabled) {
    jumpGo.disabled = enabled;
    if (enabled) {
        jumpGo.classList.remove("disabled");
    } else {
        jumpGo.className = "disabled";
    }
}

inputEntry.oninput = function() { setJumpGoEnabled(true); }

function takeJumpInput() {
    const validBound = typedQueue[0].getBoundingClientRect().top > jumpScroll;
    if (validBound) {
        if (document.activeElement === inputEntry) {
            inputEntry.value = "";
            document.activeElement.blur();
        } else {
            setTimeout(function() { inputEntry.focus(); }, jumpTimeout);
        }
    } else {
        window.scroll(0, inputEntry.offsetTop - scrollOffset);
        setTimeout(function() { inputEntry.focus(); }, jumpTimeout);
    }
}

jumpGo.onclick = function() {
    const inputVal = inputEntry.value.trim();
    const reg = /^\d+$/;
    if (reg.test(inputVal)) {
        const inputIdx = parseInt(inputVal, 10);
        if (!isNaN(inputIdx)) jumpToSectionIdx(inputIdx);
    }
    inputEntry.value = "";
    setJumpGoEnabled(false);
    document.activeElement.blur();
    setBodyHeight();
};

document.onkeydown = function(event) {
    if (event.key === "Enter" || event.keyCode === 13 ||
            event.which === 13) {
        if (document.activeElement === bottElem) {
            event.preventDefault();
            bottElem.click();
        } else if ((document.activeElement === inputEntry) ||
                 (document.activeElement === jumpGo)) {
            event.preventDefault();
            jumpGo.click();
        }
    } else if (jumpGo && typedIdx > 0 &&
            (event.keyCode === 65 || event.which === 65)) {
        event.preventDefault();
        takeJumpInput();
    }
};

////////////////////////////////////////////////////////////////////////////

// begin routine
scrollToEntryIdx(false);
generateSectionDict();
setDocEntryCount();
setJumpGoEnabled(false);
setTimeout(animateEntries, elemTimeout);

////////////////////////////////////////////////////////////////////////////
//
// buried forever
// this little island of mine
// my lovely sunset


