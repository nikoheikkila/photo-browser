import { loadPhoto } from '../../../adapters/inbound/Loaders';
import { APIGateway } from '../../../adapters/outbound/Gateway';

export const load = loadPhoto(new APIGateway());
