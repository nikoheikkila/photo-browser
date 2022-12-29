type Handler = (error: unknown) => void;

export const handleError: Handler = (error) => {
	/** In a real application, this would include also a call to an
	 * error reporting service such as Sentry.
	 **/
	error instanceof Error ? console.error(error) : console.error(String(error));
};
