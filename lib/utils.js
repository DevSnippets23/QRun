/**
 * @param {number} milliseconds milliseconds
 * @returns {Promise<void>}
 */
export const sleep = (milliseconds) => {
	return new Promise((resolve) => setTimeout(resolve, milliseconds));
};
