import { PropsWithChildren } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Menu, X, Sun, Moon, Home, Gamepad2, Trophy, Calendar, Heart, Newspaper } from 'lucide-react';
import { useThemeStore } from '../stores/theme';
import { cn } from '../lib/utils';
import { useMenuStore } from '../stores/menu';

export function Layout({ children }: PropsWithChildren) {
  const { theme, toggleTheme } = useThemeStore();
  const { isOpen, toggle } = useMenuStore();
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const query = formData.get('search') as string;
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query)}`);
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={toggle}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 w-[280px] bg-gray-900 dark:bg-black transform transition-transform duration-200 ease-in-out md:relative md:translate-x-0 border-r border-gray-800',
          {
            '-translate-x-full': !isOpen,
          }
        )}
      >
        <div className="p-6">
          <Link to="/" className="flex items-center space-x-3" onClick={() => toggle()}>
            <Gamepad2 size={32} className="text-blue-500" />
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-500 to-purple-500 text-transparent bg-clip-text">
              GameVault
            </span>
          </Link>
          <nav className="mt-10 space-y-1">
            <Link
              to="/"
              className="flex items-center space-x-3 px-4 py-3 text-gray-300 hover:bg-gray-800 rounded-lg transition-colors group"
              onClick={() => toggle()}
            >
              <Home className="w-5 h-5 group-hover:text-blue-500 transition-colors" />
              <span className="group-hover:text-blue-500 transition-colors">Home</span>
            </Link>
            <Link
              to="/search"
              className="flex items-center space-x-3 px-4 py-3 text-gray-300 hover:bg-gray-800 rounded-lg transition-colors group"
              onClick={() => toggle()}
            >
              <Search className="w-5 h-5 group-hover:text-blue-500 transition-colors" />
              <span className="group-hover:text-blue-500 transition-colors">Search</span>
            </Link>
            <Link
              to="/top-rated"
              className="flex items-center space-x-3 px-4 py-3 text-gray-300 hover:bg-gray-800 rounded-lg transition-colors group"
              onClick={() => toggle()}
            >
              <Trophy className="w-5 h-5 group-hover:text-blue-500 transition-colors" />
              <span className="group-hover:text-blue-500 transition-colors">Top Rated</span>
            </Link>
            <Link
              to="/upcoming"
              className="flex items-center space-x-3 px-4 py-3 text-gray-300 hover:bg-gray-800 rounded-lg transition-colors group"
              onClick={() => toggle()}
            >
              <Calendar className="w-5 h-5 group-hover:text-blue-500 transition-colors" />
              <span className="group-hover:text-blue-500 transition-colors">Upcoming</span>
            </Link>
            <Link
              to="/wishlist"
              className="flex items-center space-x-3 px-4 py-3 text-gray-300 hover:bg-gray-800 rounded-lg transition-colors group"
              onClick={() => toggle()}
            >
              <Heart className="w-5 h-5 group-hover:text-blue-500 transition-colors" />
              <span className="group-hover:text-blue-500 transition-colors">Wishlist</span>
            </Link>
            <Link
              to="/news"
              className="flex items-center space-x-3 px-4 py-3 text-gray-300 hover:bg-gray-800 rounded-lg transition-colors group"
              onClick={() => toggle()}
            >
              <Newspaper className="w-5 h-5 group-hover:text-blue-500 transition-colors" />
              <span className="group-hover:text-blue-500 transition-colors">News</span>
            </Link>
          </nav>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 bg-gray-800 dark:bg-black">
        {/* Header */}
        <header className="sticky top-0 z-40 backdrop-blur-lg bg-gray-900/80 border-b border-gray-800">
          <div className="container mx-auto px-4 h-16 flex items-center justify-between">
            <button
              onClick={toggle}
              className="md:hidden p-2 rounded-lg hover:bg-gray-800 text-gray-300"
              aria-label="Toggle menu"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

            {/* Search bar - hidden on mobile, shown in content instead */}
            <div className="hidden md:flex flex-1 max-w-2xl mx-4">
              <form onSubmit={handleSearch} className="w-full">
                <div className="relative w-full">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="search"
                    name="search"
                    placeholder="Search games..."
                    className="w-full pl-10 pr-4 py-2 bg-gray-800 text-gray-100 rounded-lg border border-gray-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-colors"
                  />
                </div>
              </form>
            </div>

            <div className="flex items-center space-x-4">
              <button
                onClick={toggleTheme}
                className="p-2 rounded-lg hover:bg-gray-800 text-gray-300"
                aria-label="Toggle theme"
              >
                {theme === 'dark' ? <Sun size={24} /> : <Moon size={24} />}
              </button>
            </div>
          </div>
        </header>

        {/* Mobile Search */}
        <div className="md:hidden p-4 bg-gray-900/80 border-b border-gray-800">
          <form onSubmit={handleSearch}>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="search"
                name="search"
                placeholder="Search games..."
                className="w-full pl-10 pr-4 py-2 bg-gray-800 text-gray-100 rounded-lg border border-gray-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-colors"
              />
            </div>
          </form>
        </div>

        {/* Main content */}
        <main className="container mx-auto px-4 py-8">{children}</main>
      </div>
    </div>
  );
}