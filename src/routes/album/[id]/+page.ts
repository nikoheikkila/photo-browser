import { loadAlbum } from '../../../adapters/inbound/Loaders';
import { APIGateway } from '../../../adapters/outbound/Gateway';

export const load = loadAlbum(new APIGateway());
