import { loadPhoto } from '../../../adapters/inbound/Loaders';
import { photoBrowser } from '../../../services';

export const load = loadPhoto(photoBrowser);
