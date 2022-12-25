export type FetchPhotosArgs = {
	limit: number;
};

export interface PhotoGateway {
	fetchPhotos(args: FetchPhotosArgs): Promise<string>;
}
