$('.slide').hide();
$('.slide0').fadeIn();
let intervalId;
let loadingIntervalId;
let loadingIsPaused = false;
let bufferedEnd = 0;
const cues = [0.0, 0.4, 1.7, 3.9, 7.92, 9.8, 11.6, 13.8, 15.68, 17.87]
let currentCueIndex = 0;
const myPlayer = videojs('myPlayer', {
    controls: false,
    autoplay: true,
    preload: 'auto',
    muted: true,
});
let timeout;

//<editor-fold desc=" - window resize ">
window.addEventListener('resize', function () {
    clearTimeout(timeout);
    timeout = setTimeout(function () {
        changeSize();

    }, 500);
});
changeSize();

function changeSize() {
    if (window.innerWidth / window.innerHeight <= 470 / 625) {
        if (myPlayer.src() !== 'assets/media/Mobile.mp4') {
            myPlayer.src({type: 'video/mp4', src: 'assets/media/Mobile.mp4'});
            goto(currentCueIndex - 1)
        }
    } else {
        if (myPlayer.src() !== 'assets/media/Desktop.mp4') {
            myPlayer.src({type: 'video/mp4', src: 'assets/media/Desktop.mp4'});
            goto(currentCueIndex - 1)
        }
    }
}


//</editor-fold>

//<editor-fold desc=" - Player Events:">

myPlayer.on('ready', () => {
    console.log('asd', myPlayer);
    // myPlayer.currentTime(2)
    myPlayer.play();

    loadingIntervalId = setInterval(() => {
        console.log('bufferedEnd', bufferedEnd);
        console.log('buffered%', myPlayer.bufferedPercent());
        if (bufferedEnd !== myPlayer.bufferedEnd()) {
            bufferedEnd = myPlayer.bufferedEnd();
            loadingIsPaused = false
        } else {
            loadingIsPaused = true;
        }
        console.log('loadingIsPaused%', loadingIsPaused);
        $('.preloader')[0].style.width = myPlayer.bufferedPercent() * 100 + '%';
        if (myPlayer.bufferedPercent() === 1)
            clearInterval(loadingIntervalId)
    }, 300)
});

myPlayer.on('play', () => {
    intervalId = setInterval(() => {
        // console.log('currentTime', myPlayer.currentTime());
        if (myPlayer.remainingTime === 0)
            clearInterval(intervalId);

        const found = cues.findIndex((v) => {
            // console.log('currentTime', Math.round(myPlayer.currentTime() - v) < 1 );
            return Math.round(myPlayer.currentTime() * 100) - Math.round(v * 100) === 0;
        });
        currentCueIndex = found;
        if (cues[found]) {
            console.log('currentTime', myPlayer.currentTime());
            myPlayer.pause();
        }
    })
});

myPlayer.on('pause', () => {
    clearInterval(intervalId);

});

myPlayer.on('click', () => {
    console.log('bufferedEnd()', myPlayer.bufferedEnd())
    console.log('bufferedEnd() > cues[currentCueIndex]', currentCueIndex, myPlayer.bufferedEnd(), cues[currentCueIndex], myPlayer.bufferedEnd() > cues[currentCueIndex])
    if (myPlayer.paused() && currentCueIndex !== -1 && myPlayer.bufferedEnd() > cues[currentCueIndex]) {
        goto(currentCueIndex);
    }
});

myPlayer.on('bufferedEnd', () => {
    console.log('----------------------')
});


//</editor-fold>

//<editor-fold desc=" - goto:">
function goto(index) {
    console.log('bufferedEnd()', myPlayer.bufferedEnd())
    console.log('bufferedEnd() > cues[currentCueIndex]', index, myPlayer.bufferedEnd(), cues[index], myPlayer.bufferedEnd() > cues[index])

    if (myPlayer.bufferedEnd() < cues[index + 1]) {
        console.log('loadingIsPaused', loadingIsPaused)
        if (loadingIsPaused === false)
            return
    }
    if (index === -1) index = 0;
    // console.log('dd:',index , (index * 100 / cues.length  ) )
    $('.circle')[0].style.left = (index * 100 / 9) + '%';
    $('.progress')[0].style.width = (index * 100 / 9) + '%';
    myPlayer.currentTime(cues[index] + 0.1)
    myPlayer.play();

    const slide = $('.slide')
    slide.fadeOut();
    slide.removeClass('current');

    $('.slide' + index).addClass('current');
    setTimeout(() => {
        $('.slide' + index).fadeIn();
    }, 500)

    setTimeout(() => {
        $('.header')[0].innerText = $('.slide' + index + ' h1')[0].innerText;
    }, 30)


    $('.my-slider button').each(function (i) {
        if (i <= index) {
            this.classList.add('past')
        } else {
            this.classList.remove('past')
        }
    })


}

//</editor-fold>

