import { gateway } from '../adapters';
import PhotoBrowser from './PhotoBrowser';

/**
 * Service injection for Photo Browser utility class.
 */
export const browser = new PhotoBrowser(gateway);
