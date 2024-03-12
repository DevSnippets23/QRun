export class ParamsStorage extends Set {
	get values() {
		return Array.from(super.values());
	}

	/** @returns {any} any value */
	deleteFirst() {
		if (this.size) {
			const value = this.values[0];
			this.delete(value);
			return value;
		}
	}
}
