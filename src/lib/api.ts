import axios from 'axios';

const API_KEY = 'fa828279e28f467ca7d0690f4326d64e';
const BASE_URL = 'https://api.rawg.io/api';

export const api = axios.create({
  baseURL: BASE_URL,
  params: {
    key: API_KEY,
  },
});

// Enhanced Game interface with more details
export interface Game {
  id: number;
  name: string;
  background_image: string;
  rating: number;
  metacritic: number;
  released: string;
  updated: string;
  website: string;
  reddit_url: string;
  reddit_name: string;
  reddit_description: string;
  reddit_count: number;
  twitch_count: number;
  youtube_count: number;
  reviews_count: number;
  ratings_count: number;
  suggestions_count: number;
  alternative_names: string[];
  metacritic_url: string;
  parents_count: number;
  additions_count: number;
  game_series_count: number;
  esrb_rating: {
    id: number;
    name: string;
    slug: string;
  };
  genres: Array<{ id: number; name: string; slug: string }>;
  platforms: Array<{ 
    platform: { 
      id: number; 
      name: string;
      slug: string;
      requirements?: {
        minimum?: string;
        recommended?: string;
      };
    };
    requirements_en?: {
      minimum?: string;
      recommended?: string;
    };
  }>;
  developers: Array<{
    id: number;
    name: string;
    slug: string;
    games_count: number;
    image_background: string;
  }>;
  publishers: Array<{
    id: number;
    name: string;
    slug: string;
    games_count: number;
    image_background: string;
  }>;
  tags: Array<{
    id: number;
    name: string;
    slug: string;
    language: string;
    games_count: number;
    image_background: string;
  }>;
  clip?: {
    clip: string;
    clips: {
      320: string;
      640: string;
      full: string;
    };
  };
}

export interface Screenshot {
  id: number;
  image: string;
  width: number;
  height: number;
  is_deleted: boolean;
}

export interface DLC {
  id: number;
  name: string;
  background_image: string;
  description: string;
  released: string;
  price?: number;
}

export interface Achievement {
  id: number;
  name: string;
  description: string;
  image: string;
  percent: number;
}

export interface Store {
  id: number;
  url: string;
  store: {
    id: number;
    name: string;
    domain: string;
    slug: string;
    games_count: number;
    image_background: string;
  };
}

export interface GameDetails extends Game {
  description_raw: string;
  description: string;
  achievements: Achievement[];
  dlc: DLC[];
  similar_games: Game[];
  playtime: number;
  player_count?: number;
}

export interface GameNews {
  id: number;
  title: string;
  description: string;
  image: string;
  website: string;
  published: string;
}

export interface GameReview {
  id: string;
  user: {
    id: number;
    username: string;
    avatar: string;
  };
  rating: number;
  text: string;
  created: string;
  likes_count: number;
  likes_rating: number;
}

export interface GameCreator {
  id: number;
  name: string;
  slug: string;
  image: string;
  image_background: string;
  games_count: number;
  positions: Array<{
    id: number;
    name: string;
    slug: string;
  }>;
  games: Game[];
}

export async function getGames(params?: Record<string, any>) {
  const { data } = await api.get<{ results: Game[] }>('/games', { params });
  return data.results;
}

export async function getGameDetails(id: string) {
  const [
    gameResponse,
    screenshotsResponse,
    additionsResponse,
    gameSeriesResponse,
    storesResponse,
    creatorsResponse,
  ] = await Promise.all([
    api.get<GameDetails>(`/games/${id}`),
    api.get<{ results: Screenshot[] }>(`/games/${id}/screenshots`),
    api.get<{ results: DLC[] }>(`/games/${id}/additions`),
    api.get<{ results: Game[] }>(`/games/${id}/game-series`),
    api.get<{ results: Store[] }>(`/games/${id}/stores`),
    api.get<{ results: GameCreator[] }>(`/games/${id}/development-team`),
  ]);

  // Get similar games based on tags and genres
  const similarGamesResponse = await api.get<{ results: Game[] }>('/games', {
    params: {
      genres: gameResponse.data.genres.map(g => g.id).join(','),
      exclude_additions: true,
      page_size: 4,
    },
  });

  return {
    ...gameResponse.data,
    screenshots: screenshotsResponse.data.results,
    dlc: additionsResponse.data.results,
    game_series: gameSeriesResponse.data.results,
    stores: storesResponse.data.results,
    creators: creatorsResponse.data.results,
    similar_games: similarGamesResponse.data.results.filter(g => g.id !== parseInt(id)),
  };
}

