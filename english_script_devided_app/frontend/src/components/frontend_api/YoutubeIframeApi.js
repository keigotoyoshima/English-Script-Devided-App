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
  const [currentTime, setCurrentTime] = useState(-1);


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


  var count = 0;

  // event.data = -1,3-1,5
  // YT.PlayerState.PLAYING = 1
  const onPlayerStateChange = (event) => {
    // player.playerInfo.curerentTimeだと取得できない
    let get = getCurrentTime();
    if (event.data == YT.PlayerState.PLAYING  && count > 2) {
      setCurrentTime(get);
    }
    // 最初の2回分だけ通さない
    count++;
  }


  const getCurrentTime = () => {
    let time = player.getCurrentTime()
    return time;
  }


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