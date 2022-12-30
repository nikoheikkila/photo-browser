import PhotoBrowser from './PhotoBrowser';
import { apiGateway } from '../adapters/outbound';

export const photoBrowser = new PhotoBrowser(apiGateway);
