// jurgfish

////////////////////////////////////////////////////////////////////////////////

// text elements
var body = document.getElementsByTagName("body")[0];
var noanim = body.getElementsByClassName("noanim");
var elems = body.getElementsByClassName("anim");
var logoElem = document.getElementById("logo");
var titleElem = document.getElementById("title");
var cpyrElem = document.getElementById("copyright");

// jump elements
var jumpGo = document.getElementById("jump");
var toggleJump = document.getElementById("showjump");
var inputEntry = document.getElementById("entry");
var divForm = document.getElementById("form");
var tendElem = document.getElementById("tend");

// animation settings
var logoPos = 15;
var logoSpeed = 5;
var typeSpeed = 20;
var titleTypeSpeed = 50;

var showInput = false;
var elemIdx = 0;
var noanimIdx = 0;

var loadBound = 0.93;
var visibleBound = 90;
var scrollOffset = 20;

var titleTimeout = 1500;
var elemTimeout = 500;
var endTimeout = 1500;

var animRunning = true;
var elemRunning = true;

////////////////////////////////////////////////////////////////////////////////

// begin routine
resetPosition();
revealLogo();

logoElem.onclick = function() { location.reload(); }
titleElem.onclick = function() { location.reload(); }
cpyrElem.onclick = function() { location.reload(); }

// entry jumping
document.onkeydown = function(event) {
    if (event.key === "Enter" || event.keyCode === 13 || event.which === 13) {
        event.preventDefault();
        jumpGo.click();
    }
}

toggleJump.onclick = function() {
    showInput = !showInput;
    if (showInput) {
        toggleJump.innerHTML = "(hide jump)"
        divForm.style.display = "block";
    } else {
        toggleJump.innerHTML = "jump"
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

tendElem.onclick = function() {
    elemIdx = elems.length;
    jumpToEntryIdx();
}

////////////////////////////////////////////////////////////////////////////////

function revealLogo() {
    var marginTop = -100;
    var slider = setInterval(frame, logoSpeed);

    function frame() {
        if (marginTop == logoPos) {
            clearInterval(slider);
            return;
        } else if (marginTop == -visibleBound) {
            logoElem.style.visibility = "visible";
        }
        if (marginTop != logoPos) {
            marginTop++; 
            logoElem.style.marginTop = marginTop + "%";
        }
    }

    setTimeout("revealStart()", titleTimeout);
}

function revealStart() {
    typeLetters(titleElem);
    
    setTimeout( function() {
        slideUp(noanim[noanimIdx++]);
        animateEntries();
    }, elemTimeout);
}

////////////////////////////////////////////////////////////////////////////////

function jumpToEntryIdx() {
    animRunning = false;
    elemRunning = false;

    if (elemIdx < 1) {
        elemIdx = 1;
    } else if (elemIdx > elems.length) {
        elemIdx = elems.length;
    }

    for (var j = 0; j < elems.length; j++) {
        if (j < elemIdx) {
            elems[j].style.marginTop = "0%"; 
            elems[j].style.visibility = "visible";
        } else {
            elems[j].style.visibility = "hidden";
        }
    }

    for (var j = 1; j < noanim.length; j++) {
        noanim[j].style.visibility = "hidden";
    }
    
    setTimeout("scrollToEntryIdx()", elemTimeout);
}

function scrollToEntryIdx() {
    var elem = elems[elemIdx - 1];
    window.scroll(0, elem.offsetTop - scrollOffset);

    if (elemIdx >= elems.length) {
        revealEnd();
    } else {
        setTimeout("animateEntries()", elemTimeout);
    }
}

function animateEntries() {
    animRunning = true;
    elemRunning = true;
    var animator = setInterval(frame, elemTimeout);

    function frame() {
        if (elemIdx >= elems.length || !animRunning) {
            clearInterval(animator);
            animator = null;
            if (animRunning) setTimeout("revealEnd()", endTimeout);
            return;
        }
        if (animateEntry(true, elems[elemIdx])) elemIdx++;
    }
}

function revealEnd() {
    elemRunning = true;
    noanimIdx = 1;
    var endAnimator = setInterval(frame, elemTimeout);
    
    function frame() {
        if (noanimIdx >= noanim.length) {
            clearInterval(endAnimator);
            endAnimator = null;
            return;
        }
        if (animateEntry(false, noanim[noanimIdx])) noanimIdx++;
    }
}

// returns false if entry was not animated
function animateEntry(typeFlag, elem) {
    var bound = elem.getBoundingClientRect();

    if (bound.top < (window.innerHeight * loadBound ||
            document.documentElement.clientHeight * loadBound)) {
        slideUp(elem);
        if (typeFlag) typeWords(elem);
        return true;
    }
    return false;
}

////////////////////////////////////////////////////////////////////////////////

function slideUp(elem) {
    var marginTop = 100;
    var slider = setInterval(frame, 1);

    function frame() {
        if (marginTop <= 0 || !elemRunning) {
            clearInterval(slider);
            slider = null;
            return;
        } else if (marginTop == visibleBound) {
            elem.style.visibility = "visible";
        }
        if (marginTop != 0) {
            marginTop -= 1;
            elem.style.marginTop = marginTop + "%"; 
        }
    }
}

function typeLetters(elem) {
    var word = elem.textContent;
    var c = 0;
    var wiper = setInterval(frame, titleTypeSpeed);

    function frame() {
        elem.innerHTML = word.substring(0, c);
        c++;
        if (c == 1) {
            elem.style.visibility = "visible";
        } else if (c == word.length) {
            clearInterval(wiper);
            wiper = null;
            return;
        }
    }
}

function typeWords(elem) {
    var fullText = elem.textContent;
    var wordSet = fullText.split(" ");
    var wordSetIdx = 0;
    elem.innerHTML = "";
    var typer = setInterval(frame, typeSpeed);

    function frame() {
        wordSetIdx++;
        if (wordSetIdx >= wordSet.length - 1 || !elemRunning) {
            clearInterval(typer);
            typer = null;
            elem.innerHTML = fullText;
            return;
        }
        elem.innerHTML += wordSet[wordSetIdx] + " ";
    }
}

////////////////////////////////////////////////////////////////////////////////

function resetPosition() {
    if ('scrollRestoration' in history) {
        history.scrollRestoration = 'manual';
    }
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
}












