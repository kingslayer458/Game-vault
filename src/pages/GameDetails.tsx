import { useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Star, Heart, Globe, Calendar, Users, Trophy, Download, Clock, Users as UsersIcon, Gamepad } from 'lucide-react';
import { getGameDetails } from '../lib/api';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { useWishlistStore } from '../stores/wishlist';
import { Preloader } from '../components/Preloader';
import { GameCard } from '../components/GameCard';

export function GameDetails() {
  const { id } = useParams<{ id: string }>();
  const [activeTab, setActiveTab] = useState<'about' | 'screenshots' | 'dlc'>('about');
  const { data: game, status } = useQuery({
    queryKey: ['game', id],
    queryFn: () => getGameDetails(id!),
  });
  const { addItem, removeItem, isInWishlist } = useWishlistStore();

  const handleWishlist = () => {
    if (!game) return;
    
    if (isInWishlist(game.id)) {
      removeItem(game.id);
      toast.success('Removed from wishlist');
    } else {
      addItem(game);
      toast.success('Added to wishlist');
    }
  };

  if (status === 'pending') {
    return <Preloader />;
  }

  if (status === 'error' || !game) {
    return (
      <div className="text-center text-red-500 py-8">
        Error loading game details. Please try again later.
      </div>
    );
  }

  const inWishlist = isInWishlist(game.id);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-6xl mx-auto">
        {/* Hero Section */}
        <div className="relative rounded-2xl overflow-hidden mb-8">
          {game.background_image && (
            <img
              src={game.background_image}
              alt={game.name}
              className="w-full h-[500px] object-cover"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent">
            <div className="absolute bottom-0 p-8">
              <h1 className="text-5xl font-bold text-white mb-4">{game.name}</h1>
              <div className="flex items-center space-x-6">
                {typeof game.rating === 'number' && (
                  <div className="flex items-center space-x-2">
                    <Star className="w-6 h-6 text-yellow-500" fill="currentColor" />
                    <span className="text-2xl text-white">{game.rating}/5</span>
                  </div>
                )}
                {game.metacritic && (
                  <div className="px-3 py-1 rounded-lg bg-green-500/20 border border-green-500">
                    <span className="text-xl text-green-500">{game.metacritic}</span>
                  </div>
                )}
                <button 
                  onClick={handleWishlist}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                    inWishlist 
                      ? 'bg-red-600 hover:bg-red-700' 
                      : 'bg-red-500 hover:bg-red-600'
                  }`}
                >
                  <Heart className="w-5 h-5" fill={inWishlist ? 'currentColor' : 'none'} />
                  <span>{inWishlist ? 'Remove from Wishlist' : 'Add to Wishlist'}</span>
                </button>
                {game.website && (
                  <a
                    href={game.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded-lg transition-colors"
                  >
                    <Globe className="w-5 h-5" />
                    <span>Visit Website</span>
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex space-x-4 mb-6">
          <button
            onClick={() => setActiveTab('about')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              activeTab === 'about'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300'
            }`}
          >
            About
          </button>
          <button
            onClick={() => setActiveTab('screenshots')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              activeTab === 'screenshots'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300'
            }`}
          >
            Screenshots
          </button>
          <button
            onClick={() => setActiveTab('dlc')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              activeTab === 'dlc'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300'
            }`}
          >
            DLC
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {activeTab === 'about' && (
              <div className="space-y-8">
                <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
                  <h2 className="text-2xl font-bold mb-4">About</h2>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                    {game.description_raw || 'No description available for this game.'}
                  </p>
                </div>

                {/* Achievements */}
                {game.achievements_count > 0 && game.achievements?.length > 0 && (
                  <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-2xl font-bold">Achievements</h2>
                      <span className="text-gray-500">{game.achievements_count} total</span>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      {game.achievements.slice(0, 4).map((achievement) => (
                        <div key={achievement.id} className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                          <Trophy className="w-8 h-8 text-yellow-500" />
                          <div>
                            <h3 className="font-medium">{achievement.name}</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400">{achievement.percent}% of players</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Game Stats */}
                <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
                  <h2 className="text-2xl font-bold mb-4">Game Stats</h2>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {typeof game.playtime === 'number' && (
                      <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg text-center">
                        <Clock className="w-6 h-6 mx-auto mb-2 text-blue-500" />
                        <div className="text-2xl font-bold">{game.playtime}</div>
                        <div className="text-sm text-gray-500">Hours Played</div>
                      </div>
                    )}
                    {typeof game.reviews_count === 'number' && (
                      <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg text-center">
                        <UsersIcon className="w-6 h-6 mx-auto mb-2 text-green-500" />
                        <div className="text-2xl font-bold">{game.reviews_count}</div>
                        <div className="text-sm text-gray-500">Reviews</div>
                      </div>
                    )}
                    {typeof game.ratings_count === 'number' && (
                      <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg text-center">
                        <Star className="w-6 h-6 mx-auto mb-2 text-yellow-500" />
                        <div className="text-2xl font-bold">{game.ratings_count}</div>
                        <div className="text-sm text-gray-500">Ratings</div>
                      </div>
                    )}
                    {typeof game.suggestions_count === 'number' && (
                      <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg text-center">
                        <Gamepad className="w-6 h-6 mx-auto mb-2 text-purple-500" />
                        <div className="text-2xl font-bold">{game.suggestions_count}</div>
                        <div className="text-sm text-gray-500">Suggestions</div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Similar Games */}
                {game.similar_games?.length > 0 && (
                  <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
                    <h2 className="text-2xl font-bold mb-4">Similar Games</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {game.similar_games.map((similarGame) => (
                        <GameCard key={similarGame.id} game={similarGame} />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'screenshots' && game.screenshots?.length > 0 && (
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
                <h2 className="text-2xl font-bold mb-4">Screenshots</h2>
                <div className="grid grid-cols-2 gap-4">
                  {game.screenshots.map((screenshot) => (
                    <div key={screenshot.id} className="relative group">
                      <motion.img
                        src={screenshot.image}
                        alt="Screenshot"
                        className="rounded-lg w-full"
                        whileHover={{ scale: 1.02 }}
                        layoutId={`screenshot-${screenshot.id}`}
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-opacity flex items-center justify-center opacity-0 group-hover:opacity-100">
                        <a
                          href={screenshot.image}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
                        >
                          <Download className="w-5 h-5" />
                          <span>View Full Size</span>
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'screenshots' && (!game.screenshots || game.screenshots.length === 0) && (
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
                <h2 className="text-2xl font-bold mb-4">Screenshots</h2>
                <p className="text-gray-500">No screenshots available for this game.</p>
              </div>
            )}

            {activeTab === 'dlc' && (
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
                <h2 className="text-2xl font-bold mb-4">Downloadable Content</h2>
                {game.dlc?.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {game.dlc.map((dlc) => (
                      <div key={dlc.id} className="bg-gray-50 dark:bg-gray-700 rounded-lg overflow-hidden">
                        {dlc.background_image && (
                          <img src={dlc.background_image} alt={dlc.name} className="w-full h-32 object-cover" />
                        )}
                        <div className="p-4">
                          <h3 className="font-bold mb-2">{dlc.name}</h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{dlc.description}</p>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-500">
                              Released: {new Date(dlc.released).toLocaleDateString()}
                            </span>
                            {dlc.price && (
                              <span className="font-bold text-green-500">${dlc.price}</span>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500">No DLC available for this game.</p>
                )}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
              <h3 className="text-xl font-bold mb-4">Game Info</h3>
              <div className="space-y-4">
                {game.released && (
                  <div className="flex items-center space-x-3">
                    <Calendar className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Release Date</p>
                      <p className="text-gray-900 dark:text-white">{new Date(game.released).toLocaleDateString()}</p>
                    </div>
                  </div>
                )}
                {game.developers?.length > 0 && (
                  <div className="flex items-center space-x-3">
                    <Users className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Developers</p>
                      <p className="text-gray-900 dark:text-white">{game.developers.map(d => d.name).join(', ')}</p>
                    </div>
                  </div>
                )}
                {game.publishers?.length > 0 && (
                  <div className="flex items-center space-x-3">
                    <Trophy className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Publishers</p>
                      <p className="text-gray-900 dark:text-white">{game.publishers.map(p => p.name).join(', ')}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {game.platforms?.length > 0 && (
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
                <h3 className="text-xl font-bold mb-4">Platforms</h3>
                <div className="flex flex-wrap gap-2">
                  {game.platforms.map(({ platform }) => (
                    <span
                      key={platform.id}
                      className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full text-sm"
                    >
                      {platform.name}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {game.genres?.length > 0 && (
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
                <h3 className="text-xl font-bold mb-4">Genres</h3>
                <div className="flex flex-wrap gap-2">
                  {game.genres.map((genre) => (
                    <span
                      key={genre.id}
                      className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full text-sm"
                    >
                      {genre.name}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}