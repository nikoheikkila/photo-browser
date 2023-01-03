import { error } from '@sveltejs/kit';

export const parseNumericParameter = (numeric: string, errorMessage: string): number => {
	const value = Number.parseInt(numeric, 10);

	if (Number.isNaN(value)) {
		throw error(400, errorMessage);
	}

	return value;
};
