// © 2021, jurgfish. All rights reserved.
//
// https://github.com/jurgfish/jurgfish.github.io
// v0.9.195
////////////////////////////////////////////////////////////////////////////

// elements
const allContent = document.getElementById("content");
const logoElem = document.getElementById("logo");
const jurgfishElem = document.getElementById("jurgfish");
const lastEntry = document.getElementById("end");
const cpyrElem = document.getElementById("copyright");
const endspace = document.getElementById("endspace");
const noanim = document.getElementsByClassName("noanim");
const elems = document.getElementsByClassName("anim");

const jumpGo = document.getElementById("jump");
const toggleJump = document.getElementById("showjump");
const inputEntry = document.getElementById("entry");
const divForm = document.getElementById("form");
const tbeginElem = document.getElementById("tbegin");
const tendElem = document.getElementById("tend");
const buttElem = document.getElementById("butt");

// settings
const logoV = -3;
const logoA = 0.1;
const logoOpaRate = 0.005;
const restartOpaRate = 0.05;
const jurgfishTypeSpeed = 0.4;
const typeSpeed = 2;
const wordOpaLen = 0.8;
const slideRate = 0.3;
const endspaceSpeed = 1;
const buttSpeed = 5;
const buttOpa = 0.8;
const frameRate = 1000 / 60;
const animationSpeed = 0.1;

const logoTimeout = 300;
const elemTimeout = 500;
const scrollTimeout = 400;
const jumpTimeout = 100;

const slideStart = 10;
const loadBound = 0.93;
const scrollOffset = 28;
const endspaceStartHeight = 100;
const endspaceEndHeight = 30; 
const buttScroll = 540;
const buttShowPos = 30;
const buttHidePos = -100;

const entryIdxLen = 3;
const entryIdxBuf = "0000";
const noanimEntryCnt = 1;
const nonNovelEndCnt = 2;
const novelLength = elems.length - nonNovelEndCnt;

var showInput = false;
var elemRunning = true;
var showRunning = false;
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

////////////////////////////////////////////////////////////////////////////

function slideUp(elem, opaFlag) {
    const opaRate = slideRate / slideStart;
    var t0 = null;
    var opa = 0;
    if (opaFlag) elem.style.opacity = opa;
    elem.style.transform = "translateY(" + slideStart + "px)";
    elem.style.visibility = "visible";

    function frame(t) {
        if (!t0) t0 = t;
        const elap = (t - t0) * animationSpeed;
        const y = slideStart - (slideRate * elap);
        elem.style.transform = "translateY(" + y + "px)";
        if (opaFlag && opa < 1) {
            elem.style.opacity = opa;
            opa = opaRate * elap;
        }
        if (y < 0 || !elemRunning) {
            elem.style.transform = "translateY(0px)";
            if (opaFlag) elem.style.opacity = 1;
        } else {
            window.requestAnimationFrame(frame);
        }
    }
    window.requestAnimationFrame(frame);
}

