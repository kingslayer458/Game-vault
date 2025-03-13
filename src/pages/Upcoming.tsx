import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Calendar } from 'lucide-react';
import { getUpcomingGames } from '../lib/api';
import { GameCard } from '../components/GameCard';
import { Preloader } from '../components/Preloader';

export function Upcoming() {
  const { data: games, status } = useQuery({
    queryKey: ['upcomingGames'],
    queryFn: getUpcomingGames,
  });

  if (status === 'pending') {
    return <Preloader />;
  }

  if (status === 'error') {
    return (
      <div className="text-center text-red-500 py-8">
        Error loading upcoming games. Please try again later.
      </div>
    );
  }

  return (
    <div>
      <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-8 rounded-2xl mb-8">
        <Calendar className="w-12 h-12 text-white mb-4" />
        <h1 className="text-4xl font-bold text-white mb-2">Upcoming Games</h1>
        <p className="text-white/90">The most anticipated upcoming releases</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {games.map((game, index) => (
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