import { env as publicEnv } from '$env/dynamic/public';

export const getPublicVariable = (key: keyof typeof publicEnv): string => {
	const value = publicEnv[key];

	if (!value || value.length === 0) {
		throw new Error(`Missing environment variable: ${key}`);
	}

	return value;
};
