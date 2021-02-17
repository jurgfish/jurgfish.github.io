// jurgfish

////////////////////////////////////////////////////////////////////////////

var version = "j144."

// text elements
var logoElem = document.getElementById("logo");
var titleElem = document.getElementById("title");
var lastEntry = document.getElementById("end");
var cpyrElem = document.getElementById("copyright");
var body = document.getElementsByTagName("body")[0];
var endspace = document.getElementById("endspace");
var noanim = body.getElementsByClassName("noanim");
var elems = body.getElementsByClassName("anim");

// jump elements
var jumpGo = document.getElementById("jump");
var toggleJump = document.getElementById("showjump");
var inputEntry = document.getElementById("entry");
var divForm = document.getElementById("form");
var tbeginElem = document.getElementById("tbegin");
var tendElem = document.getElementById("tend");
var buttElem = document.getElementById("butt");

// animation settings
var logoStartPos = 1;
var logoEndPos = 15;
var logoS = 0.000001;
var logoT = 3;
var logoSpeed = 5;
var typeSpeed = 5;
var titleTypeSpeed = 50;
var titleTimeout = 400;
var versTimeout = 1500;
var showVer = false;
var showInput = false;

var elemIdx = 0;
var noanimIdx = 0;
var entryIdxLen = 3;
var entryIdxBuf = "0000";
var noanimEntryCnt = 1;
var nonNovelEndCnt = 2;
var novelLength = elems.length - nonNovelEndCnt;
var elemTimeout = 500;
var loadBound = 0.93;
var slideStart = 100;
var slideSpeed = 2;
var elemRunning = true;
var animator = null;

var scrollTimer = null;
var scrollOffset = 28;
var buttScroll = 1000;
var scrollTimeout = 400;
var jumpTimeout = 100;
var widthBound = 660;
var endspaceStartHeight = 200;
var endspaceEndHeight = 30; 
var endspaceSpeed = 1;
var buttSpeed = 1;
var buttShowPos = 30;
var buttHidePos = -100;
var showRunning = false;
var buttShown = false;

////////////////////////////////////////////////////////////////////////////

function slideUp(elem) {
    var marginTop = slideStart;
    elem.style.marginTop = marginTop + "px"; 
    elem.style.visibility = "visible";
    var slider = setInterval(frame, slideSpeed);

    function frame() {
        marginTop -= slideSpeed; 
        elem.style.marginTop = marginTop + "px"; 

        if (marginTop <= 0 || !elemRunning) {
            clearInterval(slider);
            slider = null;
            elem.style.marginTop = "0px"; 
            return;
        }
    }
}

