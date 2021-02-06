// jurgfish

////////////////////////////////////////////////////////////////////////////////

// text elements
var body = document.getElementsByTagName("body")[0];
var noanim = body.getElementsByClassName("noanim");
var elems = body.getElementsByClassName("anim");

// animation settings
var logoPos = 12;
var logoSpeed = 5;
var typeSpeed = 20;
var titleTypeSpeed = 50;

var elemIdx = 0;
var noanimIdx = 0;

var loadBound = 0.93;
var visibleBound = 90;

var titleTimeout = 1000;
var elemTimeout = 500;

var animRunning = true;
var elemRunning = true;

////////////////////////////////////////////////////////////////////////////////

// begin routine
resetPosition()
animateLogo()

document.getElementById("tend").onclick = function() {
    elemIdx = elems.length;
    jumpToEntryIdx();
}
document.getElementById("logo").onclick = function() { location.reload(); }
document.getElementById("title").onclick = function() { location.reload(); }
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

    setTimeout( function() {
        slideUp(noanim[noanimIdx++]);
        animateEntries();
    }, elemTimeout);
}

////////////////////////////////////////////////////////////////////////////////

function jumpToEntryIdx() {
    // animRunning = false;
    // elemRunning = false;

    // var marginTop = 100;
    // var elemIdx = 0;
    // var elem;

    // while (elemIdx < elemIdx) {
    //     elem = elems[elemIdx];
    //     elem.style.marginTop = "0%"; 
    //     elem.style.visibility = "visible";
    //     elemIdx++;
    // }

    // setTimeout("snapBottom()", elemTimeout);

    console.log("jump to idx: ", elemIdx);

    animRunning = false;
    elemRunning = false;

    var j;
    for (j = 0; j < elems.length; j++) {
        if (j < elemIdx) {
            elems[j].style.marginTop = "0%"; 
            elems[j].style.visibility = "visible";
        } else {
            elems[j].style.visibility = "hidden";
        }
    }
    for (j = 1; j < noanim.length; j++) {
        noanim[j].style.visibility = "hidden";
    }

    setTimeout("scrollToEntryIdx()", elemTimeout);
}

function scrollToEntryIdx() {
    var elem = elems[elemIdx - 1];
    var pos = 0;
    do {
        pos += elem.offsetTop;
    } while (elem = elem.offsetParent);
    window.scroll(0,pos);

    setTimeout("animateEntries()", elemTimeout);
}

function animateEntries() {
    animRunning = true;
    elemRunning = true;

    console.log("animating...");
    
    // var elemIdx = 0;
    var animator = setInterval(frame, elemTimeout);

    function frame() {
        if (elemIdx == elems.length || !animRunning) {
            console.log("ending animate");
            clearInterval(animator);
            animator = null;
            if (animRunning) {
                setTimeout("revealEnd()", elemTimeout);
                // setTimeout(function(){
                //     slideUp(noanim[1]);
                //     slideUp(noanim[2]);
                // }, elemTimeout);
            }
            return;
        }

        // var elem = elems[elemIdx];
        // var bound = elem.getBoundingClientRect();
        // if (bound.top < (window.innerHeight * loadBound ||
        //         document.documentElement.clientHeight * loadBound)) {
        //     slideUp(elem);
        //     typeWords(elem);
        //     elemIdx++;
        // }

        if (animateEntry(true, elems[elemIdx])) { elemIdx++; }
        console.log("idx: ", elemIdx, " len: ", elems.length);
    }
}

function revealEnd() {
    var endAnimator = setInterval(frame, elemTimeout);

    function frame() {
        if (noanimIdx >= noanim.length) {
            clearInterval(endAnimator);
            endAnimator = null;
            return;
        }
        // var elem = noanim[noanimIdx];
        // var bound = elem.getBoundingClientRect();
        // if (bound.top < (window.innerHeight * loadBound ||
        //         document.documentElement.clientHeight * loadBound)) {
        //     slideUp(elem);
        //     noanimIdx++;
        // }
        if (animateEntry(false, noanim[noanimIdx])) { noanimIdx++; }

        
        console.log("end noanim: ", noanimIdx, " noanim len: ", noanim.length);
    }
}

function animateEntry(typeFlag, elem) {

    console.log("entry animating...")
    var bound = elem.getBoundingClientRect();
    if (bound.top < (window.innerHeight * loadBound ||
            document.documentElement.clientHeight * loadBound)) {
        slideUp(elem);
        if (typeFlag) { typeWords(elem); }
        return true;
    }
    return false;
}

// function snapBottom() {
//     elems[elems.length - 1].style.visibility = "hidden";
//     links[1].style.visibility = "hidden";

//     window.scroll(0, document.body.scrollHeight ||
//         document.documentElement.scrollHeight);

//     elemRunning = true;
//     slideUp(elems[elems.length - 1]);
//     setTimeout(function() { slideUp(links[1]); }, elemTimeout);
// }

////////////////////////////////////////////////////////////////////////////////

function slideUp(elem) {
    var marginTop = 100;
    var slider = setInterval(frame, 1);

    if (!elem) {
        console.log("error");
        return;
    }

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

function resetPosition() {
    if ('scrollRestoration' in history) {
        history.scrollRestoration = 'manual';
    }
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
}






