import { writable } from 'svelte/store';
import type { Photo } from '../domain/Photo';
import PhotoBrowser from '../services/PhotoBrowser';
import { APIGateway } from '../adapters/Gateway';

interface PhotoState {
	data: Photo[];
	loading: boolean;
	error: Error | null;
}

const initialState: PhotoState = {
	data: [],
	loading: false,
	error: null
};

const browser = new PhotoBrowser(new APIGateway());

const createPhotoStore = () => {
	const { subscribe, set, update } = writable<PhotoState>(initialState);

	return {
		subscribe,
		async load(limit: number) {
			update((state) => ({ ...state, loading: true }));

			try {
				const photos = await browser.withLimit(limit).loadPhotos();

				set({
					data: photos,
					loading: false,
					error: null
				});
			} catch (error: unknown) {
				update((state) => ({
					...state,
					loading: false,
					error: error as Error
				}));
			}
		}
	};
};

export const photoStore = createPhotoStore();