function typeWords(elem) {
    var fullText = elem.textContent.trim();
    var currText = "";
    var wordSet = fullText.split(" ");
    var wordSetIdx = 0;
    elem.textContent = "";
    elem.style.opacity = "0.8";
    var typer = setInterval(frame, typeSpeed);

    function frame() {
        currText += wordSet[wordSetIdx] + " ";
        elem.textContent = currText;
        wordSetIdx++;

        if (wordSetIdx >= wordSet.length - 1 || !elemRunning) {
            clearInterval(typer);
            typer = null;
            elem.textContent = fullText;
            elem.style.opacity = "1";
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
    lastEntry.textContent = "[Island of Mind " +
        formatNum(novelLength + 1) + "+] will appear when ready";
    version += formatNum(novelLength);
    endspace.style.height = endspaceStartHeight + "em";
}

function resetPosition() {
    if ('scrollRestoration' in history)
        history.scrollRestoration = 'manual';
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
}

function reduceEndSpace() {
    var h = endspaceStartHeight; 
    var reducer = setInterval(frame, endspaceSpeed);

    function frame() {
        h--;
        endspace.style.height = h + "em";

        if (h == endspaceEndHeight) {
            clearInterval(reducer);
            reducer = null;
            return;
        } 
    }
}

////////////////////////////////////////////////////////////////////////////

function animateEntry(typeFlag, elem) {
    var bound = elem.getBoundingClientRect();
    var validBound = (bound.top < (window.innerHeight * loadBound ||
        document.documentElement.clientHeight * loadBound));

    if (validBound) {
        if (typeFlag) typeWords(elem);
        slideUp(elem);
    }
    return validBound;
}

function animateEntries() {
    elemRunning = true;
    animator = setInterval(frame, elemTimeout);

    function frame() {
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
    }
}

////////////////////////////////////////////////////////////////////////////

function scrollToEntryIdx() {
    var elem = elems[elemIdx - 1];
    window.scroll(0, elem.offsetTop - scrollOffset);
    animateEntries();
}


function jumpToEntryIdx() {
    clearInterval(animator);
    animator = null;
    elemRunning = false;

    if (elemIdx < 1) {
        elemIdx = 1;
    } else if (elemIdx >= elems.length) {
        elemIdx = elems.length - 1;
    }
    noanimIdx = noanimEntryCnt;

    for (var j = 0; j < elems.length; j++) {
        if (j < elemIdx) {
            elems[j].style.marginTop = "0px"; 
            elems[j].style.visibility = "visible";
        } else {
            elems[j].style.visibility = "hidden";
        }
    }

    for (var j = noanimEntryCnt; j < noanim.length; j++) {
        noanim[j].style.visibility = "hidden";
    }
    
    endspace.style.height = endspaceStartHeight + "em";
    setTimeout("scrollToEntryIdx()", jumpTimeout);
}

////////////////////////////////////////////////////////////////////////////

function revealTitle() {
    var word = titleElem.textContent;
    var c = 0;
    titleElem.textContent = ""; 
    titleElem.style.visibility = "visible";
    var typer = setInterval(frame, titleTypeSpeed);

    function frame() {
        c++;
        titleElem.textContent = word.substring(0, c);

        if (c == word.length) {
            clearInterval(typer);
            typer = null;
            showVer = true;
            setTimeout("animateEntries()", titleTimeout);
            return;
        }
    }
}

function revealLogo() {
    var marginTop = logoStartPos;
    var t = 0;
    var opa = 0;
    logoElem.style.marginTop = marginTop + "%";
    logoElem.style.visibility = "visible";
    logoElem.style.opacity = "0";
    var slider = setInterval(frame, logoSpeed);
    
    function frame() {
        marginTop += (logoS * (t ** logoT));
        logoElem.style.marginTop = marginTop + "%";
        t++;
        if (opa < 1) {
            opa += 0.001;
            logoElem.style.opacity = opa;
        }

        if (marginTop >= logoEndPos) {
            clearInterval(slider);
            slider = null;
            logoElem.style.marginTop = logoEndPos + "%";
            logoElem.style.opacity = "1";
            revealTitle();
            return;
        }
    }
}

function moveButt(show) {
    var right = (show) ? buttHidePos : buttShowPos;
    var delta = (show) ? 2 : -2;
    buttElem.style.right = right + "px";
    buttElem.style.display = "block";
    var buttSlider = setInterval(frame, buttSpeed);

    function frame() {
        right += delta;
        buttElem.style.right = right + "px";

        if ((show && right >= buttShowPos) ||
                (!show && right <= buttHidePos)) {
            clearInterval(buttSlider);
            buttSlider = null;
            showRunning = false;
            return;
        }
    }
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

        buttElem.style.opacity = "0.5";
        if (scrollTimer !== null) {
            clearTimeout(scrollTimer);
            scrollTimer = null;
        }
        scrollTimer = setTimeout(function() {
            buttElem.style.opacity = "1";
        }, scrollTimeout);

    } else {
        if (buttShown && !showRunning) {
            showRunning = true;
            moveButt(false);
            buttShown = false;
        }
    }
}

buttElem.onclick = function() {
    buttElem.style.display = "none";
    resetPosition();
    toggleJump.focus(); // prevents strange behavior
    document.activeElement.blur();
}

logoElem.onclick = function() { location.reload(); }
cpyrElem.onclick = function() { location.reload(); }

titleElem.onclick = function() {
    if (showVer) {
        showVer = false;
        titleElem.textContent = version;
        setTimeout(function() {
            titleElem.textContent = "jurgfish";
            showVer = true;
        }, versTimeout);
    }
}

// entry jumping
tendElem.onclick = function() {
    elemIdx = novelLength + 1;
    jumpToEntryIdx();
}

tbeginElem.onclick = function() {
    elemIdx = 1;
    jumpToEntryIdx();
}

toggleJump.onclick = function() {
    showInput = !showInput;
    if (showInput) {
        toggleJump.textContent = "(hide jump)"
        divForm.style.display = "block";
        setTimeout(function() { inputEntry.focus(); }, jumpTimeout);
    } else {
        toggleJump.textContent = "use jump"
        divForm.style.display = "none";
        inputEntry.value = "";
        document.activeElement.blur();
    }
}

jumpGo.onclick = function() {
    var inputEntryVal = parseInt(inputEntry.value);
    if (!(isNaN(inputEntryVal))) {
        elemIdx = inputEntryVal;
        if (elemIdx > novelLength) elemIdx = novelLength + 1;
        document.activeElement.blur();
        jumpToEntryIdx();
    }
}

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
}

////////////////////////////////////////////////////////////////////////////

// begin routine
resetPosition();
setLastEntry();
window.onload = function() { revealLogo(); };

////////////////////////////////////////////////////////////////////////////



