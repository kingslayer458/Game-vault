import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { Layout } from './components/Layout';
import { Home } from './pages/Home';
import { GameDetails } from './pages/GameDetails';
import { Search } from './pages/Search';
import { TopRated } from './pages/TopRated';
import { Upcoming } from './pages/Upcoming';
import { Wishlist } from './pages/Wishlist';
import { Events } from './pages/Events';
import { GameNews } from './pages/GameNews';
import { useThemeStore } from './stores/theme';
import { Analytics } from '@vercel/analytics/react';

const queryClient = new QueryClient();

function App() {
  const { theme } = useThemeStore();

  return (
    <div className={theme}>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-50 transition-colors duration-200">
        <QueryClientProvider client={queryClient}>
          <Router>
            <Layout>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/game/:id" element={<GameDetails />} />
                <Route path="/search" element={<Search />} />
                <Route path="/top-rated" element={<TopRated />} />
                <Route path="/upcoming" element={<Upcoming />} />
                <Route path="/wishlist" element={<Wishlist />} />
                <Route path="/events" element={<Events />} />
                <Route path="/news" element={<GameNews />} />
              </Routes>
            </Layout>
          </Router>
          <Toaster position="bottom-right" />
        </QueryClientProvider>
        <Analytics />
      </div>
    </div>
  );
}

export default App;