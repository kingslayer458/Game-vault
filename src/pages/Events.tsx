import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { getGamingEvents } from '../lib/api';
import { Calendar, MapPin, Trophy } from 'lucide-react';
import { format } from 'date-fns';
import { Preloader } from '../components/Preloader';

export function Events() {
  const { data: events, status } = useQuery({
    queryKey: ['events'],
    queryFn: getGamingEvents,
  });

  if (status === 'pending') {
    return <Preloader />;
  }

  if (status === 'error') {
    return (
      <div className="text-center text-red-500 py-8">
        Error loading events. Please try again later.
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl p-8 mb-12">
        <Trophy className="w-12 h-12 text-white mb-4" />
        <h1 className="text-4xl font-bold text-white mb-2">Gaming Events</h1>
        <p className="text-white/90">Stay updated with the latest gaming tournaments and conventions</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {events.map((event, index) => (
          <motion.div
            key={event.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-lg"
          >
            <img
              src={event.image_url}
              alt={event.title}
              className="w-full h-48 object-cover"
            />
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  event.type === 'esports' 
                    ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                    : 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                }`}>
                  {event.type.charAt(0).toUpperCase() + event.type.slice(1)}
                </span>
                <div className="flex items-center text-gray-600 dark:text-gray-400">
                  <Calendar className="w-4 h-4 mr-1" />
                  <span className="text-sm">
                    {format(new Date(event.start_date), 'MMM d, yyyy')}
                  </span>
                </div>
              </div>
              
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                {event.title}
              </h3>
              
              <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                {event.description}
              </p>
              
              <div className="flex items-center text-gray-600 dark:text-gray-400">
                <MapPin className="w-4 h-4 mr-2" />
                <span>{event.location}</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}