import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { BookOpen, ExternalLink, Calendar } from 'lucide-react';
import { format } from 'date-fns';
import { getGameGuides } from '../lib/api';
import { Preloader } from '../components/Preloader';

export function Guides() {
  const { data: guides, status } = useQuery({
    queryKey: ['guides'],
    queryFn: getGameGuides,
    staleTime: 5 * 60 * 1000, // Consider data fresh for 5 minutes
  });

  if (status === 'pending') {
    return <Preloader />;
  }

  if (status === 'error') {
    return (
      <div className="text-center text-red-500 py-8">
        Error loading guides. Please try again later.
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="bg-gradient-to-r from-green-600 to-teal-600 rounded-2xl p-8 mb-12">
        <BookOpen className="w-12 h-12 text-white mb-4" />
        <h1 className="text-4xl font-bold text-white mb-2">Game Guides</h1>
        <p className="text-white/90">Comprehensive guides and walkthroughs</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {guides.map((guide, index) => (
          <motion.article
            key={guide.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow"
          >
            <div className="relative h-48">
              <img
                src={guide.image}
                alt={guide.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-6">
                <h2 className="text-xl font-bold text-white">{guide.title}</h2>
              </div>
            </div>

            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm text-gray-500 dark:text-gray-400 flex items-center">
                  <Calendar className="w-4 h-4 mr-1" />
                  {format(new Date(guide.published), 'MMM d, yyyy')}
                </span>
              </div>

              <p className="text-gray-600 dark:text-gray-400 mb-4">
                {guide.description}
              </p>

              {guide.website && (
                <a
                  href={guide.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-blue-500 hover:text-blue-600 transition-colors"
                >
                  View Guide
                  <ExternalLink className="w-4 h-4 ml-1" />
                </a>
              )}
            </div>
          </motion.article>
        ))}
      </div>
    </div>
  );
}