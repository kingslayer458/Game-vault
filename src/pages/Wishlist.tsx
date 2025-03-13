import { Heart } from 'lucide-react';
import { motion } from 'framer-motion';
import { useWishlistStore } from '../stores/wishlist';
import { GameCard } from '../components/GameCard';

export function Wishlist() {
  const { items } = useWishlistStore();

  if (items.length === 0) {
    return (
      <div className="text-center py-16">
        <Heart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-700 dark:text-gray-300 mb-2">Your wishlist is empty</h2>
        <p className="text-gray-600 dark:text-gray-400">Start adding games you're interested in!</p>
      </div>
    );
  }

  return (
    <div>
      <div className="bg-gradient-to-r from-red-500 to-pink-500 p-8 rounded-2xl mb-8">
        <Heart className="w-12 h-12 text-white mb-4" />
        <h1 className="text-4xl font-bold text-white mb-2">Your Wishlist</h1>
        <p className="text-white/90">{items.length} games saved</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {items.map((game, index) => (
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
    </div>
  );
}