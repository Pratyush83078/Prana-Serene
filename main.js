var inhaleSound = new Audio('./music/inhaling.mp3'), exhaleSound = new Audio('./music/exhaling.mp3');
// var sustainSound=new Audio('');
// var retainSound=new Audio('');

var breath = [12, 0, 12, 0], frequency = [inhaleSound, 70, exhaleSound, 45];
var allTimedout = [];
var allInterval = [];

var audioVol, fadeVal = [2.4, 1.5], fadeMax = [5, 5], fadeOnOff = [1, 1], fadeInp = $('.duration>input'), cVal = [10], mVal = [5], timerPlayNo = 0, oscillator = 0;
;

var moniterChild = $('.moniter>div')[0], b = $('button')[0];

var breathInpObj = [], slider = [];
for (let i = 0; i < 9; i++) {
    if (i < 8) {
        breathInpObj.push(new CreateInput(i < 4 ? $('.breathParent')[i] : $('.breathParent>div')[i - 4], { type: i < 4 ? 'range' : 'number', min: i % 2 == 0 ? 1 : 0, max: 50, value: i < 4 ? breath[i] : breath[i - 4] }, 1));

        breathInpObj[i].inp.oninput = function () {
            // this.value == '' && (this.value = this.min);
            i < 4 ? breathInpObj[i + 4].inp.value = this.value : slider[i - 4].value = this.value; breathInpObj[i > 3 ? i : 4].numberRange();
            reset(); breath[i < 4 ? i : i - 4] = parseInt(this.value);
            breathInpObj[i < 4 ? i : i - 4].before();
        }
    }
    else if (i == 8) {
        breathInpObj.push(new CreateInput(id('#volume'), { type: 'range', min: 0, max: 1, value: 1, step: .05 }));
        audioVol = parseFloat(breathInpObj[8].obj.value);
        breathInpObj[i].inp.oninput = function () {
            breathInpObj[i].before(); volumeChange();
        }
    }
    breathInpObj[i].createInput();
    if (i < 4 || i > 7) {
        breathInpObj[i].inp.addEventListener('wheel', function (e) {
            if (breathInpObj[i].obj.type == 'range') {
                breathInpObj[i].before();
            }
            breathInpObj[i].rangeScroll(e);
            startupMain(); if (i != 8) reset();
        });
        breathInpObj[i].scrollToggle();
        if (i < 4) {
            slider.push(breathInpObj[i].inp);
            breath[i] = parseInt(slider[i].value);
        }
    }

}
function startupMain() {
    for (let i = 0; i < 4; i++) {
        breath[i] = parseFloat(slider[i].value);
        breathInpObj[i + 4].inp.value = slider[i].value;
        breathInpObj[i].before();
    }
    $('.duration>input')[0].value = fadeVal[0];
    $('.duration>input')[1].value = fadeVal[1];
    for (let i in fadeVal) { fadeVal[i] = parseFloat(fadeInp[i].value); }
    // reset();
    volumeChange();

}

function typeNumberRange(elem, min, max, result, anyFunct, param) {
    elem.addEventListener('focusout', function () {
        if (elem.value == "" || parseFloat(elem.value) < parseFloat(min)) {
            elem.value = parseFloat(min);
        }
        else if (elem.value > parseFloat(max)) {
            elem.value = parseFloat(max);
        }
        else {
            elem.value = Math.round(parseFloat(elem.value) * 100) / 100;
        }
        if (typeof result == 'object') { for (let i of result) { typeof i == 'object' ? i.value = parseFloat(elem.value) : i = parseFloat(elem.value); } }
        else { result = parseFloat(elem.value); }
        if (typeof anyFunct == 'function') { anyFunct(param); }
        // console.log(typeof cVal[0])

    })
}
function rangeScroll(elem, min, valueElem, max, step = 1, result, anyFunct, param, oneMoreFunc) {
    elem.addEventListener('wheel', function (event) {
        var vl = (Math.round(parseFloat(valueElem.value)) * 100) / 100;
        // var mx = parseFloat(max);
        // var mn = parseFloat(min);
        event.preventDefault();
        if (event.deltaY < 0) {
            if (vl < max) {
                if (typeof result == 'object') { for (let i of result) { typeof i == 'object' ? i.value = parseFloat(vl + step) : i = parseFloat(vl + step); } }
                else { result = parseFloat(vl + step); }
            }
        } else if (event.deltaY > 0) {
            if (vl > min) {
                if (typeof result == 'object') { for (let i of result) { typeof i == 'object' ? i.value = parseFloat(vl - step) : i = parseFloat(vl - step); } }
                else { result = parseFloat(vl - step); }
            }
        }
        if (typeof anyFunct == 'function') { anyFunct(param); }
        if (typeof oneMoreFunc == 'function') { oneMoreFunc(); }
    })
}
var volumeChangeLive = true;
function volumeChange() {
    audioVol = (parseFloat(($('#volume>input')[0].value)));
    for (let i = 0; i < frequency.length; i++) {
        if (typeof frequency[i] == "object") {
            if (frequency[i].play && volumeChangeLive) {
                frequency[i].volume = audioVol;
            }
        }
    }
    bell.volume=audioVol;
    // alert(0)
}
// startupMain()
var bool = true, pos, time = 0, tt = -3, countCycles = 0, oneCycle = (breath[0] + breath[1] + breath[2] + breath[3]) / 60, timerOn = false;

