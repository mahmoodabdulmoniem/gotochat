// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

import React, { useEffect, useRef } from 'react';
import { ChatManager, Role, LogLevel } from 'amazon-ivs-chat';
import { PlayerState, PlayerEventType } from 'amazon-ivs-player';

// Styles
import './VideoPlayer.css';

const VideoPlayer = ({
  usernameRaisedHand,
  showRaiseHandPopup,
}) => {
  const videoRef = useRef(null);

  useEffect(() => {
    const MediaPlayerPackage = window.IVSPlayer;

    if (!MediaPlayerPackage.isPlayerSupported) {
      console.warn('The current browser does not support the Amazon IVS player.');
      return;
    }

    const player = MediaPlayerPackage.create();
    player.attachHTMLVideoElement(videoRef.current);

    const chatManager = new ChatManager();

    // Event listeners for player
    player.addEventListener(PlayerState.PLAYING, () => {
      console.info('Player State - PLAYING');
      // Initialize chat when the video starts playing
      initializeChat(player);
    });

    player.addEventListener(PlayerState.ENDED, () => {
      console.info('Player State - ENDED');
    });

    player.addEventListener(PlayerState.READY, () => {
      console.info('Player State - READY');
    });

    player.addEventListener(PlayerEventType.ERROR, (err) => {
      console.warn('Player Event - ERROR:', err);
    });

    // Setup stream and play
    player.setAutoplay(true);
    player.load('https://dcbf5d514f39.us-east-1.playback.live-video.net/api/video/v1/us-east-1.642077570081.channel.UHQXzILN6IFJ.m3u8');
    player.setVolume(0.5);

    return () => {
      // Cleanup code when component unmounts
      player.detachHTMLVideoElement();
      chatManager.leaveRoom();
    };
  }, []); // eslint-disable-line

  const initializeChat = async (player) => {
    try {
      const channelArn = 'arn:aws:ivs:us-east-1:642077570081:channel/UHQXzILN6IFJ';
      const streamKey = 'sk_us-east-1_Ba9DNfzMYMXy_0N5fPMjmThFxChQzyWoAbSt5TVnNOh';

      await chatManager.connect(
        player,
        channelArn,
        'foobar123', // Replace with the username of the viewer
        Role.VIEWER
      );

      // Optional: Add event listeners or custom chat logic here
      chatManager.addEventListener(LogLevel.INFO, (log) => {
        console.log(log);
      });

      chatManager.addEventListener(LogLevel.ERROR, (log) => {
        console.error(log);
      });
    } catch (error) {
      console.error('Error initializing chat:', error);
    }
  };

  return (
    <>
      <div className='player-wrapper'>
        <div className='aspect-169 pos-relative full-width full-height'>
          <video
            ref={videoRef}
            id='video-player'
            className='video-elem pos-absolute full-width'
            playsInline
            muted
          ></video>
          <div className='player-overlay pos-absolute'>
            {showRaiseHandPopup ? (
              <div className='overlay-raise-hand'>
                <div className='overlay-raise-hand-icon'>
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    viewBox='0 0 24 24'
                    fill='currentColor'
                  >
                    <path d='M12.775 24q-1.825 0-3.337-.688-1.513-.687-2.613-1.824-1.1-1.138-1.712-2.638-.613-1.5-.613-3.1v-10q0-.525.363-.888.362-.362.887-.362t.888.362Q7 5.225 7 5.75v5.75q0 .2.15.35.15.15.35.15.2 0 .35-.15.15-.15.15-.35V2.75q0-.525.363-.888.362-.362.887-.362t.887.362q.363.363.363.888v7.75q0 .2.15.35.15.15.35.15.2 0 .35-.15.15-.15.15-.35V1.25q0-.525.363-.888Q12.225 0 12.75 0t.887.362Q14 .725 14 1.25v9.25q0 .2.15.35.15.15.35.15.2 0 .35-.15.15-.15.15-.35V3.25q0-.525.363-.888Q15.725 2 16.25 2t.888.363q.362.362.362.887v10.775q-1.4.2-2.325 1.138-.925.937-1.125 2.262-.05.225.113.4.162.175.412.175.175 0 .3-.113.125-.112.15-.312.15-1.1 1-1.837Q16.875 15 18 15q.2 0 .35-.15.15-.15.15-.35V9.25q0-.525.363-.887Q19.225 8 19.75 8t.888.363q.362.362.362.887v6.5q0 1.6-.6 3.087-.6 1.488-1.688 2.638-1.087 1.15-2.599 1.837Q14.6 24 12.775 24Z' />
                  </svg>
                </div>
                {usernameRaisedHand} raised their hand
              </div>
            ) : (
              <></>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default VideoPlayer;
