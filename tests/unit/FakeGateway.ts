import type { FetchParams, PhotoGateway } from '$lib/adapters/Gateway';
import { faker } from '@faker-js/faker';

export class FakeGateway implements PhotoGateway {
	private stubs: Dictionary[] = [];
	private error: Error | null = null;

	private stubPhoto(): Dictionary {
		return {
			id: faker.datatype.number({ min: 1 }),
			albumId: faker.datatype.number({ min: 1 }),
			title: faker.lorem.sentence(),
			url: faker.internet.url(),
			thumbnailUrl: faker.internet.url()
		};
	}

	public feedWith(stubs: Dictionary[]) {
		this.stubs = stubs;
	}

	public setError(error: Error) {
		this.error = error;
	}

	public async fetchPhotos(params: FetchParams): Promise<Dictionary[]> {
		if (this.error) throw this.error;
		if (this.stubs.length > 0) return this.stubs;

		const { _limit: limit } = params;

		return Array.from({ length: limit }, (_, index) => {
			return {
				...this.stubPhoto(),
				id: index + 1
			};
		});
	}

	public async fetchPhoto(id: number): Promise<Dictionary> {
		if (this.error) throw this.error;
		if (this.stubs.length > 0) return this.stubs[0];

		return {
			...this.stubPhoto(),
			id
		};
	}

	public async fetchPhotosByAlbumId(albumId: number, params: FetchParams): Promise<Dictionary[]> {
		if (this.error) throw this.error;
		if (this.stubs.length > 0) return this.stubs;

		const { _limit: limit } = params;

		return Array.from({ length: limit }, (_, index) => {
			return {
				...this.stubPhoto(),
				id: index + 1,
				albumId
			};
		});
	}
}