var bell = new Audio('./music/bell.mp3');
b.onclick = function () {
    startupMain();
    b.style = 'animation:wiggle .5s 1 ease-out; background:radial-gradient(circle, rgba(139,69,19,0.1) 35%,rgba(29,28,296,0.2) 98%);color:#eff;';
    for (let i = 0; i < $('.anime').length; i++) { $(".anime")[i].style.transform = 'scale(0.84)'; }
    if (bool) {
        time = 3;
        pos = "STARTING";
        stopwatch();
        allTimedout[0] = setTimeout(function () {
            main();
            allInterval[1] = setInterval(function () {
                main();
                if (timerOn === true) { if (countCycles >= cVal[timerPlayNo] + 1) { $('.playPause')[timerPlayNo].click(); } }

            }, (breath[0] + breath[1] + breath[2] + breath[3]) * 1000);
        }, 3000);
        // bell.play();
        // // bell.volume=audioVol;
        // fade(bell,8,2.5,0.01,true,4);
        audioCalling(bell,3,0.2,2);
        bool = false;
    }
    else if (!bool) {
        reset();
    }

}
moniterChild.onclick = function () {
    moniterChild.style.animation = '';
    if (bool) {
        b.click();
        this.innerHTML = `${pos} : <div> ${time}s </div>`;
        bool = false;
        this.style = 'animation:circle-wiggle .3s 1 ease-out;'
    }
    else {
        b.click();
    }

}

function audioCalling(givenAudio, playTime,fadingIn=false,fadingOut=false) {
    if (typeof givenAudio == "number") {
        var context = new AudioContext();
        oscillator = context.createOscillator();
        oscillator.connect(context.destination);
        
        // var gainNode = context.createGain();
        // oscillator.connect(gainNode);
        // gainNode.connect(context.destination);
        // gainNode.gain.value=audioVol;
        // console.log(gainNode.gain.value);

        oscillator.frequency.value = givenAudio;
        oscillator.start();
        oscillator.stop(context.currentTime + playTime);
    }
    else {
        givenAudio.play();
        if(breath[0]<5 || breath[2]<5 ){
            if(breath[0]<3 || breath[2]<3){
                fadeVal[0]<0.5 & (fadeVal[0]=0.5); fadeVal[1]<0.5 & (fadeVal[1]=0.4);
            }else{
                fadeVal[0]<1.5 & (fadeVal[0]=1); fadeVal[1]<1.5 & (fadeVal[1]=1);
            }
        }
        fadeMax[0] = playTime - fadeVal[1];
        fadeMax[1] = playTime - fadeVal[0];
        
        fade(givenAudio, playTime,!fadingIn?fadeVal[0]:fadingIn, 0.01, true, !fadingOut?fadeVal[1]:fadingOut);
        allTimedout[4] = setTimeout(function () {
            givenAudio.play && (givenAudio.pause())
            givenAudio.currentTime = 0;
            givenAudio.volume = audioVol;
        }, (playTime + 0.04) * 1000);
        // givenAudio.addEventListener('ended', function() {
        //     this.currentTime = 0;
        //     this.play();
        //   }, false);
    }
}

