// jurgfish

////////////////////////////////////////////////////////////////////////////////

// reset position when refreshing page
if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual';
}
document.body.scrollTop = 0;
document.documentElement.scrollTop = 0;

////////////////////////////////////////////////////////////////////////////////

// text elements
var body = document.getElementsByTagName("body")[0];
var links = body.getElementsByClassName("links");
var elems = body.getElementsByClassName("anim");

// animation settings
var logoPos = 12;
var logoSpeed = 5;
var typeSpeed = 20;
var titleTypeSpeed = 50;

var loadBound = 0.93;
var visibleBound = 90;

var titleTimeout = 1000;
var elemTimeout = 500;

var animRunning = true;
var elemRunning = true;
var revealEndCnt = 1;

////////////////////////////////////////////////////////////////////////////////

// begin routine
animateLogo()

document.getElementById("tend").onclick = function() { snapEntries(); }
document.getElementById("logo").onclick = function() { location.reload(); }
document.getElementById("copyright").onclick = function() { location.reload(); }

////////////////////////////////////////////////////////////////////////////////

function animateLogo() {
    var elem = document.getElementById("logo");
    var marginTop = -100;
    var slider = setInterval(frame, logoSpeed);

    function frame() {
        if (marginTop == logoPos) {
            clearInterval(slider);
            return;
        } else if (marginTop == -visibleBound) {
            elem.style.visibility = "visible";
        } if (marginTop != logoPos) {
            marginTop++; 
            elem.style.marginTop = marginTop + "vh";
        }
    }

    setTimeout("typeTitle()", titleTimeout);
}

function typeTitle() {
    var elem = document.getElementById("title");
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
        }
    }

    setTimeout("animateEntries()", elemTimeout);
}

////////////////////////////////////////////////////////////////////////////////

function animateEntries() {
    slideUp(links[0]);

    var elemIdx = 0;
    var animator = setInterval(frame, elemTimeout);

    function frame() {
        var elem = elems[elemIdx];
        var bound = elem.getBoundingClientRect();
        if (bound.top < (window.innerHeight * loadBound || 
                document.documentElement.clientHeight * loadBound)) {
            slideUp(elem);
            typeWords(elem);
            elemIdx++;
        } if (elemIdx == elems.length || !animRunning) {
            clearInterval(animator);
            animator = null;
            if (animRunning) { setTimeout(slideUp(links[1]), elemTimeout); }
        }
    }
}

function snapEntries() {
    animRunning = false;
    elemRunning = false;

    var marginTop = 100;
    var elemIdx = 0;
    var elem;

    while (elemIdx < elems.length - revealEndCnt) {
        elem = elems[elemIdx];
        elem.style.marginTop = "0%"; 
        elem.style.visibility = "visible";
        elemIdx++;
    }

    setTimeout("goToBottom()", elemTimeout);
}

////////////////////////////////////////////////////////////////////////////////

function goToBottom (){
    var elem = document.getElementById("end");
    var pos = 0;
    do {
        pos += elem.offsetTop;
    } while (elem = elem.offsetParent);
    window.scroll(0,pos);

    setTimeout("revealEnd()", elemTimeout);
}

function revealEnd() {
    var elemIdx = elems.length - revealEndCnt;
    var endAnimator = setInterval(frame, elemTimeout);
    elemRunning = true;

    function frame() {
        var elem = elems[elemIdx];
        slideUp(elem);
        typeWords(elem);
        elemIdx++;
        if (elemIdx == elems.length) {
            clearInterval(endAnimator);
            endAnimator = null;
            setTimeout(slideUp(links[1]), elemTimeout);
        }
    }
}

////////////////////////////////////////////////////////////////////////////////

function slideUp(elem) {
    var marginTop = 100;
    var slider = setInterval(frame, 1);

    function frame() {
        if (marginTop == 0 || !elemRunning) {
            clearInterval(slider);
            slider = null;
            return;
        } else if (marginTop == visibleBound) {
            elem.style.visibility = "visible";
        } if (marginTop != 0) {
            marginTop -= 1;
            elem.style.marginTop = marginTop + "%"; 
        }
    }
}

function typeWords(elem) {
    var fullText = elem.textContent;
    var wordSet = fullText.split(" ");
    var wordSetIdx = 0;
    var text = "";
    var typer = setInterval(frame, typeSpeed);

    function frame() {
        wordSetIdx++;
        if (wordSetIdx == wordSet.length || !elemRunning) {
            clearInterval(typer);
            typer = null;
            elem.innerHTML = fullText;
            return;
        }
        text += wordSet[wordSetIdx] + " ";
        elem.innerHTML = text.trim();
    }
}


////////////////////////////////////////////////////////////////////////////////