function typeWords(elem) {
    const fullText = elem.textContent.trim();
    const wordSet = fullText.split(" ");
    const opaRate = typeSpeed / (wordSet.length * wordOpaLen);
    var currText = "";
    var wordSetIdx = 0;
    var currSetIdx = 0;
    var t0 = null;
    var opa = 0;
    elem.textContent = currText;
    elem.style.opacity = opa; 

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
        if (opa < 1) {
            elem.style.opacity = opa;
            opa = opaRate * elap;
        }
        if (wordSetIdx >= wordSet.length - 1 || !elemRunning) {
            elem.textContent = fullText;
            elem.style.opacity = 1;
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
    lastEntry.textContent = "[Island of Mind " +
        formatNum(novelLength + 1) + "+] will appear when ready";
    inputEntry.placeholder = "1~ " + novelLength;
}

function reduceEndSpace() {
    var h = endspaceStartHeight; 
    function frame() {
        h -= endspaceSpeed;
        endspace.style.height = h + "em";
        if (h > endspaceEndHeight) window.requestAnimationFrame(frame);
    }
    window.requestAnimationFrame(frame);
}

////////////////////////////////////////////////////////////////////////////

function animateEntry(typeFlag, elem) {
    const bound = elem.getBoundingClientRect();
    const validBound = (bound.top < (window.innerHeight * loadBound ||
        document.documentElement.clientHeight * loadBound));

    if (validBound) {
        if (typeFlag) typeWords(elem);
        slideUp(elem, !typeFlag);
    }
    return validBound;
}

function animateEntries() {
    elemRunning = true;
    animator = setInterval(function() {
        if (noanimIdx < noanimEntryCnt ||
                (elemIdx >= elems.length && noanimIdx < noanim.length)) {
            if (animateEntry(false, noanim[noanimIdx])) noanimIdx++;

        } else if (elemIdx < elems.length) {
            if (animateEntry(true, elems[elemIdx])) elemIdx++;

        } else {
            clearInterval(animator);
            animator = null;
            reduceEndSpace();
        }
    }, elemTimeout);
}

////////////////////////////////////////////////////////////////////////////

function scrollToEntryIdx(entryFlag) {
    if (entryFlag) {
        const elem = elems[elemIdx - 1];
        window.scroll(0, elem.offsetTop - scrollOffset);
    } else {
        if ('scrollRestoration' in history) 
            history.scrollRestoration = 'manual';
        document.body.scrollTop = 0;
        document.documentElement.scrollTop = 0;
    }
}

function resetEntries() {
    var j = 0;
    for (j; j < elems.length; j++) {
        if (j < elemIdx) {
            elems[j].style.transform = "translateY(0px)";
            elems[j].style.visibility = "visible";
            elems[j].style.opacity = 1;
        } else {
            elems[j].style.visibility = "hidden";
        }
    }
    for (j = noanimEntryCnt; j < noanim.length; j++) {
        noanim[j].style.visibility = "hidden";
    }
    endspace.style.height = endspaceStartHeight + "em";
}

function jumpToEntryIdx(idx) {
    if (animator !== null) clearInterval(animator);
    animator = null;
    elemRunning = false;
    elemIdx = idx;
    noanimIdx = noanimEntryCnt;
    var entryFlag = true;

    if (elemIdx < 0) {
        elemIdx = 1;
        entryFlag = false;
        scrollToEntryIdx(false);
    } else if (elemIdx == 0) {
        elemIdx = 1;
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
        c = Math.floor(jurgfishTypeSpeed * elap);
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
    var t0 = null;
    var opa = 0;
    logoElem.style.visibility = "visible";
    logoElem.style.opacity = 0;

    function frame(t) {
        if (!t0) t0 = t;
        const elap = (t - t0) * animationSpeed;
        const y = (logoV*elap)+(logoA*(elap*elap))-1;
        logoElem.style.transform = "translateY(" + y + "px)";
        if (opa < 1) {
            opa = logoOpaRate * elap;
            logoElem.style.opacity = opa;
        }
        if (y > 0) {
            logoElem.style.transform = "translateY(0px)";
            logoElem.style.opacity = 1;
            revealjurgfish();
        } else {
            window.requestAnimationFrame(frame);
        }
    }
    window.requestAnimationFrame(frame);
}

function moveButt(show) {
    const p0 = (show) ? buttHidePos : buttShowPos;
    const delta = (show) ? buttSpeed : -buttSpeed;
    var t0 = null;
    buttElem.style.right = p0 + "px";
    buttElem.style.display = "block";
    
    function frame(t) {
        if (!t0) t0 = t;
        const elap = (t - t0) * animationSpeed;
        const right = p0 + (delta * elap);
        buttElem.style.right = right + "px";
        if (show && right >= buttShowPos) {
            showRunning = false;
            buttElem.style.right = buttShowPos + "px";
        } else if (!show && right <= buttHidePos) {
            showRunning = false;
            buttElem.style.right = buttHidePos + "px";
        } else {
            window.requestAnimationFrame(frame);
        }
    }
    window.requestAnimationFrame(frame);
}

function restartPage() {
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

window.onscroll = function() {
    if (document.body.scrollTop > buttScroll ||
            document.documentElement.scrollTop > buttScroll) {
        if (!buttShown && !showRunning) {
            showRunning = true;
            moveButt(true);
            buttShown = true;
        }
        buttElem.style.opacity = buttOpa;
        buttElem.style.color = "#eae0d6";

        if (scrollTimer !== null) clearTimeout(scrollTimer);
        scrollTimer = setTimeout(function() {
            buttElem.style.opacity = 1;
            buttElem.style.color = "#48c1cc";
        }, scrollTimeout);

    } else if (buttShown && !showRunning) {
        showRunning = true;
        moveButt(false);
        buttShown = false;
    }
};

buttElem.onclick = function() {
    jumpToEntryIdx(-1);
    toggleJump.focus(); // prevents strange behavior
    document.activeElement.blur();
};

logoElem.onclick = function() { restartPage(); };
cpyrElem.onclick = function() { restartPage(); };
tbeginElem.onclick = function() { jumpToEntryIdx(1); };
tendElem.onclick = function() { jumpToEntryIdx(novelLength + 1); };

toggleJump.onclick = function() {
    showInput = !showInput;
    if (showInput) {
        toggleJump.textContent = "(hide jump)";
        divForm.style.display = "block";
        setTimeout(function() { inputEntry.focus(); }, jumpTimeout);
    } else {
        toggleJump.textContent = "use jump";
        divForm.style.display = "none";
        inputEntry.value = "";
        document.activeElement.blur();
    }
};

jumpGo.onclick = function() {
    const inputEntryVal = parseInt(inputEntry.value);
    if (!(isNaN(inputEntryVal))) {
        document.activeElement.blur();
        jumpToEntryIdx(inputEntryVal);
        inputEntry.value = "";
    }
};

document.onkeydown = function(event) {
    if (event.key === "Enter" || event.keyCode === 13 ||
            event.which === 13) {

        if (document.activeElement === tbeginElem) {
            event.preventDefault();
            tbeginElem.click();
            document.activeElement.blur();
        } else if (document.activeElement === tendElem) {
            event.preventDefault();
            tendElem.click();
            document.activeElement.blur();
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
    } 
};

////////////////////////////////////////////////////////////////////////////

// begin routine
scrollToEntryIdx(false);
setDocEntryCount();
setTimeout(revealLogo, logoTimeout);

////////////////////////////////////////////////////////////////////////////



