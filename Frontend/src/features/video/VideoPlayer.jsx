import { useEffect, useRef } from "react";
import shaka from "shaka-player/dist/shaka-player.ui";
import "shaka-player/dist/controls.css";

const VideoPlayer = ({src,thumbnail}) => {
  const videoRef = useRef(null);
  const uiRef = useRef(null);
  const playerRef = useRef(null);

  useEffect(() => {
    console.log(src,thumbnail);
    
    shaka.polyfill.installAll();

    if (!shaka.Player.isBrowserSupported()) {
      console.error("Browser not supported");
      return;
    }

    const video = videoRef.current;
    video.poster = thumbnail; 
    video.muted = true;                     
    video.autoplay = true;                  

    const player = new shaka.Player(video);
    playerRef.current = player;

    const ui = new shaka.ui.Overlay(
      player,
      video.parentElement,
      video
    );
    uiRef.current = ui;

    // Optional UI config (YouTube-like)
    ui.configure({
      controlPanelElements: [
        "play_pause",
        "time_and_duration",
        "spacer",
        "mute",
        "volume",
        "fullscreen",
        "overflow_menu",
      ],
      overflowMenuButtons: [
        "quality",
        "playback_rate",
      ],
    });

    player
      .load(src)
      .catch((e) => console.error("Error loading video", e));

    return () => {
      uiRef.current?.destroy();
      playerRef.current?.destroy();
    };
  }, []);

  return (
    <div className="w-full  mx-auto">
      <div className="relative w-full aspect-video bg-black">
        <div className="shaka-video-container absolute inset-0">
          <video
            ref={videoRef}
            className="shaka-video w-full h-full object-contain"
            playsInline
          />
        </div>
      </div>
    </div>

  );
};

export default VideoPlayer;
