// jurgfish

////////////////////////////////////////////////////////////////////////////

// text elements
var logoElem = document.getElementById("logo");
var titleElem = document.getElementById("title");
var verElem = document.getElementById("version");
var lastEntry = document.getElementById("end");
var cpyrElem = document.getElementById("copyright");
var body = document.getElementsByTagName("body")[0];
var noanim = body.getElementsByClassName("noanim");
var elems = body.getElementsByClassName("anim");

// jump elements
var jumpGo = document.getElementById("jump");
var toggleJump = document.getElementById("showjump");
var inputEntry = document.getElementById("entry");
var divForm = document.getElementById("form");
var tbeginElem = document.getElementById("tbegin");
var tendElem = document.getElementById("tend");

// animation settings
var logoPos = 15;
var logoSpeed = 5;
var typeSpeed = 20;
var titleTypeSpeed = 50;

var showVer = false;
var showInput = false;
var elemIdx = 0;
var noanimIdx = 0;

var loadBound = 0.93;
var visibleBound = 90;
var scrollOffset = 20;

var titleTimeout = 1500;
var elemTimeout = 500;

var animRunning = true;
var elemRunning = true;

var entryIdxLen = 3;
var entryIdxBuf = "0000";
var noanimEntryCnt = 1;

////////////////////////////////////////////////////////////////////////////

function slideUp(elem) {
    var marginTop = 100;
    var slider = setInterval(frame, 1);

    function frame() {
        marginTop--;
        elem.style.marginTop = marginTop + "%"; 
        
        if (marginTop == 0 || !elemRunning) {
            clearInterval(slider);
            slider = null;
            elem.style.marginTop = "0%"; 
            return;
        } else if (marginTop == visibleBound) {
            elem.style.visibility = "visible";
        }
    }
}

function typeLetters(elem) {
    var word = elem.textContent;
    var c = 0;
    var typer = setInterval(frame, titleTypeSpeed);

    function frame() {
        c++;
        elem.textContent = word.substring(0, c);

        if (c == word.length) {
            clearInterval(typer);
            typer = null;
            elem.textContent = word;
            return;
        } else if (c == 1) {
            elem.style.visibility = "visible";
        }
    }
}

function typeWords(elem) {
    var fullText = elem.textContent;
    var currText = "";
    var wordSet = fullText.split(" ");
    var wordSetIdx = 0;
    var typer = setInterval(frame, typeSpeed);
    elem.textContent = "";

    function frame() {
        wordSetIdx++;
        currText += wordSet[wordSetIdx] + " ";
        elem.textContent = currText;

        if (wordSetIdx >= wordSet.length - 1 || !elemRunning) {
            clearInterval(typer);
            typer = null;
            elem.textContent = fullText;
            return;
        }
    }
}

////////////////////////////////////////////////////////////////////////////

function formatNum(n) {
    var res = entryIdxBuf + n;
    return res.substring(res.length - entryIdxLen);
}

function setLastEntry() {
    lastEntry.textContent = "[Island of Mind " + formatNum(elems.length) +
        "+] will appear when ready";
    verElem.textContent += formatNum(elems.length - 1);
}

function resetPosition() {
    if ('scrollRestoration' in history)
        history.scrollRestoration = 'manual';
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
}

////////////////////////////////////////////////////////////////////////////

function animateEntry(typeFlag, elem) {
    var bound = elem.getBoundingClientRect();
    var validBound = (bound.top < (window.innerHeight * loadBound ||
        document.documentElement.clientHeight * loadBound));

    if (validBound) {
        slideUp(elem);
        if (typeFlag) typeWords(elem);
    }
    return validBound;
}

function animateEntries() {
    animRunning = true;
    elemRunning = true;
    var animator = setInterval(frame, elemTimeout);

    function frame() {
        if (animRunning && (noanimIdx < noanimEntryCnt ||
                (elemIdx >= elems.length && noanimIdx < noanim.length))) {
            if (animateEntry(false, noanim[noanimIdx])) noanimIdx++;

        } else if (animRunning && elemIdx < elems.length) {
            if (animateEntry(true, elems[elemIdx])) elemIdx++;

        } else {
            clearInterval(animator);
            animator = null;
            return;
        }
    }
}

////////////////////////////////////////////////////////////////////////////

function scrollToEntryIdx() {
    var elem = elems[elemIdx - 1];
    window.scroll(0, elem.offsetTop - scrollOffset);
    animateEntries();
}

function jumpToEntryIdx() {
    animRunning = false;
    elemRunning = false;

    if (elemIdx < 1) {
        elemIdx = 1;
    } else if (elemIdx > elems.length) {
        elemIdx = elems.length;
    }
    noanimIdx = noanimEntryCnt;

    for (var j = 0; j < elems.length; j++) {
        if (j < elemIdx) {
            elems[j].style.marginTop = "0%"; 
            elems[j].style.visibility = "visible";
        } else {
            elems[j].style.visibility = "hidden";
        }
    }

    for (var j = noanimEntryCnt; j < noanim.length; j++) {
        noanim[j].style.visibility = "hidden";
    }
    
    setTimeout("scrollToEntryIdx()", elemTimeout);
}

////////////////////////////////////////////////////////////////////////////

function revealStart() {
    typeLetters(titleElem);
    setTimeout("animateEntries()", elemTimeout);
}

function revealLogo() {
    var marginTop = -100;
    var slider = setInterval(frame, logoSpeed);

    function frame() {
        marginTop++; 
        logoElem.style.marginTop = marginTop + "%";

        if (marginTop == logoPos) {
            clearInterval(slider);
            slider = null;
            return;
        } else if (marginTop == -visibleBound) {
            logoElem.style.visibility = "visible";
        }
    }

    setTimeout("revealStart()", titleTimeout);
}

////////////////////////////////////////////////////////////////////////////

logoElem.onclick = function() { location.reload(); }
cpyrElem.onclick = function() { location.reload(); }

titleElem.onclick = function() {
    if (noanim[0].style.visibility === "visible") {
        showVer = !showVer;
        if (showVer) verElem.style.display = "block";
        else verElem.style.display = "none";
    }
}

// entry jumping
tendElem.onclick = function() {
    elemIdx = elems.length;
    jumpToEntryIdx();
}

tbeginElem.onclick = function() {
    elemIdx = 0;
    jumpToEntryIdx();
}

toggleJump.onclick = function() {
    showInput = !showInput;
    if (showInput) {
        toggleJump.textContent = "(hide jump)"
        divForm.style.display = "block";
    } else {
        toggleJump.textContent = "use jump"
        divForm.style.display = "none";
    }
}

jumpGo.onclick = function() {
    var inputEntryVal = parseInt(inputEntry.value);
    if (!(isNaN(inputEntryVal))) {
        elemIdx = inputEntryVal;
        inputEntry.value = "";
        jumpToEntryIdx();
    }
}

document.onkeydown = function(event) {
    if (event.key === "Enter" || event.keyCode === 13 ||
            event.which === 13) {
        event.preventDefault();
        jumpGo.click();
    }
}

////////////////////////////////////////////////////////////////////////////

// begin routine
resetPosition();
setLastEntry();
revealLogo();

////////////////////////////////////////////////////////////////////////////