function fade(givenAudio, playTime, fadeDuration, fadeFrameRate, fadingOut = true, fadeOutDur = fadeDuration, fadeOutFrameRate = fadeFrameRate) {
    if (allInterval[4] != undefined) {
        clearInterval(allInterval[4]);
    }
    var x;//rate of interval;
    if (playTime >= fadeDuration + fadeOutDur && audioVol > 0.1) {
        givenAudio.volume = 0.1;
        // console.log(fadeDuration+' + ' +fadeOutDur +' <= '+playTime);
        x = Math.round(Math.abs(audioVol / fadeFrameRate) * 100) / 100;
        allInterval[3] = setInterval(function () {
            // console.log(givenAudio.volume + " "+ x)
            if (parseFloat(givenAudio.volume) > audioVol - fadeFrameRate) {
                clearInterval(allInterval[3]);
                givenAudio.volume = audioVol;
                if (fadingOut == true) {
                    allTimedout[5] = setTimeout(function () { fadeOut(givenAudio, playTime, fadeOutDur, fadeOutFrameRate); }, (playTime - fadeDuration - fadeOutDur) * 1000);
                }
            }
            else {
                givenAudio.volume += fadeFrameRate;
            }
        }, Math.round((fadeDuration * 1000) / (x )))
    }
}
function fadeOut(givenAudio, playTime, fadeDuration, fadeFrameRate) {
    if (allInterval[3] != undefined) {
        clearInterval(allInterval[3]);
    }

    // slider[4].disabled=true;
    var x;//rate of interval;
    if (audioVol >= 0.1) {
        x = Math.round(Math.abs(audioVol / fadeFrameRate) * 100) / 100;
        givenAudio.volume = audioVol;
        allInterval[4] = setInterval(function () {
            if (givenAudio.currentTime >= playTime - fadeDuration) {
                if (parseFloat(givenAudio.volume) <= fadeFrameRate) {
                    clearInterval(allInterval[4]);
                    if (givenAudio.play) {
                        givenAudio.volume = 0;
                        givenAudio.pause();
                        givenAudio.currentTime=0
                    }
                    givenAudio.currentTime = 0;
                }
                else {
                    givenAudio.volume -= fadeFrameRate;
                }
            }
        }, Math.round((fadeDuration * 1000) / (x)))
    }
}
function stopwatch() {
    b.innerHTML = `${pos} ( ${time}s )`;
    $('.moniter>div')[0].innerHTML = `${pos} : <div> ${time}s </div>`;
    $('title')[0].innerHTML = `${pos} ( ${time}s ) +${countCycles}   (${tt})s`;
    allInterval[2] = setInterval(function () {
        if (time < 1) {
            clearInterval(allInterval[2]);
        } else {
            time -= 1; tt += 1;
            b.innerHTML = `${pos} ( ${time}s )`;
            $('.moniter>div')[0].innerHTML = `${pos} : <div> ${time}s </div>`;
            $('title')[0].innerHTML = `${pos} ( ${time}s ) +${countCycles}   (${tt})s`;
        }
    }, 1000);
}
function main() {


    if (breath[0] > 0) {
        countCycles += 1;
        audioCalling(frequency[0], breath[0]);
        time = breath[0]; pos = 'INHALE';
        moniterChild.style = `animation:inhale ${time}s 1 ease-out forwards;`
        clearInterval(allInterval[2]); stopwatch();
        // bell.play();
    }
    allTimedout[1] = setTimeout(function () {
        if (breath[1] > 0) {
            audioCalling(frequency[1], breath[1]);
            time = breath[1]; pos = 'RETAIN';
            clearInterval(allInterval[2]); stopwatch();
        }
        allTimedout[2] = setTimeout(function () {
            if (breath[2] > 0) {
                audioCalling(frequency[2], breath[2]);
                time = breath[2]; pos = 'EXHALE';
                clearInterval(allInterval[2]); stopwatch();
                moniterChild.style = `animation:exhale ${time}s 1 ease-out forwards;`
            }
            allTimedout[3] = setTimeout(function () {
                if (breath[3] > 0) {
                    audioCalling(frequency[3], breath[3]);
                    time = breath[3]; pos = 'SUSTAIN';
                    clearInterval(allInterval[2]); stopwatch();
                }
            }, (breath[2]) * 1000);
        }, (breath[1]) * 1000);
    }, (breath[0]) * 1000);
}

var menuToggle = false;
id("#menu").onclick = function () {
    if (!menuToggle) {
        $('.slidecontainer')[0].style = 'right:5px;';
        this.style = 'transform: translate(calc(100vw - ((clamp(20rem, 100vw, 40rem) / 2 ) + 33px / 2)), 1.7rem) rotate(90deg);';
        id('#volume').style = 'transform: translate(-1rem,-125%);';
        menuToggle = true;
    }
    else {
        $('.slidecontainer')[0].style = 'right:100%;';
        this.style = 'transform: transform: translate(calc(100vw - 3.8rem), 1.2rem) rotate(0deg);';
        id('#volume').style = 'transform: translate(0px,0px);';
        menuToggle = false;
    }
}

