import { createContext, useContext, useState, useEffect } from "react";
import React from 'react';

var tag = document.createElement('script');

tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
// 上記でloads the IFrame Player API code


let player;

export const YoutubeIframeApiContext = createContext({});

export const useYoutubeIframeApiContext = () => {
  return useContext(YoutubeIframeApiContext);
};

export const YoutubeIframeApiContextProvider = ({ children }) => {
  const [currentTime, setCurrentTime] = useState(0);


  const onYouTubeIframeAPIReady = () => {
    player = new YT.Player('player', {
      height: '100%',
      width: '100%',
      videoId: 'gp57PcA7YVQ',
      events: {
        // 'onReady': onPlayerReady,
        'onStateChange': onPlayerStateChange
      }
    });
  }

  const onPlayerReady = (event) => {
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
  
  // event.data = -1,3-1,5
  // YT.PlayerState.PLAYING = 1
  const onPlayerStateChange = (event) => {
    // player.playerInfo.curerentTimeだと取得できない
    let get = getCurrentTime();
    if (event.data == YT.PlayerState.PLAYING && done) {
      setCurrentTime(get);
    }
    // 初回だけ通さない
    done = true;
    
  }


  
  const getCurrentTime = () => {
    let time = player.getCurrentTime()
    return time;
  }



// export const onPlayerStateChange = (event) => {
//   console.log("onPlayerStateChange start") 
//   console.log(transcription_list, 'transcription_list');
//   if (transcription_list.length != 0) {
//     console.log(transcription_list, 'transcription_list in onPlayerStateChange');
//     // playerの状態が変わった瞬間にどこにスクロールするべきかを二分探索で求める
//     let index = binarySearch(transcription_list, player.playerInfo.currentTime);
//     // スクロール発火
//     YoutubePage.handleClickToScroll(index);
//     // 状態が変わるまで，もしくは，transcription_list最後まで１行スクロールを繰り返す
//     let interval = transcription_list[index].start - player.playerInfo.currentTime;
//     console.log(transcription_list[index].start, 'transcription_list[index].start');
//     console.log(player.playerInfo.currentTime, 'player.playerInfo.currentTime');
//     console.log(interval, 'interval');
//     while (index < transcription_list.length) {
//       setTimeout(YoutubePage.handleClickToScroll(index), interval)
//       interval = transcription_list[index].duration;
//       index += 1;
//     }
//   }
// }

  const stopVideo = () => {
    player.stopVideo();
  }

  const seekVideo = (startTime) => {
    // player.seekTo(seconds:Number, allowSeekAhead:Boolean):Void
    player.seekTo(startTime, true)
  }

  const loadVideo = (v) => {
    player.loadVideoById(v);
    player.stopVideo();
  }

  const contextValue = {
    onYouTubeIframeAPIReady,
    onPlayerStateChange,
    seekVideo,
    loadVideo,
    currentTime
  };
  return (
    <YoutubeIframeApiContext.Provider value={contextValue}>
      {children}
    </YoutubeIframeApiContext.Provider>
  );
}