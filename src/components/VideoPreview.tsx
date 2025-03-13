import { useState, useRef } from 'react';
import ReactPlayer from 'react-player';
import { Play, Pause } from 'lucide-react';

interface VideoPreviewProps {
  videoUrl: string;
  thumbnailUrl: string;
}

export function VideoPreview({ videoUrl, thumbnailUrl }: VideoPreviewProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const playerRef = useRef<ReactPlayer>(null);

  const handleMouseEnter = () => {
    setIsHovered(true);
    setIsPlaying(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setIsPlaying(false);
    if (playerRef.current) {
      playerRef.current.seekTo(0);
    }
  };

  return (
    <div
      className="relative rounded-lg overflow-hidden"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {!isHovered && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50 z-10">
          <Play className="w-12 h-12 text-white" />
        </div>
      )}
      
      <ReactPlayer
        ref={playerRef}
        url={videoUrl}
        playing={isPlaying}
        muted
        width="100%"
        height="100%"
        style={{ aspectRatio: '16/9' }}
        light={!isPlaying ? thumbnailUrl : false}
        playIcon={<Play className="w-16 h-16 text-white" />}
      />
      
      {isHovered && (
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="text-white hover:text-blue-400 transition-colors"
          >
            {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
          </button>
        </div>
      )}
    </div>
  );
}