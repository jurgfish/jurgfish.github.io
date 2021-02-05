/**
 * (message)
 *
 */

// reset position when refreshing page
if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual';
}
document.body.scrollTop = 0;
document.documentElement.scrollTop = 0;

var body = document.getElementsByTagName("body")[0];
var elems = body.getElementsByClassName("anim");
var logoPos = 12;
var logoSpeed = 5;
var typespeed = 20;
var loadBound = 0.93;
var titleTypespeed = 50;
var titleTimeout = 1500;

var animTimeout = 500;
var entryTimeout = 500;

var animRunning = true;
var elemRunning = true;

animateLogo()

document.getElementById("tend").onclick = function() {
    
    skipAnim();
    setTimeout("goToBottom()", 100);
}

function goToBottom (){
    var elem = document.getElementById("end");
    var pos = 0;
    do {
        pos += elem.offsetTop;
    } while (elem = elem.offsetParent);
    window.scroll(0,pos);
}

function findPos(obj) {
    var curtop = 0;
    if (obj.offsetParent) {
        do {
            curtop += obj.offsetTop;
        } while (obj = obj.offsetParent);
        return [curtop];
    }
}

function animateLogo() {
    var elem = document.getElementById("logo");
    var marginTop = -100;
    var slider = setInterval(frame, logoSpeed);

    function frame() {
        if (marginTop == logoPos) {
            clearInterval(slider);
            return;
        } else if (marginTop == -90) {
            elem.style.visibility = "visible";
        } if (marginTop != logoPos) {
            marginTop++; 
            elem.style.marginTop = marginTop + "vh";
        }
    }

    setTimeout("wipeheaderin()", titleTimeout);
}

function wipeheaderin() {
    var elem = document.getElementById("title");
    var word = elem.textContent;
    var c = 0;
    var wiper = setInterval(frame, titleTypespeed);

    function frame() {
        elem.innerHTML = word.substring(0, c);
        c++;
        if (c == 1) {
            elem.style.visibility = "visible";
        } else if (c == word.length) {
            clearInterval(wiper);
        }
    }

    slideUp(document.getElementsByClassName("links")[0]);
    setTimeout("animateEntries()", animTimeout);
} 

function animateEntries() {
    var elemIdx = 0;
    var animator = setInterval(frame, entryTimeout);

    function frame() {
        var elem = elems[elemIdx];
        var bound = elem.getBoundingClientRect();
        if (bound.top < (window.innerHeight * loadBound || 
                document.documentElement.clientHeight * loadBound)) {
            // elem = elems[elemIdx]
            slideUp(elem);
            typeWords(elem);
            elemIdx++;
        } if (elemIdx == elems.length || !animRunning) {
            clearInterval(animator);
        }
        console.log("running animator");
    }
}

function skipAnim() {
    // clearTimeout(animEntries);
    

    // elemRunning = true;

    // running = true;

    displayEntries();
    setTimeout("revealEnd()", 500);
}

function displayEntries() {
    animRunning = false;
    elemRunning = false;

    var marginTop = 100;
    var elemIdx = 0;
    var elem;

    while (elemIdx < elems.length - 1) {
        elem = elems[elemIdx];
        elem.style.marginTop = "0%"; 
        elem.style.visibility = "visible";
        elemIdx++;
    }
}

function revealEnd() {
    elemRunning = true;
    slideUp(elems[elems.length - 1]);
    typeWords(elems[elems.length - 1]);
}

function slideUp(elem) {
    var marginTop = 100;
    var slider = setInterval(frame, 1);

    function frame() {
        if (marginTop == 0 || !elemRunning) {
            clearInterval(slider);
            // elem.style.marginTop = marginTop + "%"; 
            // elem.style.visibility = "visible";
            return;
        } else if (marginTop == 90) {
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
    var currentOffset = 0;
    var typer = setInterval(frame, typespeed);

    function frame() {
        currentOffset++;
        if (currentOffset == wordSet.length || !elemRunning) {
            clearInterval(typer);
            typer = null;
            elem.innerHTML = fullText;
            return;
        }
        var text = "";
        for(var i = 0; i < currentOffset; i++){
            text += wordSet[i] + " ";
        }
        text.trim();
        elem.innerHTML = text;
    }
}







