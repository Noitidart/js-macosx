const {classes: Cc, interfaces: Ci, utils: Cu} = Components;
const self = {
	name: 'js-macosx',
	id: 'js-macosx@jetpack',
	packagename: 'js-macosx',
	path: {
		content: 'chrome://js-macosx/content/',
		modules: 'chrome://js-macosx/content/modules/'
	},
	aData: 0
};
Cu.import('resource://gre/modules/Services.jsm');

function install() {}
function uninstall() {}

function startup() {
	Cu.import(self.path.modules + 'macosx.js');
	// can now do stuff with macosx library
}
 
function shutdown() {
	Cu.unload(self.path.modules + 'macosx.js');
}
