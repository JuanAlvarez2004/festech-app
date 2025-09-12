import { useVideoPlayer } from 'expo-video';
import { useEffect } from 'react';

interface UseVideoPlayerOptions {
  source: string;
  isActive: boolean;
  loop?: boolean;
  muted?: boolean;
}

export function useVideoPlayerWithControls({
  source,
  isActive,
  loop = true,
  muted = false,
}: UseVideoPlayerOptions) {
  const player = useVideoPlayer(source, player => {
    player.loop = loop;
    player.muted = muted;
  });

  useEffect(() => {
    if (isActive) {
      player.play();
    } else {
      player.pause();
    }
  }, [isActive, player]);

  const togglePlayPause = () => {
    if (player.playing) {
      player.pause();
    } else {
      player.play();
    }
  };

  const play = () => {
    player.play();
  };

  const pause = () => {
    player.pause();
  };

  const seek = (time: number) => {
    player.currentTime = time;
  };

  const setMuted = (muted: boolean) => {
    player.muted = muted;
  };

  const setVolume = (volume: number) => {
    player.volume = Math.max(0, Math.min(1, volume));
  };

  return {
    player,
    isPlaying: player.playing,
    togglePlayPause,
    play,
    pause,
    seek,
    setMuted,
    setVolume,
    currentTime: player.currentTime,
    duration: player.duration,
  };
}