var allHeight = [];
setTimeout(function () {
    for (let i = 0; i < $('.downSlide').length; i++) {

        allHeight[i] = ($(`.option`)[i].clientHeight);
        $(`.option`)[i].style.height = `${(allHeight[i])}px`;

        $('.downSlide')[i].onclick = function () {
            //  console.log($(`.option`)[i].style.height+"  "+ allHeight[i]+'rem');
            if ($(`.option`)[i].style.height == allHeight[i] + 'px') {
                $('.downSlide')[i].style.filter = 'opacity(76%)';

                $('.downSlide>img')[i].style.transform = 'rotateZ(270deg)'
                $(`.option`)[i].style.height = '5px'
                $(`.optionOpacity`)[i].style = 'opacity:0;visibility:hidden;'
            }
            else {
                $('.downSlide')[i].style.filter = 'opacity(100%)';
                $('.downSlide>img')[i].style.transform = 'rotateZ(90deg)';
                $(`.option`)[i].style.height = `${(allHeight[i])}px`;
                $(`.optionOpacity`)[i].style = 'visiblity:visible; opacity:1;';
            }
        }
        if (i != 0) { $('.downSlide')[i].click() }
        // console.log(allHeight[i])
    }
}, 500)
// ------- Panel: 2;
for (let i = 0; i < $('.duration').length; i++) {
    fadeInp[i].value = parseFloat(fadeVal[i]);
    fadeVal[i] = parseFloat(fadeInp[i].value);
    // rangeScroll(fadeInp[i],0,fadeInp[i].value,fadeMax[i],.1,fadeInp[i]);
    $('.minus')[i].onclick = function () {
        fadeInp[i].value = minMax(0, fadeInp[i].value, fadeMax[i], -0.1); reset();
    }
    $('.plus')[i].onclick = function () {
        fadeInp[i].value = minMax(0, fadeInp[i].value, fadeMax[i], 0.1); reset();
    }
    fadeInp[i].oninput = function () {
        reset();
        if (this.value.length < 4) {
            typeNumberRange(this, 0, fadeMax[i]);
            fadeVal[i] = Math.round((parseFloat(fadeInp[i].value) * 10)) / 10;
        } else { this.value = fadeVal[i] }
    }
}

// -------- Panel: 3;
var addTimer = $('.addNew')[0], newTimer = $('.timer')[0].innerHTML, maxTimer = 10, inc = 0, topLeftSpan = $('.topLeftSpan'), bottomLeftSpan = $('.bottomLeftSpan'), topRightSpan = $('.topRightSpan'), bottomRightSpan = $('.bottomRightSpan'), minuteInp = $('.minute'), timeInp = $('.time');

