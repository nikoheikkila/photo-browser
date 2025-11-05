type Key = string | number | symbol;
type Getter<T> = (item: T) => Key;

export const groupByKey =
	<T>(key: Getter<T>) =>
	(collection: T[]) =>
		collection.reduce(reducer(key), {});

const reducer =
	<T>(key: Getter<T>) =>
	(groups: Record<Key, T[]>, item: T) => {
		const groupKey = key(item);

		if (!groups[groupKey]) {
			groups[groupKey] = [];
		}

		groups[groupKey].push(item);

		return groups;
	};
