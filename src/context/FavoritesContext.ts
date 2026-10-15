import { createContext } from 'react';
import type { FavoriteResource } from '../services/queryServices';

export interface FavoritesContextValue {
	favorites: FavoriteResource[];
	isLoading: boolean;
	loadError: string | null;
	pendingSlugs: string[];
	errorsBySlug: Record<string, string>;
	isFavorite: (slug: string) => boolean;
	toggleFavorite: (resource: FavoriteResource) => Promise<void>;
	refreshFavorites: () => Promise<void>;
}

export const FavoritesContext =
	createContext<FavoritesContextValue | null>(null);
