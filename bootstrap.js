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
Cu.import('resource://gre/modules/osfile.jsm'); //used by test_setApplicationIconImage
Cu.import('resource://gre/modules/ctypes.jsm'); //used by test_setApplicationIconImage

function install() {}
function uninstall() {}

function test_setApplicationIconImage() {
	//needs Cu.import('resource://gre/modules/osfile.jsm');
	//needs Cu.import('resource://gre/modules/ctypes.jsm');
	let IMAGE_PATH = OS.Path.join(OS.Constants.Path.desktopDir, 'nightly.icns');

	OS.File.read(IMAGE_PATH).then(function(iconData) {
		// NOTE: iconData is Uint8Array
		let length = ctypes.unsigned_long(iconData.length);
		let bytes = ctypes.uint8_t.array()(iconData);
		
		with (macosx) {
			importFramework('CoreFoundation', false); 
			importFramework('Foundation', false);
			importFramework('AppKit', false);
			let NSApp = NSApplication.sharedApplication();
			let data = NSData.msgSend({dataWithBytes: bytes, length: length});
			let icon = NSImage.alloc().initWithData(data);
			if (icon.isNull()) {
					throw new Error('Image file is corrupted.');
			}
			NSApp.setApplicationIconImage(icon);
			icon.release();
		}
	}, function(e) {
	  console.log("Failed to read from file:", e);
	}).catch(function(e) {
	  console.log(e);
	});
}

function startup() {
	Cu.import(self.path.modules + 'macosx.js');
	// can now do stuff with macosx library
	test_setApplicationIconImage();
}
 
function shutdown() {
	Cu.unload(self.path.modules + 'macosx.js');
}