import { useState } from 'react';
import { motion } from 'framer-motion';
import { MessageSquare, ThumbsUp, Share2, Flag } from 'lucide-react';
import { format } from 'date-fns';

interface ForumPost {
  id: number;
  title: string;
  content: string;
  author: {
    name: string;
    avatar: string;
  };
  created_at: string;
  likes: number;
  replies: number;
  tags: string[];
}

const MOCK_POSTS: ForumPost[] = [
  {
    id: 1,
    title: "Tips for beating the final boss in Elden Ring",
    content: "After many attempts, I've finally figured out the perfect strategy...",
    author: {
      name: "EldenLord",
      avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=50"
    },
    created_at: new Date().toISOString(),
    likes: 124,
    replies: 45,
    tags: ["Elden Ring", "Boss Fight", "Guide"]
  },
  {
    id: 2,
    title: "Looking for squad members in Warzone",
    content: "Need experienced players for competitive matches...",
    author: {
      name: "WarzonePro",
      avatar: "https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=50"
    },
    created_at: new Date().toISOString(),
    likes: 56,
    replies: 23,
    tags: ["Warzone", "LFG", "Competitive"]
  }
];

export function Community() {
  const [posts] = useState<ForumPost[]>(MOCK_POSTS);
  const [activeTag, setActiveTag] = useState<string | null>(null);

  const allTags = Array.from(new Set(posts.flatMap(post => post.tags)));
  const filteredPosts = activeTag 
    ? posts.filter(post => post.tags.includes(activeTag))
    : posts;

  return (
    <div className="max-w-7xl mx-auto">
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl p-8 mb-12">
        <MessageSquare className="w-12 h-12 text-white mb-4" />
        <h1 className="text-4xl font-bold text-white mb-2">Community Forum</h1>
        <p className="text-white/90">Join discussions with fellow gamers</p>
      </div>

      {/* Tags */}
      <div className="flex flex-wrap gap-2 mb-8">
        <button
          onClick={() => setActiveTag(null)}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
            activeTag === null
              ? 'bg-blue-500 text-white'
              : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
          }`}
        >
          All Topics
        </button>
        {allTags.map(tag => (
          <button
            key={tag}
            onClick={() => setActiveTag(tag)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              activeTag === tag
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
            }`}
          >
            {tag}
          </button>
        ))}
      </div>

      {/* Posts */}
      <div className="space-y-6">
        {filteredPosts.map((post, index) => (
          <motion.div
            key={post.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg"
          >
            <div className="flex items-center mb-4">
              <img
                src={post.author.avatar}
                alt={post.author.name}
                className="w-10 h-10 rounded-full mr-4"
              />
              <div>
                <h3 className="font-medium text-gray-900 dark:text-white">
                  {post.author.name}
                </h3>
                <p className="text-sm text-gray-500">
                  {format(new Date(post.created_at), 'MMM d, yyyy')}
                </p>
              </div>
            </div>

            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
              {post.title}
            </h2>
            
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              {post.content}
            </p>

            <div className="flex flex-wrap gap-2 mb-4">
              {post.tags.map(tag => (
                <span
                  key={tag}
                  className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-full text-sm"
                >
                  {tag}
                </span>
              ))}
            </div>

            <div className="flex items-center space-x-6 text-gray-500 dark:text-gray-400">
              <button className="flex items-center space-x-2 hover:text-blue-500 transition-colors">
                <ThumbsUp className="w-5 h-5" />
                <span>{post.likes}</span>
              </button>
              <button className="flex items-center space-x-2 hover:text-blue-500 transition-colors">
                <MessageSquare className="w-5 h-5" />
                <span>{post.replies}</span>
              </button>
              <button className="flex items-center space-x-2 hover:text-blue-500 transition-colors">
                <Share2 className="w-5 h-5" />
                <span>Share</span>
              </button>
              <button className="flex items-center space-x-2 hover:text-red-500 transition-colors">
                <Flag className="w-5 h-5" />
                <span>Report</span>
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}