addTimer.onclick = function () {
    timerChanger();
    if (inc < maxTimer - 1) {
        $('.allTimerParent')[0].innerHTML = $('.allTimerParent')[0].innerHTML + `<div class="timer" style='opacity:0;transform:translateY(3rem);'><div class='timerNo'>${inc + 2}</div>${newTimer}</div>`;
        allHeight[2] += (this.clientHeight * 2) - 23;
        // console.log(allHeight[2]-(this.clientHeight*2)-20)
        $('.downSlide')[2].click();
        setTimeout(function () { $('.timer')[inc].style = 'opacity:.9;transform:translateY(0);' }, 100)
        inc++;
    }
    else {
        this.innerHTML = 'Max Timer Reached';
        this.style = 'padding:1.5rem 0;font-size:1.5rem;'
    }
    timerChanger();
}
var minMax = (min, value, max, step = 0) => {
    min = parseFloat(min); max = parseFloat(max); value = parseFloat(value);
    if (value + step < min) { return max; }
    else if (value + step > max) { return min; }
    else { return Math.round(((Math.round(parseFloat(value) * 100) / 100) + step) * 100) / 100; }
}
function timerChanger() {
    topLeftSpan = $('.topLeftSpan'), bottomLeftSpan = $('.bottomLeftSpan'), topRightSpan = $('.topRightSpan'), bottomRightSpan = $('.bottomRightSpan'), minuteInp = $('.minute'), cycleInp = $('.cycle'), timeInp = $('.time');
    for (let i = 0; i < topLeftSpan.length; i++) {
        rangeScroll(minuteInp[i].parentElement, 0, minuteInp[i], 60, 1, [minuteInp[i], mVal[i]], minuteFocusout, i, reset);
        rangeScroll(cycleInp[i].parentElement, 0, cycleInp[i], parseInt(Math.round(((1 / oneCycle) * 60) * 100) / 100), 1, [cycleInp[i], cVal[i]], cycleFocusout, i, reset); timerPlayNo = i;
        mVal[i] = parseInt(minuteInp[i].value);
        minuteFocusout(i)
        cVal[i] = parseInt(cycleInp[i].value);
        minuteInp[i].setAttribute('value', mVal[i]);
        cycleInp[i].setAttribute('value', cVal[i]);

        topLeftSpan[i].onclick = function () {
            mVal[i] = minMax(0, minuteInp[i].value, 60, 1);
            minuteInp[i].value = mVal[i];
            cycleInp[i].value = (calculateTimer(mVal[i]).tCyc); reset();
        }
        bottomLeftSpan[i].onclick = function () {
            // mVal[i] = parseInt(minuteInp[i].value);
            mVal[i] = minMax(0, minuteInp[i].value, 60, -1);
            minuteInp[i].value = mVal[i];
            cycleInp[i].value = (calculateTimer(mVal[i]).tCyc); reset();
        }
        topRightSpan[i].onclick = function () {
            cVal[i] = minMax(0, cycleInp[i].value, parseInt(Math.round(((1 / oneCycle) * 60) * 100) / 100), 4);
            cycleInp[i].value = cVal[i];
            minuteInp[i].value = (calculateTimer(0, cVal[i]).tMin); reset();
        }
        bottomRightSpan[i].onclick = function () {
            cVal[i] = minMax(0, cycleInp[i].value, parseInt(Math.round(((1 / oneCycle) * 60) * 100) / 100), -4);
            cycleInp[i].value = cVal[i];
            minuteInp[i].value = (calculateTimer(0, cVal[i]).tMin); reset();

        }
        minuteInp[i].oninput = function () {
            if (this.value.length < 3) {
                if (this.value != '') {
                    mVal[i] = parseInt(minuteInp[i].value); minuteFocusout(i);
                    typeNumberRange(minuteInp[i], 0, 60, mVal[i], minuteFocusout, i); reset();
                }
            }
            else { this.value = mVal[i]; }
        }
        cycleInp[i].oninput = function () {
            if (this.value.length < 4) {
                if (this.value != '') {
                    cVal[i] = parseInt(this.value); cycleFocusout(i);
                    typeNumberRange(cycleInp[i], 0, parseInt(Math.round(((1 / oneCycle) * 60) * 100) / 100), cVal[i], cycleFocusout, i); reset();
                }
            }
            else { this.value = parseInt(cVal[i]); }
        }
        $('.playPause')[i].onclick = function () {
            let img = $('.playPause>img')[i];
            if (timerOn == false) {
                timerOn = true;
                img.src = './png/stop.svg'; img.width = '40'; img.height = '40';
                this.style = 'background-color:rgb(101 121 189);';
                bell.play();
                $('.timer')[i].style = 'opacity:1; box-shadow:hsl(0deg 0% 86%) 0px 0px 1.5px, rgb(148 151 209) 0px 0px 2px, inset hsl(236deg 41% 65%) 0px 0px 4px ';
            }
            else if (timerOn == true) {
                timerOn = false;
                img.src = './png/play.png'; img.width = '20'; img.height = '20';
                this.style = 'background-color:rgb(129 134 202);';
                $('.timer')[i].style = 'opacity:8.4; box-shadow:hsl(233deg 38% 67% / 50%) 5px 0px, rgb(138 146 203 / 40%) 10px 0px, hsl(233deg 52% 50% / 7%) 15px 0px';
            }
            timerPlayNo = i;
            for (let x = 0; x < topLeftSpan.length; x++) {
                if (x != timerPlayNo && topLeftSpan.length > 0) {
                    let img = $('.playPause>img')[x];
                    img.src = './png/play.png'; img.width = '20'; img.height = '20';
                    $('.playPause')[x].style = 'background-color:rgb(129 134 202);';
                    $('.timer')[x].style = 'opacity:8.4; box-shadow:none;';
                }
            }
            moniterChild.click();
        }
    }
}
var minuteFocusout = (index) => { cycleInp[index].value = (calculateTimer(minuteInp[index].value).tCyc); mVal[index] = parseInt(minuteInp[index].value); }
var cycleFocusout = (index) => { minuteInp[index].value = (calculateTimer(0, cycleInp[index].value).tMin); cVal[index] = parseInt(cycleInp[index].value); }

timerChanger();
function calculateTimer(min = 0, cyc = 0) {
    var cycInSec = 0; min = parseInt(min); cyc = parseInt(cyc);
    for (let i of breath) { cycInSec += i; }
    oneCycle = (Math.round((cycInSec / 60) * 1000) / 1000);
    return {
        tMin: Math.round(oneCycle * cyc),
        tCyc: parseInt(Math.round(((1 / oneCycle) * min) * 100) / 100)
    }
}
calculateTimer();
