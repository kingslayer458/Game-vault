import { useInfiniteQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { getGames, type Game } from '../lib/api';
import { GameCard } from '../components/GameCard';
import { Flame, TrendingUp, Star } from 'lucide-react';
import { Preloader } from '../components/Preloader';

export function Home() {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
    error,
  } = useInfiniteQuery({
    queryKey: ['games'],
    queryFn: ({ pageParam = 1 }) => getGames({ page: pageParam }),
    getNextPageParam: (_, pages) => pages.length + 1,
    retry: 3,
    retryDelay: 1000,
  });

  if (status === 'pending') {
    return <Preloader />;
  }

  if (status === 'error') {
    console.error('Home page error:', error);
    return (
      <div className="text-center py-8">
        <div className="text-red-500 mb-4">
          <h2 className="text-2xl font-bold mb-2">Unable to load games</h2>
          <p>Please check your internet connection and try again.</p>
        </div>
        <button 
          onClick={() => window.location.reload()} 
          className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  const games = data?.pages.flat() || [];

  return (
    <div>
      {/* Hero Section */}
      <motion.div 
        className="relative mb-8 md:mb-12 rounded-2xl overflow-hidden"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <img
          src="https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=2000&q=80"
          alt="Gaming Setup"
          className="w-full h-[300px] md:h-[400px] object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-black/40 flex items-center">
          <div className="px-4 md:px-8">
            <motion.h1 
              className="text-3xl md:text-5xl font-bold text-white mb-4"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              Discover Your Next Gaming Adventure
            </motion.h1>
            <motion.p 
              className="text-lg md:text-xl text-gray-300 max-w-2xl"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
            >
              Explore thousands of games across all platforms. Find new releases, top-rated titles, and hidden gems.
            </motion.p>
          </div>
        </div>
      </motion.div>

      {/* Categories */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-8 md:mb-12">
        <motion.div 
          className="bg-gradient-to-br from-red-500 to-orange-500 p-4 md:p-6 rounded-xl transform hover:scale-105 transition-transform cursor-pointer"
          whileHover={{ y: -5 }}
        >
          <Flame className="w-6 h-6 md:w-8 md:h-8 text-white mb-4" />
          <h3 className="text-lg md:text-xl font-bold text-white">Popular Now</h3>
          <p className="text-sm md:text-base text-white/80">What everyone's playing</p>
        </motion.div>
        <motion.div 
          className="bg-gradient-to-br from-blue-500 to-purple-500 p-4 md:p-6 rounded-xl transform hover:scale-105 transition-transform cursor-pointer"
          whileHover={{ y: -5 }}
        >
          <TrendingUp className="w-6 h-6 md:w-8 md:h-8 text-white mb-4" />
          <h3 className="text-lg md:text-xl font-bold text-white">Trending</h3>
          <p className="text-sm md:text-base text-white/80">Rising stars in gaming</p>
        </motion.div>
        <motion.div 
          className="bg-gradient-to-br from-green-500 to-teal-500 p-4 md:p-6 rounded-xl transform hover:scale-105 transition-transform cursor-pointer"
          whileHover={{ y: -5 }}
        >
          <Star className="w-6 h-6 md:w-8 md:h-8 text-white mb-4" />
          <h3 className="text-lg md:text-xl font-bold text-white">Top Rated</h3>
          <p className="text-sm md:text-base text-white/80">Best of the best</p>
        </motion.div>
      </div>

      <motion.h2 
        className="text-2xl md:text-3xl font-bold text-gray-100 mb-6 md:mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        Popular Games
      </motion.h2>
      
      {games.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
          {games.map((game: Game, index) => (
            <motion.div
              key={game.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <GameCard game={game} />
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="text-center text-gray-400 py-8">
          <p>No games available at the moment.</p>
        </div>
      )}
      
      {hasNextPage && (
        <div className="flex justify-center mt-8 md:mt-12">
          <motion.button
            onClick={() => fetchNextPage()}
            disabled={isFetchingNextPage}
            className="px-6 md:px-8 py-3 md:py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-colors disabled:opacity-50"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {isFetchingNextPage ? 'Loading more...' : 'Load more games'}
          </motion.button>
        </div>
      )}
    </div>
  );
}