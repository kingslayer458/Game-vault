import { Link } from 'react-router-dom';
import { Star, Heart, Play } from 'lucide-react';
import { type Game } from '../lib/api';
import { useWishlistStore } from '../stores/wishlist';
import { VideoPreview } from './VideoPreview';
import toast from 'react-hot-toast';
import { useState, useCallback, memo } from 'react';
import { cn } from '../lib/utils';
import { motion } from 'framer-motion';

const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1592155931584-901ac15763e3?auto=format&fit=crop&w=800&q=80';

interface GameCardProps {
  game: Game;
}

const MetacriticBadge = memo(({ score }: { score: number }) => (
  <div className="absolute top-4 right-4 bg-black/80 backdrop-blur-sm px-2 py-1 rounded text-sm font-medium">
    <span className={cn({
      'text-green-500': score >= 75,
      'text-yellow-500': score >= 50 && score < 75,
      'text-red-500': score < 50
    })}>
      {score}
    </span>
  </div>
));

export const GameCard = memo(function GameCard({ game }: GameCardProps) {
  const { addItem, removeItem, isInWishlist } = useWishlistStore();
  const inWishlist = isInWishlist(game.id);
  const [showVideo, setShowVideo] = useState(false);

  const handleWishlist = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    if (inWishlist) {
      removeItem(game.id);
      toast.success('Removed from wishlist');
    } else {
      addItem(game);
      toast.success('Added to wishlist');
    }
  }, [inWishlist, game.id, addItem, removeItem]);

  const handleMouseEnter = useCallback(() => setShowVideo(true), []);
  const handleMouseLeave = useCallback(() => setShowVideo(false), []);

  return (
    <motion.div
      whileHover={{ y: -5, scale: 1.02 }}
      transition={{ duration: 0.2 }}
    >
      <Link to={`/game/${game.id}`} className="group block">
        <div className="relative bg-white dark:bg-gray-900 rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300">
          <div className="relative">
            {game.clip ? (
              <div
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                className="relative w-full aspect-video"
              >
                {showVideo ? (
                  <VideoPreview
                    videoUrl={game.clip.clip}
                    thumbnailUrl={game.background_image || FALLBACK_IMAGE}
                  />
                ) : (
                  <img
                    src={game.background_image || FALLBACK_IMAGE}
                    alt={game.name}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                )}
              </div>
            ) : (
              <img
                src={game.background_image || FALLBACK_IMAGE}
                alt={game.name}
                className="w-full aspect-video object-cover"
                loading="lazy"
              />
            )}
            
            {/* Metacritic Score */}
            {game.metacritic && <MetacriticBadge score={game.metacritic} />}
            
            {/* Wishlist Button */}
            <button 
              className={cn(
                'absolute top-4 left-4 p-2 rounded-full backdrop-blur-sm transition-all duration-300',
                inWishlist 
                  ? 'bg-red-500/80 hover:bg-red-600/90 text-white' 
                  : 'bg-black/50 hover:bg-black/70 text-gray-200 hover:text-red-500'
              )}
              onClick={handleWishlist}
              aria-label={inWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
            >
              <Heart className="w-5 h-5" fill={inWishlist ? 'currentColor' : 'none'} />
            </button>

            {/* Video Preview Indicator */}
            {game.clip && (
              <div className="absolute bottom-4 right-4 bg-black/80 backdrop-blur-sm p-2 rounded-full text-white">
                <Play className="w-4 h-4" />
              </div>
            )}
          </div>
          
          <div className="p-4">
            <h3 className="text-lg md:text-xl font-bold text-gray-900 dark:text-gray-100 mb-2 line-clamp-1">
              {game.name}
            </h3>
            
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                <Star className="w-4 h-4 md:w-5 md:h-5 text-yellow-500" fill="currentColor" />
                <span className="text-sm md:text-base text-gray-700 dark:text-gray-300">
                  {game.rating ? game.rating.toFixed(1) : 'N/A'}
                </span>
              </div>
              {game.released && (
                <time 
                  dateTime={game.released}
                  className="text-xs md:text-sm text-gray-600 dark:text-gray-400"
                >
                  {new Date(game.released).toLocaleDateString()}
                </time>
              )}
            </div>
            
            {game.genres && game.genres.length > 0 && (
              <div className="flex flex-wrap gap-1 md:gap-2 mb-3">
                {game.genres.slice(0, 2).map((genre) => (
                  <span
                    key={genre.id}
                    className="px-2 py-1 text-xs font-medium bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-full"
                  >
                    {genre.name}
                  </span>
                ))}
              </div>
            )}
            
            {game.platforms && game.platforms.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {game.platforms.slice(0, 3).map(({ platform }) => (
                  <span
                    key={platform.id}
                    className="text-xs md:text-sm text-gray-600 dark:text-gray-400"
                  >
                    {platform.name}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
});