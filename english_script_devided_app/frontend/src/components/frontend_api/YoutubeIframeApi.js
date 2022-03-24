

var tag = document.createElement('script');

tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
// 上記でloads the IFrame Player API code


var player;
const onYouTubeIframeAPIReady = () => {
  player = new YT.Player('player', {
    height: '100%',
    width:'100%',
    videoId: 'UNqcqAhpJdY',
    events: {
      'onReady': onPlayerReady,
      'onStateChange': onPlayerStateChange
    }
  });
}

function onPlayerReady(event){
  event.target.playVideo();
  player.stopVideo(); 
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

export function seekVideo(startTime){
  // player.seekTo(seconds:Number, allowSeekAhead:Boolean):Void
  player.seekTo(startTime, true)
}

export function loadVideo (v) {
  player.loadVideoById(v);
  player.stopVideo();
}

export default onYouTubeIframeAPIReady;
