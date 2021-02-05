/**
 * 
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
var elemIdx = 0;
var logoPos = 10;
var typespeed = 20;
var titleTypespeed = 50;
var titleTimeout = 2000;
var animTimeout = 500;
var entryTimeout = 100;

animateLogo()

function animateLogo() {
    var elem = document.getElementById("logo");
    var marginTop = -100;
    var slider = setInterval(frame, 10);

    function frame() {
        if (marginTop == logoPos) {
            clearInterval(slider);
            return;
        } else if (marginTop == -90) {
            elem.style.visibility = "visible";
        } if (marginTop != logoPos) {
            marginTop++; 
            elem.style.marginTop = marginTop + "%"; 
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
    setTimeout(function () {
        var elem = elems[elemIdx];
        var bound = elem.getBoundingClientRect();
        if (bound.top < (window.innerHeight * 0.80 || 
                document.documentElement.clientHeight * 0.80)) {
            elem = elems[elemIdx]
            slideUp(elem);
            typeWords(elem);
            elemIdx++;
        } if (elemIdx < elems.length) {
            animateEntries();
        }
    }, entryTimeout)
}

function slideUp(elem) {
    var marginTop = 100;
    var slider = setInterval(frame, 1);

    function frame() {
        if (marginTop == 0) {
            clearInterval(slider);
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
        if (currentOffset == wordSet.length) {
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







