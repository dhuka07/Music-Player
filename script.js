let currentSong = new Audio();
let songs;
function secondsToMinutesSeconds(seconds) {
  if (isNaN(seconds) || seconds < 0) {
    return "00:00";
  }

  const mins = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);

  const formatMins = String(mins).padStart(2, "0");
  const formatSec = String(remainingSeconds).padStart(2, "0");

  return `${formatMins}:${formatSec}`;
}

async function getSong() {
  let response = await fetch("http://127.0.0.1:3000/public/songs/");
  let data = await response.text();
  // console.log(data);
  let div = document.createElement("div");
  div.innerHTML = data;
  let as = div.getElementsByTagName("a");

  let songs = [];
  for (let index = 0; index < as.length; index++) {
    const element = as[index];
    if (element.href.endsWith(".mp3")) {
      songs.push(element.href.split("/songs/")[1]);
    }
  }

  console.log(songs);
  return songs;
}

const playMusic = (track, pause = false) => {
  // let audio = new Audio("public/songs/" + track);
  currentSong.src = "public/songs/" + track;
  if (!pause) {
    currentSong.play();
    play.src = "public/images/pause.svg";
  }
  document.querySelector(".songinfo").innerHTML = decodeURI(track);
  document.querySelector(".songtime").innerHTML = "00:00 / 00:00";
};

async function main() {
  // get list of all song
   songs = await getSong();
  // console.log(songs);
  playMusic(songs[0], true);

  let songUL = document
    .querySelector(".songList")
    .getElementsByTagName("ul")[0];
  for (const song of songs) {
    songUL.innerHTML =
      songUL.innerHTML +
      `<li class="songLi">
                    <img src="./public/images/music.svg" alt="" class="flex invert ">
                    <div class="info text-sm w-full">
                      <div class="ml-2"> ${song.replaceAll("%20", " ")}</div>
                      <div class="ml-2"> Artist Name</div>
                    </div>
                    <div class="playnow flex  text-base justify-center items-center w-full">
                        <span class="text-[12px]">play now</span>  
                        <img src="./public/images/play.svg" alt="" class="src invert cursor-pointer ml-2 m-1 ">
                    </div></li>`;
  }

  Array.from(
    document.querySelector(".songList").getElementsByTagName("li")
  ).forEach((e) => {
    e.addEventListener("click", (element) => {
      console.log(e.querySelector(".info").firstElementChild.innerHTML);
      playMusic(e.querySelector(".info").firstElementChild.innerHTML.trim());
    });
  });

  // play audio
  // var audio = new Audio(songs[0]);
  //  audio.play();
  // console.log("hitme");

  // audio.addEventListener("ontimeupdate", () => {
  //   //let duration = audio.duration;
  //   console.log(audio.duration, audio.currentSrc, audio.currentTime);
  //   console.log("duration");
  // });
  // the duration variable now holds the duration (in seconds) of the audio clip

  // Attach Event Listner to play next and previous
  play.addEventListener("click", () => {
    if (currentSong.paused) {
      currentSong.play();
      play.src = "public/images/pause.svg";
    } else {
      currentSong.pause();
      play.src = "public/images/play.svg";
    }
  });

  // Listen for time update
  currentSong.addEventListener("timeupdate", () => {
    console.log(currentSong.currentTime, currentSong.duration);
    document.querySelector(".songtime").innerHTML = `${secondsToMinutesSeconds(
      currentSong.currentTime
    )} / ${secondsToMinutesSeconds(currentSong.duration)}`;

    // seekbar
    document.querySelector(".circle").style.left =
      (currentSong.currentTime / currentSong.duration) * 99 + "%";
  });

  // add event listner to seek bar
  document.querySelector(".seekbar").addEventListener("click", (e) => {
    // console.log(e.target.getBoundingClientRect(),e.offsetX)
    let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
    document.querySelector(".circle").style.left =
      (e.offsetX / e.target.getBoundingClientRect().width) * 100 + "%";
    currentSong.currentTime = (currentSong.duration * percent) / 100;
  });

  // add eeventListner to open menu
  document.querySelector(".hamburger").addEventListener("click", () => {
    document.querySelector(".left").style.left = "0%";
  });

  // add event listner to close menu
  document.querySelector(".close").addEventListener("click", () => {
    document.querySelector(".left").style.left = "-130%";
    document.querySelector(".left").style.transition = "all .3s";
  });

  // add event listner to previous and Next
  previous.addEventListener("click", () => {
    console.log("previous clicked");
    let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0]);
    console.log(`SOngs : ${songs}, Index: ${index}`);
    if((index-1) >= 0){
    playMusic(songs[index-1])
    }
  });

  next.addEventListener("click", () => {
    let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0]);
    console.log(`SOngs : ${songs}, Index: ${index}`);
    if((index+1) < songs.length){
    playMusic(songs[index+1])
    }
  });
}

main();
