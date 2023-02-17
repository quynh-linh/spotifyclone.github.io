const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document); 
// Header
let header = $('header');
//
header.style.justifyContent = 'end';
// Control
const name_song = $('.name-music');
const author_song = $('.author-music');
const img_song = $('.info-music img');
const audio_song = $('.audio-music');
let progress = $('.line-music');
let progressVolume = $('.line-volume');
let play_song = $('.fa-play');
let table_list = $('#tbody-table');
let next_song = $('.fa-forward-step');
let prev_song = $('.fa-backward-step');
let list_song = table_list.children;
let icon_shuffle = $('.fa-shuffle');
let icon_repeat = $('.fa-repeat');
let time_songs = $('.time-music-end');
let step_song = $('.time-music-start');
const PLAYER_STORAGE_KEY = 'player';
//
let choose_like = $('.choose-like');
const app = {
    currentIndex : 0,
    isPlaying : false,
    isRandom : false,
    isRepeat : false,
    isConfig : false,
    config : JSON.parse(localStorage.getItem(PLAYER_STORAGE_KEY)) || {},
    setConfig : function(key,value){
        this.config[key] = value;
        localStorage.setItem(PLAYER_STORAGE_KEY,JSON.stringify(this.config));
    },  
    songs: [
        {
            id : 1,
            author : 'Sơn Tùng MTP',
            name : 'Intro',
            path : './assets/music/song1.mp3',
            image : './assets/image/song1.jpg'
        },
        {
            id : 2,
            author : 'Sơn Tùng MTP',
            name : 'Cơn mưa xa dần',
            path : './assets/music/song2.mp3',
            image : './assets/image/song2.jpg'
        },
        {
            id : 3,
            author : 'Sơn Tùng MTP',
            name : 'Nắng ấm ngang qua',
            path : './assets/music/song3.mp3',
            image : './assets/image/song3.jpg'
        }
        ,
        {
            id : 4,
            author : 'Sơn Tùng MTP',
            name : 'Muộn rồi mà sao còn',
            path : './assets/music/song4.mp3',
            image : './assets/image/song4.jpg'
        },
        {
            id : 5,
            author : 'Sơn Tùng MTP',
            name : 'Hãy trao cho anh',
            path : './assets/music/song5.mp3',
            image : './assets/image/song5.jpg'
        }
        ,
        {
            id : 6,
            author : 'Sơn Tùng MTP',
            name : 'Em của ngày hôm qua',
            path : './assets/music/song6.mp3',
            image : './assets/image/song6.jpg'
        },
        {
            id : 7,
            author : 'Sơn Tùng MTP',
            name : 'Âm thầm bên em',
            path : './assets/music/song7.mp3',
            image : './assets/image/song7.jpg'
        },
        {
            id : 8,
            author : 'Sơn Tùng MTP',
            name : 'Thái Bình Mồ Hôi Rơi',
            path : './assets/music/song8.mp3',
            image : './assets/image/song8.jpg'
        }
    ],
    render : function(){
        const html = this.songs.map(song => {
            return `
            <tr class="row-table">
                <td>${song.id}</td>
                <td>
                    <div class="list-album-song">
                        <img class="list-album-song-img" src="${song.image}" alt="">
                        <div class="list-album-song-info"  >
                            <div class="list-album-song-info-name">${song.name}</div>
                            <div class="list-album-song-info-author">${song.author}</div>
                        </div>
                    </div>
                </td>
                <td>Sky Tour</td>
                <td>10 hours ago</td>
                <td>4:15</td>
            </tr>
            `; 
        });
        $('.list-album table tbody').innerHTML = html.join('');
    },
    handleEvents : function(){
        const _this = this;
        document.onscroll = function(){       
            // handle when scrolling
            let header_Title = $('.header-title');
            if(window.scrollY > 150){
                header.style.backgroundColor = 'rgba(10,10,10)';
                header_Title.style.display = 'block';
                header.style.justifyContent = 'space-between';
            }else{
                header.style.justifyContent = 'end';
                header.style.backgroundColor = 'rgba(10,10,10,0.6)';
                header_Title.style.display = 'none';
            }
        };
        // handle when user hovers add song to favorite song
        choose_like.onmouseover = function(){
            this.innerHTML = '<i class="fa-solid fa-heart"></i>';
            $('.choose-like i').classList.add('icon-heart');
        };
        choose_like.onmouseleave = function(){
            this.innerHTML = '<i class="fa-regular fa-heart"></i>';
            $('.choose-like i').classList.remove('icon-heart');
        };
        // handling when clicking play song
        play_song.onclick = function(){     
            if(_this.isPlaying){
                audio_song.pause();
            }else{
                audio_song.play();
            }
        }
        // when playing onPlay()
        audio_song.onplay = function(){
            _this.isPlaying = true;
            play_song.classList.add('fa-pause');
            play_song.classList.remove('fa-play');
            _this.chooseSongs();
        }
        // when user press stop song
        audio_song.onpause = function(){
            _this.isPlaying = false;
            _this.isConfig = true;
            play_song.classList.remove('fa-pause');
            play_song.classList.add('fa-play');
            // set conFig
            _this.chooseSongs();
            for (const key in _this.songs) {
                if (_this.songs.hasOwnProperty(key)) {
                    const temp = _this.songs[key].id;
                    if(_this.currentSong.id === temp){
                        _this.setConfig('name',_this.songs[key].name);
                        _this.setConfig('author',_this.songs[key].author);
                        _this.setConfig('img_song',_this.songs[key].image);
                        _this.setConfig('path',_this.songs[key].path);
                        _this.setConfig('id_song',_this.songs[key].id);
                        _this.setConfig('isConfig',_this.isConfig);
                        _this.setConfig('currentTimeSong',audio_song.currentTime);
                    }
                }
            }
        }
        // when the tempo of the music door changes
        audio_song.ontimeupdate = function(){
            if(audio_song.duration){
                progress.value =  Math.floor((audio_song.currentTime/audio_song.duration)*100);
                step_song.textContent = _this.getMinutesSong(progress.value);
                time_songs.textContent = _this.setMinutesSong();
            }
        }
        // handle when seek
        progress.oninput = function(e){
            const progressPerson = e.target.value;
            const seekTime = (progressPerson/100) * audio_song.duration;
            audio_song.currentTime = seekTime;
            step_song.textContent = _this.getMinutesSong();
        }
        // handle the loudness of the sound
        progressVolume.onchange = function(e){
            const progressPersonVolume = e.target.value;
            audio_song.volume = progressPersonVolume;
            _this.setConfig('volume',progressPersonVolume);
        }
        // handling when user clicks next song
        next_song.onclick = function(){
            if(_this.isRandom){
                _this.playingRanDomSongs();
            } else {
                _this.nextSong();
            }
            audio_song.play();
        }
        // handle when user clicks prev song
        prev_song.onclick = function(){
            if(_this.isRandom){
                _this.playingRanDomSongs();
            } else {
                _this.prevSong();
            }
            audio_song.play();
        }
        // handle random() songs
        icon_shuffle.onclick = function(){
            _this.isRandom = !_this.isRandom;
            _this.setConfig('isRandom',_this.isRandom);
            this.classList.toggle('active-repeat',_this.isRandom);
        };
        // handle button repeat
        icon_repeat.onclick = function(){
            _this.isRepeat =!_this.isRepeat;       
            _this.setConfig('isRepeat',_this.isRepeat);
            this.classList.toggle('active-repeat',_this.isRepeat);
        }
        // handle when the song ends
        audio_song.onended = function(){
            if(_this.isRepeat){
                audio_song.play();
            } else {
                next_song.click();
            }
        };
    },
    setMinutesSong : function(){
        const time = audio_song.duration;
        const minutes = Math.floor(time % 3600 / 60).toString().padStart(2,'0');
        const seconds = Math.floor(time % 60).toString().padStart(2,'0');
        return finalTime = minutes + ':' + seconds;
    },
    getMinutesSong : function(){
        const time = audio_song.currentTime;
        const minutes = Math.floor(time % 3600 / 60).toString().padStart(2,'0');
        const seconds = Math.floor(time % 60).toString().padStart(2,'0');
        return finalTime = minutes + ':' + seconds;
    },
    defineProperties: function(){
        Object.defineProperty(this, 'currentSong',{
            get : function(){
                return this.songs[this.currentIndex];
            }
        });
    },
    chooseSongs : function(){
        let _this = this;
        for (const index in list_song) {
            if(list_song.hasOwnProperty(index)){
                // check condition
                // 1.Music must be played
                // 2. The id of the song must === with the id of the playlist containing the song
                if (this.isPlaying && this.currentSong.id === Number.parseInt(list_song[index].children[0].textContent) ) {
                    list_song[index].children[0].innerHTML = '<img class="image-gif" src="./assets/image/Nt6v.gif" alt="">'
                    list_song[index].onmouseover = function(){
                        this.style.backgroundColor = "rgb(124 124 124)";
                        this.children[0].onmouseover = function(){
                            this.innerHTML = '<i style="padding: 5px; cursor: pointer; color: white;" class="fa-solid fa-pause"></i>'
                            this.style.cursor = 'pointer';
                            this.onclick = function(){
                                audio_song.pause();
                            }
                        }
                        this.children[0].onmouseleave = function(){
                            this.innerHTML = '<img class="image-gif" src="./assets/image/Nt6v.gif" alt="">'
                        }
                    }
                    list_song[index].onmouseleave = function(){
                        this.children[0].innerHTML = '<img class="image-gif" src="./assets/image/Nt6v.gif" alt="">';
                        this.style.backgroundColor = "#222121";
                    }
                } else {
                    list_song[index].children[0].innerHTML = `<td>${Number.parseInt(index) + 1}</td>`;
                    list_song[index].onmouseover = function(){
                        this.style.backgroundColor = "rgb(124 124 124)";
                        this.children[0].innerHTML = '<i class="fa-solid fa-play"></i>';
                        this.children[0].classList.add('list-id-song');
                        this.children[0].onclick = function(){
                            _this.currentIndex = Number.parseInt(index);
                            _this.currentSong.id = Number.parseInt(index) +1;
                            _this.loadCurrentSong();
                            audio_song.play();
                            return _this.chooseSongs();
                        }
                    }
                    list_song[index].onmouseleave = function(){
                        this.children[0].classList.remove('list-id-song');
                        this.children[0].innerHTML = Number.parseInt(index) + 1;
                        this.style.backgroundColor = "#222121";
                    }
                }
            }
        }
    },
    loadCurrentSong: function(){    
        name_song.textContent = this.currentSong.name;
        author_song.textContent = this.currentSong.author;
        img_song.src = this.currentSong.image;
        audio_song.src = this.currentSong.path;
    },
    loadConfigSong : function(){
        this.isRandom = this.config.isRandom;
        this.isRepeat = this.config.isRepeat;
        name_song.textContent = this.config.name;
        author_song.textContent = this.config.author;
        img_song.src = this.config.img_song;
        audio_song.src = this.config.path;
        progressVolume.value = this.config.volume;
        this.currentSong.id = this.config.id_song;
        audio_song.currentTime = this.config.currentTimeSong;
    },
    loadConfig : function(){
        if(this.config.isRandom === true){
            this.isRandom = this.config.isRandom;
           
        } else {
            this.isRandom = false;
        }
        if(this.config.isRepeat === true){
            this.isRepeat = this.config.isRepeat;
        } else {
            this.isRepeat = false;
        }
        icon_shuffle.classList.toggle('active-repeat',this.isRandom);
        icon_repeat.classList.toggle('active-repeat',this.isRepeat);
    },
    scrollSideBar : function(){
        const sideBarItems = $$('.sideBar-item');
        sideBarItems.forEach(function(sideBar){
            sideBar.onclick = function(){
                $('.sideBar-item.active').classList.remove('active');
                sideBar.classList.add('active');
            };
        })
    },
    nextSong : function(){
        this.currentIndex++;
        if(this.currentIndex >= this.songs.length){
            this.currentIndex = 0;
        }
        this.loadCurrentSong();  
    },
    prevSong : function(){
        this.currentIndex--;
        if(this.currentIndex < 0){
            this.currentIndex = this.songs.length - 1;
        }
        this.loadCurrentSong();
    },
    playingRanDomSongs : function(){
        let newIndex;
        do{
            newIndex = Math.floor(Math.random() * this.songs.length);
        } while(newIndex === this.currentIndex);
        this.currentIndex = newIndex;
        this.loadCurrentSong();
    },
    start : function(){
        // get out playlist
        this.render();
        // define methods for Object
        this.defineProperties();
        // listen and handle events
        this.handleEvents();
        // get the playlist load the playlist
        this.loadCurrentSong();
        this.loadConfig();
        if(this.config.isConfig){
            // load config out
            this.loadConfigSong();
        } 
        this.chooseSongs();
        // scroll sideBar
        this.scrollSideBar();
    }
};
app.start();

