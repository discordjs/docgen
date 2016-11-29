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
		 * @type {?number}
		 */
		this.thing = 42;
	}

	/**
	 * Does stuff.
	 * @param {?string} stuff Stuff to do
	 * @returns {?number} A thing
	 */
	doStuff(stuff) {
		console.log(`Doing some pretty crazy stuff with ${stuff}`);
		return this.thing;
	}

	/**
	 * Who knows what this does.
	 * @emits ClassyClass#thingDone
	 */
	hmm() {
		console.log('Hmmmm..');

		/**
		 * Emitted when a thing is done
		 * @event ClassyClass#thingDone
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
  * @external ClientOptions
  * @see {@link http://hydrabolt.github.io/discord.js/#!/docs/tag/master/typedef/ClientOptions}
  */

/**
 * Oh boy, an export!
 * @type {function}
 */
module.exports = ClassyClass;