export async function searchGames(query: string) {
  const { data } = await api.get<{ results: Game[] }>('/games', {
    params: { search: query },
  });
  return data.results;
}

export async function getTopRatedGames() {
  const { data } = await api.get<{ results: Game[] }>('/games', {
    params: {
      ordering: '-rating',
      metacritic: '80,100',
    },
  });
  return data.results;
}

export async function getUpcomingGames() {
  const today = new Date().toISOString().split('T')[0];
  const nextYear = new Date();
  nextYear.setFullYear(nextYear.getFullYear() + 1);
  
  const { data } = await api.get<{ results: Game[] }>('/games', {
    params: {
      dates: `${today},${nextYear.toISOString().split('T')[0]}`,
      ordering: '-added',
    },
  });
  return data.results;
}

export interface GameNewsResponse {
  results: GameNews[];
  next: string | null;
}

export async function getGameNews(page = 1): Promise<GameNewsResponse> {
  const { data } = await api.get<{ results: Game[] }>('/games', {
    params: {
      ordering: '-updated',
      page_size: 10,
      page,
    },
  });

  const news = await Promise.all(
    data.results.map(async (game) => {
      const details = await getGameDetails(game.id.toString());
      return {
        id: game.id,
        title: `${game.name} - Latest Updates`,
        description: details.description_raw.slice(0, 200) + '...',
        image: game.background_image,
        website: details.website,
        published: new Date().toISOString(),
      };
    })
  );

  return {
    results: news,
    next: page * 10 < 50 ? String(page + 1) : null, // Limit to 5 pages total
  };
}

export async function getGamingEvents() {
  const today = new Date();
  const threeMonthsFromNow = new Date();
  threeMonthsFromNow.setMonth(threeMonthsFromNow.getMonth() + 3);

  const { data } = await api.get<{ results: Game[] }>('/games', {
    params: {
      dates: `${today.toISOString().split('T')[0]},${threeMonthsFromNow.toISOString().split('T')[0]}`,
      ordering: 'released',
      page_size: 10,
    },
  });

  return data.results.map(game => ({
    id: game.id,
    title: `${game.name} Launch Event`,
    description: `Get ready for the launch of ${game.name}! Join the gaming community in celebrating this highly anticipated release.`,
    start_date: game.released,
    end_date: game.released,
    location: 'Global Release',
    type: 'release' as const,
    image_url: game.background_image,
  }));
}

// New API functions for additional features
export async function getGamesByTag(tag: string) {
  const { data } = await api.get<{ results: Game[] }>('/games', {
    params: {
      tags: tag,
      page_size: 20,
    },
  });
  return data.results;
}

export async function getGamesByDeveloper(developerId: number) {
  const { data } = await api.get<{ results: Game[] }>('/games', {
    params: {
      developers: developerId,
      page_size: 20,
    },
  });
  return data.results;
}

export async function getGamesByPublisher(publisherId: number) {
  const { data } = await api.get<{ results: Game[] }>('/games', {
    params: {
      publishers: publisherId,
      page_size: 20,
    },
  });
  return data.results;
}

export async function getTrendingGames() {
  const lastMonth = new Date();
  lastMonth.setMonth(lastMonth.getMonth() - 1);
  
  const { data } = await api.get<{ results: Game[] }>('/games', {
    params: {
      dates: `${lastMonth.toISOString().split('T')[0]},${new Date().toISOString().split('T')[0]}`,
      ordering: '-added',
      page_size: 20,
    },
  });
  return data.results;
}

export async function getMostAnticipatedGames() {
  const today = new Date();
  const nextYear = new Date();
  nextYear.setFullYear(nextYear.getFullYear() + 1);
  
  const { data } = await api.get<{ results: Game[] }>('/games', {
    params: {
      dates: `${today.toISOString().split('T')[0]},${nextYear.toISOString().split('T')[0]}`,
      ordering: '-added',
      page_size: 20,
    },
  });
  return data.results;
}

export async function getGamesByPlatform(platformId: number) {
  const { data } = await api.get<{ results: Game[] }>('/games', {
    params: {
      platforms: platformId,
      page_size: 20,
    },
  });
  return data.results;
}

export async function getGamesByGenre(genreId: number) {
  const { data } = await api.get<{ results: Game[] }>('/games', {
    params: {
      genres: genreId,
      page_size: 20,
    },
  });
  return data.results;
}