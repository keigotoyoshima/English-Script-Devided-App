import { createContext, useContext, useState, useEffect } from "react";
import React from 'react';

var tag = document.createElement('script');

tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
// 上記でloads the IFrame Player API code


var player;

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
      videoId: 'UNqcqAhpJdY',
      events: {
        'onReady': onPlayerReady,
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
  
  // event.data = 1-,3-1,5
  // YT.PlayerState.PLAYING = 1
  const onPlayerStateChange = (event) => {
    console.log("called onPlayerStateChange")
    if (event.data == YT.PlayerState.PLAYING && done) {
      // setTimeout(stopVideo, 6000);
      setCurrentTime(player.playerInfo.currentTime);
      console.log(player.playerInfo.currentTime, 'player.playerInfo.currentTime');
    }
    // 初回だけ通さない
    done = true;
    
    // console.log("start onPlayerStateChange")
    // console.log(event.data, 'event.data');
    // if (event.data) {
    //   console.log(event.data, 'event.data');
    // }

    
  }

  const stopVideo = () => {
    player.stopVideo();
  }

  const seekVideo = (startTime) => {
    console.log(player.playerInfo.currentTime, 'player.playerInfo.currentTime');
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