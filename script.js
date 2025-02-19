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

async function main() {
  // get list of all song
  let songs = await getSong();
  // console.log(songs);
  let songUL = document.querySelector(".songList").getElementsByTagName("ul")[0]
  for (const song of songs) {
    songUL.innerHTML = songUL.innerHTML + `<li class="songLi">
                    <img src="./public/images/music.svg" alt="" class="flex invert ">
                    <div class="info text-sm w-full cursor-pointer">
                      <div class="ml-2"> ${song.replaceAll("%20", " ")}</div>
                      <div class="ml-2"> Artist Name</div>
                    </div>
                    <div class="playnow flex  text-base justify-center items-center w-full">
                        <span class="text-[12px]">play now</span>  
                        <img src="./public/images/play.svg" alt="" class="src invert ml-2 m-1 ">
                    </div></li>`;
}
  // play audio
  var audio = new Audio(songs[0]);
   audio.play();
  console.log("hitme");

  audio.addEventListener("ontimeupdate", () => {
    //let duration = audio.duration;
    console.log(audio.duration, audio.currentSrc, audio.currentTime);
    console.log("duration");
  });
  // the duration variable now holds the duration (in seconds) of the audio clip

}

main();
