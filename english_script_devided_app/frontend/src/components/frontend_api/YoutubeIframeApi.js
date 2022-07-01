import { createContext, useContext, useState, useEffect } from "react";
import React from 'react';

// IFrame Player API の読み込み
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
        'onReady': onPlayerReady,
        'onStateChange': onPlayerStateChange,
        'onError': onPlayerError,
      }
    });
  }

  const onPlayerError = () => {
    console.log("Error happens in onYouTubeIframeAPIReady")
  }

  function onPlayerReady(event) {
    var lastTime = -1;
    var interval = 100;
    // 0.5秒ごとに動画時間の差分をチェックし，差分が1秒以上あれば，字幕移動をトリガーする．
    var checkPlayerTime = function () {
      if (lastTime != -1) {
        var t = player.getCurrentTime();
        // console.log(t, 't');
        // if (Math.abs(t - lastTime) >= 1.0) {
        //   setCurrentTime(t);
        // }
        setCurrentTime(t);
      }
      lastTime = player.getCurrentTime();
      setTimeout(checkPlayerTime, interval); /// repeat function call in 1 second
    }
    setTimeout(checkPlayerTime, interval); /// initial call delayed 
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