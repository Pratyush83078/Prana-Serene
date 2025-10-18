var id = document.querySelector.bind(document);
var $ = document.querySelectorAll.bind(document);

cssVar = (p, v) => {
    let d;
    if (p.substr(0, 2) !== "--" && p.substr(0, 1) != "#") { p = "--" + p; }
    if (p.substr(0, 1) == "#") {
        d = $(p);
        return getComputedStyle(d).getPropertyValue(v);
    } else {
        d = document.documentElement;
        if (v) { d.style.setProperty(p, v); }
        return getComputedStyle(d).getPropertyValue(p);
    }
}

function reset() {
    for (let i = 0; i < allTimedout.length; i++) {
        clearTimeout(allTimedout[i]);
    }
    for (let i = 0; i < allInterval.length; i++) {
        clearInterval(allInterval[i]);
    }
    b.innerHTML = `PLAY! ▶`, bool = true, tt = -3, cycles = 0, $('title')[0].innerHTML = "Breathe Consciously - Prana a breathing app";
    $('.moniter>div')[0].innerHTML = `Click To <div>PLAY</div>!`;
    volumeChangeLive = true; countCycles = 0;
    pos == 'SUSTAIN' ? moniterChild.style = 'animation:none;' : moniterChild.style = 'animation:reset 0.5s 1 ease-in;';
    b.style = 'animation:;';
    for (let i = 0; i < frequency.length; i++) {
        if (typeof frequency[i] == "object") {
            if (frequency[i].play) {
                frequency[i].pause();
                frequency[i].currentTime = 0;
            }
        }
    }
    for (let i = 0; i < $('.anime').length; i++) { $(".anime")[i].style.transform = 'scale(1)'; }

    if (bell.play) { bell.pause(); bell.currentTime = 0; }
    let img = $('.playPause>img')[timerPlayNo];
    timerOn = false;
    img.src = './png/play.png'; img.width = '20'; img.height = '20';
    $('.playPause')[timerPlayNo].style = 'background-color:rgb(101 112 173);';
    cycleFocusout(timerPlayNo);
    if(oscillator!=0 ){oscillator.stop();}
}
var count = 1;
window.onkeydown = function (e) {
    let bool = true;
    // e.preventDefault();
    if (b != document.activeElement) {
        if (e.key == ' ' || e.key == 'Enter') {
            moniterChild.click();
            e.preventDefault();
        }
    }
    if (e.key == 'c' || e.key == 'm') {
        id('#menu').click();
    }
    if (e.key == 'n') {
        if (count == 1) {
            bell.play();
            frequency[0].src = './music/sDOM.mp3';
            frequency[2].src = './music/sDOM.mp3';
            frequency[0].currentTime = 0;
            frequency[2].currentTime = 0;
            slider[0].value = 15;
            slider[2].value = 15;
            count++;
        }
        else if (count == 2) {
            frequency[0].src = './music/pYOM.mp3';
            frequency[2].src = './music/pYOM.mp3';
            frequency[0].currentTime = 0;
            frequency[2].currentTime = 0;
            slider[0].value = 10;
            slider[2].value = 10;
            count = 0;
        }
        else if (count == 0) {
            frequency[0].src = './music/inhaling.mp3';
            frequency[2].src = './music/exhaling.mp3';
            frequency[0].currentTime = 0;
            frequency[2].currentTime = 0;
            slider[0].value = 12;
            slider[2].value = 12;
            count++;
        }
        startupMain();
        reset();
    }


    // if (slider[0] != document.activeElement && slider[1] != document.activeElement && slider[2] != document.activeElement && slider[3] != document.activeElement) {
    //     if (bool) {
    //         if (e.key == 'ArrowUp' && volumeChangeLive) {
    //             $('#volume>input')[0].value = (parseFloat(($('#volume>input')[0].value))) + 0.1;
    //             volumeChange();
    //             bool = false;
    //         }
    //         else if (e.key == 'ArrowDown' && volumeChangeLive) {
    //             ($('#volume>input')[0].value) -= 0.1;
    //             volumeChange();
    //             bool = false;
    //         }
    //     }
    // }

    // console.log(e.key)
}


var increment = 0;
class CreateInput {
    constructor(parentElem, obj = { type: 'range', min: 0, max: 'any', step: 1, value: 0 }, addNo) {
        this.inp = document.createElement('input');
        this.parentElem = parentElem;
        this.obj = obj;
        this.addNo = addNo;
        // this.incrementAfterCreateInput = increment;
    }
    createInput() {
        this.inp.type = this.obj.type;
        this.parentElem.insertBefore(this.inp, this.parentElem.children[this.addNo != undefined ? this.addNo : this.parentElem.children[this.parentElem.children.length]]);

        this.obj.min != undefined ? this.inp.min = this.obj.min : this.inp.min = 0;
        this.obj.max != undefined ? this.inp.max = this.obj.max : increment = increment;
        this.obj.step != undefined ? this.inp.step = this.obj.step : this.inp.step = 1;
        this.obj.value != undefined ? this.inp.value = this.obj.value : this.inp.value = 0;

        if (this.obj.id != undefined) { this.inp.id = this.obj.id; }
        if (this.obj.type == 'range') {
            increment++;

            this.inp.name = `${increment}`;
            this.inp.className = 'range';
            cssVar(`--progress-${increment}`, `${(100 / this.obj.max) * this.obj.value}%`);

            id('#style').innerHTML += `input[name="${increment}"]::before{width:var(--progress-${increment});
        }`;

        }


        if (this.obj.class != undefined) {
            this.inp.className += this.obj.class;
        }
    }
    numberRange() {
        this.inp.addEventListener('focusout', function () {
            if (this.value == "" || parseFloat(this.value) < parseFloat(this.min)) {
                this.value = parseFloat(this.min);
            }
            else if (this.value > parseFloat(this.max)) {
                this.value = parseFloat(this.max);
            }
            else {
                this.value = Math.round(parseFloat(this.value) * 100) / 100;
            }
        })
    }
    rangeScroll(event) {
        var vl = parseFloat(this.inp.value);
        var mx = parseFloat(this.inp.max);
        var mn = parseFloat(this.inp.min);
        var step = parseFloat(this.inp.step);

        if (event.deltaY < 0) {
            if (vl < mx) {
                this.inp.value = vl + step;
            }
        } else if (event.deltaY > 0) {
            if (vl > mn) {
                this.inp.value -= step;
            }
        }
    }
    scrollToggle() {
        this.inp.addEventListener('mouseover', function (event) {
            $('.slideContMainChild')[0].style.overflow = 'hidden';
        });
        this.inp.addEventListener('mouseout', function (event) {
            $('.slideContMainChild')[0].style.overflow = 'scroll';
        });
    }
    before() {
        cssVar(`--progress-${this.inp.name}`, `${(100 / this.inp.max) * this.inp.value}%`);
    }

}
