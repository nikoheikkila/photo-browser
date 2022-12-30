import { loadAlbum } from '../../../adapters/inbound/Loaders';
import { photoBrowser } from '../../../services';

export const load = loadAlbum(photoBrowser);
