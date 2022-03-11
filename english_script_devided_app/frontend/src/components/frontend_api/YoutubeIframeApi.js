

var tag = document.createElement('script');

tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
// 上記でloads the IFrame Player API code


var player;
const onYouTubeIframeAPIReady = () => {
  console.log("called onYouTubeIframeAPIReady in YoutubeIframeApi,js")
  player = new YT.Player('player', {
    height: '400',
    width: '560',
    videoId: '',
    events: {
      'onReady': onPlayerReady,
      'onStateChange': onPlayerStateChange
    }
  });
}

function onPlayerReady(event){
  event.target.playVideo();
}

// const onPlayerReady = (event) => {
//   event.target.playVideo();
// }

var done = false;
// const onPlayerStateChange = (event) => {
//   if (event.data == YT.PlayerState.PLAYING && !done) {
//     setTimeout(stopVideo, 6000);
//     done = true;
//   }
// }

function onPlayerStateChange(event) {
  if (event.data == YT.PlayerState.PLAYING && !done) {
    setTimeout(stopVideo, 6000);
    done = true;
  }
}

function stopVideo(){
  player.stopVideo();
}
// const stopVideo = () => {
//  
// }

// export const seekVideo = () => {
//   // player.seekTo(seconds:Number, allowSeekAhead:Boolean):Void
//   player.seekTo(17, true)
// }
export function seekVideo(startTime){
  // player.seekTo(seconds:Number, allowSeekAhead:Boolean):Void
  player.seekTo(startTime, true)
}

// export const loadVideo = (v) => {
//   player.loadVideoById(v);
// }
export function loadVideo (v) {
  console.log("called loadVideo")
  console.log(v,"v")
  console.log(player, "player")
  player.loadVideoById(v);
}

export default onYouTubeIframeAPIReady;
