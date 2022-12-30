import { loadPhotos } from '../adapters/inbound/Loaders';
import { APIGateway } from '../adapters/outbound/Gateway';

export const load = loadPhotos(new APIGateway());
