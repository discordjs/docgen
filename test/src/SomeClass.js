const EventEmitter = require('events').EventEmitter;

/**
 * A very classy class with lots of class
 * @extends EventEmitter
 */
class ClassyClass extends EventEmitter {
	/**
	 * Constructs a thing.
	 */
	constructor() {
		super();

		/**
		 * Just some thing
		 * @type {number}
		 */
		this.thing = 42;
	}

	/**
	 * Does stuff.
	 * @param {?string} stuff Stuff to do
	 * @returns {number} A thing
	 */
	doStuff(stuff) {
		console.log(`Doing some pretty crazy stuff with ${stuff}`);
		return this.thing;
	}

	/**
	 * Who knows what this does.
	 */
	hmm() {
		console.log('Hmmmm..');

		/**
		 * Emitted when a thing is done
		 * @event SomeClass#thingDone
		 * @param {SomeThing} thingy Thing
		 */
		this.emit('thingDone', 4242424242);
	}
}

/**
 * Just some thing
 * @typedef {Object} SomeThing
 * @property {number} someNumber A really cool number
 */

/**
 * Oh boy, an export!
 * @type {function}
 */
module.exports = ClassyClass;
