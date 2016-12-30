class DocumentedItem {
	constructor(parent, info) {
		this.parent = parent;
		this.directData = null;

		try {
			this.registerMetaInfo(info);
		} catch(err) {
			err.message = `Error while loading ${
				info && info.id ? `${info.id} (${this.constructor.name})` : this.constructor.name
			}: ${err.message}`;
			throw err;
		}
	}

	registerMetaInfo() {
		return;
	}

	serialize() {
		return;
	}
}

module.exports = DocumentedItem;
