import { describe, expect, test } from 'vitest';
import * as Group from './Group';
import type { Photo } from './Photo';

describe('Grouping', () => {
	test('does not group an empty collection', () => {
		const grouper = Group.byKey<unknown>(() => '');

		expect(grouper([])).toStrictEqual({});
	});

	test('groups a collection with single photo by album ID', () => {
		const collection: Photo[] = [
			{
				id: 1,
				albumId: 5,
				title: 'Photo 1',
				url: new URL('https://via.placeholder.com/600/92c952'),
				thumbnailUrl: new URL('https://via.placeholder.com/150/92c952')
			}
		];
		const grouper = Group.byKey<Photo>((photo) => photo.albumId);

		expect(grouper(collection)).toStrictEqual({ 5: collection });
	});

	test('groups a collection with multiple photos by album ID', () => {
		const collection: Photo[] = [
			{
				id: 1,
				albumId: 5,
				title: 'Photo 1',
				url: new URL('https://via.placeholder.com/600/92c952'),
				thumbnailUrl: new URL('https://via.placeholder.com/150/92c952')
			},
			{
				id: 3,
				albumId: 6,
				title: 'Photo 3',
				url: new URL('https://via.placeholder.com/600/24f355'),
				thumbnailUrl: new URL('https://via.placeholder.com/150/24f355')
			},
			{
				id: 2,
				albumId: 5,
				title: 'Photo 2',
				url: new URL('https://via.placeholder.com/600/771796'),
				thumbnailUrl: new URL('https://via.placeholder.com/150/771796')
			},
			{
				id: 4,
				albumId: 6,
				title: 'Photo 4',
				url: new URL('https://via.placeholder.com/600/d32776'),
				thumbnailUrl: new URL('https://via.placeholder.com/150/d32776')
			}
		];
		const grouper = Group.byKey<Photo>((photo) => photo.albumId);

		expect(grouper(collection)).toStrictEqual({
			5: [collection[0], collection[2]],
			6: [collection[1], collection[3]]
		});
	});
});
