import { useInfiniteQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Newspaper, Calendar, ExternalLink } from 'lucide-react';
import { format } from 'date-fns';
import { getGameNews } from '../lib/api';
import { Preloader } from '../components/Preloader';

export function GameNews() {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
  } = useInfiniteQuery({
    queryKey: ['gameNews'],
    queryFn: ({ pageParam = 1 }) => getGameNews(pageParam),
    getNextPageParam: (lastPage) => lastPage.next,
    initialPageParam: 1,
  });

  if (status === 'pending') {
    return <Preloader />;
  }

  if (status === 'error') {
    return (
      <div className="text-center text-red-500 py-8">
        Error loading news. Please try again later.
      </div>
    );
  }

  const allNews = data.pages.flatMap(page => page.results);

  return (
    <div className="max-w-7xl mx-auto">
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-8 mb-12">
        <Newspaper className="w-12 h-12 text-white mb-4" />
        <h1 className="text-4xl font-bold text-white mb-2">Gaming News</h1>
        <p className="text-white/90">Stay updated with the latest in gaming</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {allNews.map((article, index) => (
          <motion.article
            key={`${article.id}-${index}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow"
          >
            <img
              src={article.image}
              alt={article.title}
              className="w-full h-48 object-cover"
            />
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm text-gray-500 dark:text-gray-400 flex items-center">
                  <Calendar className="w-4 h-4 mr-1" />
                  {format(new Date(article.published), 'MMM d, yyyy')}
                </span>
              </div>
              
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                {article.title}
              </h2>
              
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                {article.description}
              </p>
              
              {article.website && (
                <a
                  href={article.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-blue-500 hover:text-blue-600 transition-colors"
                >
                  Read more
                  <ExternalLink className="w-4 h-4 ml-1" />
                </a>
              )}
            </div>
          </motion.article>
        ))}
      </div>

      {hasNextPage && (
        <div className="flex justify-center mt-12">
          <button
            onClick={() => fetchNextPage()}
            disabled={isFetchingNextPage}
            className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-colors disabled:opacity-50"
          >
            {isFetchingNextPage ? 'Loading more...' : 'Load more news'}
          </button>
        </div>
      )}
    </div>
  );
}