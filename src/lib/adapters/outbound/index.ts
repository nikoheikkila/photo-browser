import { PUBLIC_PHOTO_API_URL } from '$env/static/public';
import { APIGateway } from './Gateway';

/**
 * Service injection for the outgoing API gateway adapter.
 */
export const gateway = new APIGateway(PUBLIC_PHOTO_API_URL);
