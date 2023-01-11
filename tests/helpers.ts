import { faker } from '@faker-js/faker';
import type { Photo } from '$lib/domain/Photo';

export const randomPayload = (extra: Dictionary = {}) => ({
	id: faker.datatype.number({ min: 1 }),
	albumId: faker.datatype.number({ min: 1 }),
	title: faker.lorem.sentence(),
	url: faker.internet.url().concat('/'),
	thumbnailUrl: faker.internet.url().concat('/'),
	...extra
});

export const randomPhoto = (extra: Dictionary = {}): Photo => ({
	...randomPayload(),
	url: new URL(faker.internet.url()),
	thumbnailUrl: new URL(faker.internet.url()),
	...extra
});
