
    $('.slide').hide();
    $('.slide0').fadeIn();
    let intervalId;
    const cues = [0.0, 0.4, 1.7, 3.9, 7.92, 9.8, 11.6, 13.8, 15.68, 17.87]
    let currentCueIndex = 0;
    const myPlayer = videojs('myPlayer', {
        controls: false,
        autoplay: true,
        preload: 'auto',
        muted: true,


    });
    myPlayer.src({type: 'video/mp4', src: 'assets/media/Desktop.mp4'});

    myPlayer.on('ready', () => {
        console.log('asd', myPlayer);
        // myPlayer.currentTime(2)
        myPlayer.play();
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
        if (myPlayer.paused()) {
         goto(currentCueIndex );
        }
    });


    function goto(index) {
        // console.log('dd:',index , (index * 100 / cues.length  ) )
        $('.circle')[0].style.left = (index * 100 / 9) + '%';
        $('.progress')[0].style.width = (index * 100 / 9) + '%';
        myPlayer.currentTime(cues[index] + 0.1)
        myPlayer.play();

        $('.slide').fadeOut();
        $('.slide').removeClass('current');

        $('.slide' + index).addClass('current');
        setTimeout(() => {
            $('.slide' + index).fadeIn();
        }, 500)

        $('.header')[0].innerText = $('.slide' + index + ' h1')[0].innerText

        $('.my-slider button').each(function (i) {
            if (i <= index) {
                this.classList.add('past')
            } else {
                this.classList.remove('past')
            }
        })


    }

