// VideoPlayerScreen.js

import React from 'react';
import VideoPlayer from '../../components/VideoPlayer';  
import Chat from '../../components/Chat'; 

const VideoPlayerScreen = () => {
  return (
    <div className="video-player-screen">
      <VideoPlayer />
      <Chat />
    </div>
  );
};

export default VideoPlayerScreen;

