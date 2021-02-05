/**
 *
 *
 */


if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual';
}
document.body.scrollTop = 0;
document.documentElement.scrollTop = 0;

var body = document.getElementsByTagName("body")[0];
var elems = body.getElementsByClassName("anim");   
var typespeed = 20;

animateLogo()

function animateLogo() {
    var im = document.getElementById("logo");
    var mt = -100;
    var slider = setInterval(frame, 10);

    function frame() {
        if (mt == 5) {
            clearInterval(slider);
            return;
        }
        if (mt == -90) {
            im.style.visibility = "visible";
        }
        if (mt != 5) {
            mt++; 
            im.style.marginTop = mt + "%"; 
        }
    }

    setTimeout("wipeheaderin()", 2000);
}

// function wipeText(elem, wipe_right, callback) {

//     var wiper = setInterval(frame, 50);

//     var word = elem.textContent;
//     var c = wipe_right ? 0 : word.length;

//     function frame() {
//         elem.innerHTML = word.substring(0, c);

//         if (wipe_right) {
//             c++;
//             if (c == 1) {
//                 elem.style.visibility = "visible";
//             } else if(c == word.length) {
//                 clearInterval(wiper);
//             }
//         } else {
//             c--;
//             if (c == 0) {
//                 clearInterval(wiper);
//                 elem.style.visibility = "hidden";
//                 elem.innerHTML = word;
//             }
//         }
//     }

//     setTimeout(function () { callback(); }, 500);
// }

function wipeheaderin() {

    var wiper = setInterval(frame, 50);

    var elem = document.getElementById("jurgfish");

    var word = elem.textContent;
    var c = 0;
    // var c = 0; wipe_right ? 0 : words.length;

    function frame() {
        elem.innerHTML = word.substring(0, c);

        // if (wipe_right) {
        c++;
        if (c == 1) {
            elem.style.visibility = "visible";
        } else if(c == word.length) {
            clearInterval(wiper);
        }
        // } else {
        //     c--;
        //     if (c == 0) {
        //         clearInterval(wiper);
        //         elem.style.visibility = "hidden";
        //         elem.innerHTML = word;
        //     }
        // }
    }

    setTimeout("animateEntries()", 500);
    // setTimeout(function () { callback(); }, 500);
    // wipeText(document.getElementById("jurgfish"), true, animateEntries);
}

var j = 0;            

function animateEntries() {           
   setTimeout(function () {    
       var rect = elems[j].getBoundingClientRect();
       if (rect.top < (window.innerHeight * 0.80 || 
               document.documentElement.clientHeight * 0.80)) {
           slideUp(j);
           j++;
       }
       if (j < elems.length) {
           animateEntries();
       }
   }, 100)
}

function slideUp(j) {
    var elem = elems[j];
    var mt = 100;
    var slider = setInterval(frame, 1);

    function frame() {
        if (mt == 0) {
            clearInterval(slider);
            return;
        } else if (mt == 90) {
            elem.style.visibility = "visible";
        }
        if (mt != 0) {
            mt -= 1;
            elem.style.marginTop = mt + "%"; 
        }
    }

    typeWords(j);
}

function typeWords(j) {
    var elem = elems[j];

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

