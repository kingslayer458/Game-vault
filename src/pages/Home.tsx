import { useInfiniteQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { getGames, type Game } from '../lib/api';
import { GameCard3D } from '../components/3D/GameCard3D';
import { ParticleField } from '../components/3D/ParticleField';
import { FloatingElements } from '../components/3D/FloatingElements';
import { HolographicOverlay } from '../components/3D/HolographicOverlay';
import { Flame, TrendingUp, Star, Zap } from 'lucide-react';
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
    <div className="relative min-h-screen">
      {/* 3D Background Elements */}
      <ParticleField />
      <FloatingElements />
      <HolographicOverlay />
      
      {/* Hero Section with 3D Effects */}
      <motion.div 
        className="relative mb-8 md:mb-12 rounded-2xl overflow-hidden"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="relative">
          <img
            src="https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=2000&q=80"
            alt="Gaming Setup"
            className="w-full h-[300px] md:h-[400px] object-cover"
          />
          
          {/* Holographic Overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-blue-900/40 to-purple-900/40" />
          
          {/* Animated Grid Overlay */}
          <div 
            className="absolute inset-0 opacity-20"
            style={{
              backgroundImage: `
                linear-gradient(rgba(59, 130, 246, 0.5) 1px, transparent 1px),
                linear-gradient(90deg, rgba(59, 130, 246, 0.5) 1px, transparent 1px)
              `,
              backgroundSize: '30px 30px'
            }}
          />
          
          <div className="absolute inset-0 flex items-center">
            <div className="px-4 md:px-8">
              <motion.h1 
                className="text-3xl md:text-5xl font-bold text-white mb-4 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                Discover Your Next Gaming Adventure
              </motion.h1>
              <motion.p 
                className="text-lg md:text-xl text-gray-300 max-w-2xl mb-6"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
              >
                Explore thousands of games in stunning 3D. Experience the future of game discovery.
              </motion.p>
              
              <motion.div
                className="flex items-center space-x-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
              >
                <div className="flex items-center space-x-2 px-4 py-2 bg-blue-500/20 rounded-full border border-blue-400/30">
                  <Zap className="w-5 h-5 text-blue-400" />
                  <span className="text-blue-300 text-sm">WebGL Powered</span>
                </div>
                <div className="flex items-center space-x-2 px-4 py-2 bg-purple-500/20 rounded-full border border-purple-400/30">
                  <Star className="w-5 h-5 text-purple-400" />
                  <span className="text-purple-300 text-sm">3D Experience</span>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Enhanced Categories with 3D Effects */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-8 md:mb-12">
        <motion.div 
          className="relative bg-gradient-to-br from-red-500/20 to-orange-500/20 p-4 md:p-6 rounded-xl border border-red-500/30 backdrop-blur-sm transform hover:scale-105 transition-all duration-300 cursor-pointer group overflow-hidden"
          whileHover={{ y: -5, rotateX: 5 }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-red-500/10 to-orange-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <Flame className="w-6 h-6 md:w-8 md:h-8 text-red-400 mb-4 relative z-10" />
          <h3 className="text-lg md:text-xl font-bold text-white mb-2 relative z-10">Popular Now</h3>
          <p className="text-sm md:text-base text-gray-300 relative z-10">What everyone's playing</p>
        </motion.div>
        
        <motion.div 
          className="relative bg-gradient-to-br from-blue-500/20 to-purple-500/20 p-4 md:p-6 rounded-xl border border-blue-500/30 backdrop-blur-sm transform hover:scale-105 transition-all duration-300 cursor-pointer group overflow-hidden"
          whileHover={{ y: -5, rotateX: 5 }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <TrendingUp className="w-6 h-6 md:w-8 md:h-8 text-blue-400 mb-4 relative z-10" />
          <h3 className="text-lg md:text-xl font-bold text-white mb-2 relative z-10">Trending</h3>
          <p className="text-sm md:text-base text-gray-300 relative z-10">Rising stars in gaming</p>
        </motion.div>
        
        <motion.div 
          className="relative bg-gradient-to-br from-green-500/20 to-teal-500/20 p-4 md:p-6 rounded-xl border border-green-500/30 backdrop-blur-sm transform hover:scale-105 transition-all duration-300 cursor-pointer group overflow-hidden"
          whileHover={{ y: -5, rotateX: 5 }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0 }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-green-500/10 to-teal-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <Star className="w-6 h-6 md:w-8 md:h-8 text-green-400 mb-4 relative z-10" />
          <h3 className="text-lg md:text-xl font-bold text-white mb-2 relative z-10">Top Rated</h3>
          <p className="text-sm md:text-base text-gray-300 relative z-10">Best of the best</p>
        </motion.div>
      </div>

      <motion.h2 
        className="text-2xl md:text-3xl font-bold text-gray-100 mb-6 md:mb-8 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.1 }}
      >
        Popular Games - 3D Showcase
      </motion.h2>
      
      {games.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
          {games.map((game: Game, index) => (
            <GameCard3D key={game.id} game={game} index={index} />
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
            className="relative px-6 md:px-8 py-3 md:py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl font-medium transition-all duration-300 disabled:opacity-50 overflow-hidden group"
            whileHover={{ scale: 1.05, rotateX: 5 }}
            whileTap={{ scale: 0.95 }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-purple-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <span className="relative z-10">
              {isFetchingNextPage ? 'Loading more...' : 'Load more games'}
            </span>
          </motion.button>
        </div>
      )}
    </div>
  );
}