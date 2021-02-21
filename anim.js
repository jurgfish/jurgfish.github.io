// jurgfish

// https://github.com/jurgfish/jurgfish.github.io

////////////////////////////////////////////////////////////////////////////

const version = 162;

// elements
const logoElem = document.getElementById("logo");
const jurgfishElem = document.getElementById("jurgfish");
const lastEntry = document.getElementById("end");
const cpyrElem = document.getElementById("copyright");
const body = document.getElementsByTagName("body")[0];
const endspace = document.getElementById("endspace");
const noanim = body.getElementsByClassName("noanim");
const elems = body.getElementsByClassName("anim");

const jumpGo = document.getElementById("jump");
const toggleJump = document.getElementById("showjump");
const inputEntry = document.getElementById("entry");
const divForm = document.getElementById("form");
const tbeginElem = document.getElementById("tbegin");
const tendElem = document.getElementById("tend");
const buttElem = document.getElementById("butt");

// settings
const logoV = -0.3;
const logoA = 0.006;
const logoOpaRate = 0.004;
const jurgfishTypeSpeed = 0.3;
const typeSpeed = 1.5;
const slideRate = 3;
const endspaceSpeed = 1;
const buttSpeed = 5;
const frameRate = 1000 / 60;
const animationSpeed = 0.1;

const versTimeout = 1500;
const elemTimeout = 500;
const scrollTimeout = 400;
const jumpTimeout = 100;

const logoStartPos = 14;
const logoEndPos = 15;
const slideStart = 100;
const loadBound = 0.93;
const scrollOffset = 28;
const endspaceStartHeight = 100;
const endspaceEndHeight = 30; 
const buttScroll = 1000;
const buttShowPos = 30;
const buttHidePos = -100;

const entryIdxLen = 3;
const entryIdxBuf = "0000";
const noanimEntryCnt = 1;
const nonNovelEndCnt = 2;
const novelLength = elems.length - nonNovelEndCnt;

var showVer = false;
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
    elem.style.marginTop = slideStart + "px";
    elem.style.visibility = "visible";

    function frame(t) {
        if (!t0) t0 = t;
        const elap = (t - t0) * animationSpeed;
        const marginTop = slideStart - (slideRate * elap);
        elem.style.marginTop = marginTop + "px";
        if (opaFlag && opa < 1) {
            elem.style.opacity = opa;
            opa = opaRate * elap;
        }
        if (marginTop <= 0 || !elemRunning) {
            elem.style.marginTop = "0px"; 
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
    const opaRate = typeSpeed / wordSet.length;
    var currText = "";
    var wordSetIdx = 0;
    var currSetIdx = 0;
    var t0 = null;
    var opa = 0.1;
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

function setLastEntry() {
    lastEntry.textContent = "[Island of Mind " +
        formatNum(novelLength + 1) + "+] will appear when ready";
}

function resetPosition() {
    if ('scrollRestoration' in history) 
        history.scrollRestoration = 'manual';
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
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
    var bound = elem.getBoundingClientRect();
    var validBound = (bound.top < (window.innerHeight * loadBound ||
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
            reduceEndSpace();
        }
    }, elemTimeout);
}

////////////////////////////////////////////////////////////////////////////

function scrollToEntryIdx() {
    var elem = elems[elemIdx - 1];
    window.scroll(0, elem.offsetTop - scrollOffset);
    animateEntries();
}

function jumpToEntryIdx() {
    clearInterval(animator);
    elemRunning = false;

    if (elemIdx < 1) elemIdx = 1;
    else if (elemIdx >= elems.length) elemIdx = elems.length - 1;
    noanimIdx = noanimEntryCnt;
    var j = 0;

    for (j; j < elems.length; j++) {
        if (j < elemIdx) {
            elems[j].style.marginTop = "0px"; 
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
    setTimeout(scrollToEntryIdx, jumpTimeout);
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
            showVer = true;
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
    logoElem.style.marginTop = logoStartPos + "%";
    logoElem.style.visibility = "visible";
    logoElem.style.opacity = 0;

    function frame(t) {
        if (!t0) t0 = t;
        const elap = (t - t0) * animationSpeed;
        const marginTop = logoStartPos+(logoV*elap)+(logoA*(elap*elap));
        logoElem.style.marginTop = marginTop + "%";
        if (opa < 1) {
            opa = logoOpaRate * elap;
            logoElem.style.opacity = opa;
        }
        if (marginTop > logoEndPos) {
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
        if ((show && right >= buttShowPos) ||
                (!show && right <= buttHidePos)) {
            showRunning = false;
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
        buttElem.style.opacity = 0.5;
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

logoElem.onclick = function() { location.reload(); };
cpyrElem.onclick = function() { location.reload(); };

buttElem.onclick = function() {
    buttElem.style.display = "none";
    resetPosition();
    toggleJump.focus(); // prevents strange behavior
    document.activeElement.blur();
};

jurgfishElem.onclick = function() {
    if (showVer) {
        showVer = false;
        jurgfishElem.textContent = "j"+version+"."+formatNum(novelLength);
        setTimeout(function() {
            jurgfishElem.textContent = "jurgfish";
            showVer = true;
        }, versTimeout);
    }
};

// entry jumping
tendElem.onclick = function() {
    elemIdx = novelLength + 1;
    jumpToEntryIdx();
};

tbeginElem.onclick = function() {
    elemIdx = 1;
    jumpToEntryIdx();
};

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
    var inputEntryVal = parseInt(inputEntry.value);
    if (!(isNaN(inputEntryVal))) {
        elemIdx = inputEntryVal;
        if (elemIdx > novelLength) elemIdx = novelLength + 1;
        document.activeElement.blur();
        jumpToEntryIdx();
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
resetPosition();
setLastEntry();
revealLogo();

////////////////////////////////////////////////////////////////////////////



