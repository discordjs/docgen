class SomeClass {
	/**
	 * Constructs a thing.
	 */
	constructor() {
		/**
		 * Just some thing
		 * @type {number}
		 */
		this.thing = 42;
	}

	/**
	 * Does stuff.
	 * @param {?string} stuff Stuff to do
	 */
	doStuff(stuff) {
		console.log(`Doing some pretty crazy stuff with ${stuff}`);
	}
}

/**
 * Oh boy, an export!
 * @type {function}
 */
module.exports = SomeClass;
