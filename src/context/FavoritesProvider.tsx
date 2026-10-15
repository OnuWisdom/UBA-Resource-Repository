import {
	useCallback,
	useEffect,
	useMemo,
	useState,
} from 'react';
import type { ReactNode } from 'react';
import {
	getFavoritesService,
	setResourceFavoriteService,
	type FavoriteResource,
} from '../services/queryServices';
import { FavoritesContext } from './FavoritesContext';

export function FavoritesProvider({ children }: { children: ReactNode }) {
	const [favorites, setFavorites] = useState<FavoriteResource[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [loadError, setLoadError] = useState<string | null>(null);
	const [pendingSlugs, setPendingSlugs] = useState<string[]>([]);
	const [errorsBySlug, setErrorsBySlug] = useState<Record<string, string>>({});

	const refreshFavorites = useCallback(async () => {
		setIsLoading(true);
		setLoadError(null);
		try {
			setFavorites(await getFavoritesService());
		} catch (error) {
			setLoadError(
				error instanceof Error ? error.message : 'Unable to load your favorites.',
			);
		} finally {
			setIsLoading(false);
		}
	}, []);

	useEffect(() => {
		void refreshFavorites();
	}, [refreshFavorites]);

	const isFavorite = useCallback(
		(slug: string) => favorites.some((resource) => resource.slug === slug),
		[favorites],
	);

	const toggleFavorite = useCallback(
		async (resource: FavoriteResource) => {
			if (pendingSlugs.includes(resource.slug)) return;
			const shouldFavorite = !favorites.some(
				(item) => item.slug === resource.slug,
			);
			setPendingSlugs((current) => [...current, resource.slug]);
			setErrorsBySlug((current) => {
				const next = { ...current };
				delete next[resource.slug];
				return next;
			});

			try {
				await setResourceFavoriteService(resource.slug, shouldFavorite);
				setFavorites((current) =>
					shouldFavorite
						? [
								resource,
								...current.filter((item) => item.slug !== resource.slug),
							]
						: current.filter((item) => item.slug !== resource.slug),
				);
			} catch (error) {
				setErrorsBySlug((current) => ({
					...current,
					[resource.slug]:
						error instanceof Error
							? error.message
							: 'Unable to update this favorite. Please try again.',
				}));
			} finally {
				setPendingSlugs((current) =>
					current.filter((slug) => slug !== resource.slug),
				);
			}
		},
		[favorites, pendingSlugs],
	);

	const value = useMemo(
		() => ({
			favorites,
			isLoading,
			loadError,
			pendingSlugs,
			errorsBySlug,
			isFavorite,
			toggleFavorite,
			refreshFavorites,
		}),
		[
			errorsBySlug,
			favorites,
			isFavorite,
			isLoading,
			loadError,
			pendingSlugs,
			refreshFavorites,
			toggleFavorite,
		],
	);

	return (
		<FavoritesContext.Provider value={value}>
			{children}
		</FavoritesContext.Provider>
	);
}
