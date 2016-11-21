class DocumentedItem {
	constructor(parent, info) {
		this.parent = parent;
		this.directData = null;
		this.registerMetaInfo(info);
	}

	registerMetaInfo() {
		return;
	}

	serialize() {
		return;
	}
}

module.exports = DocumentedItem;
