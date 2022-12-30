import { loadPhotos } from '../adapters/inbound/Loaders';
import { photoBrowser } from '../services';

export const load = loadPhotos(photoBrowser);
