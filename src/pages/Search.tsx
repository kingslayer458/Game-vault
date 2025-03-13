import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Search as SearchIcon } from 'lucide-react';
import { searchGames } from '../lib/api';
import { GameCard } from '../components/GameCard';
import { useSearchParams } from 'react-router-dom';

export function Search() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  const [query, setQuery] = useState(initialQuery);

  const { data: games, status } = useQuery({
    queryKey: ['search', query],
    queryFn: () => searchGames(query),
    enabled: query.length > 0,
  });

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const newQuery = query.trim();
    if (newQuery) {
      setSearchParams({ q: newQuery });
    }
  };

  useEffect(() => {
    setQuery(initialQuery);
  }, [initialQuery]);

  return (
    <div>
      <div className="max-w-2xl mx-auto mb-8">
        <form onSubmit={handleSearch}>
          <div className="relative">
            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search games..."
              className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
        </form>
      </div>

      {status === 'pending' && (
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      )}
      
      {status === 'error' && (
        <div className="text-center text-red-500 py-8">
          Error searching games. Please try again later.
        </div>
      )}

      {games && games.length > 0 && (
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
      )}

      {games && games.length === 0 && (
        <div className="text-center text-gray-600 dark:text-gray-300">
          No games found for "{query}"
        </div>
      )}
    </div>
  );
}