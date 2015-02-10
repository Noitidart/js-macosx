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
Cu.import('resource://gre/modules/devtools/Console.jsm');

Cu.import('resource://gre/modules/ctypes.jsm')
Cu.import('resource://gre/modules/ctypes.jsm')

var mactypesInit = function() {	
	// BASIC TYPES (ones that arent equal to something predefined by me)
	this.SInt32 = ctypes.long;
	this.UInt32 = ctypes.unsigned_long;
	this.SInt16 = ctypes.short;
	
	// ADVANCED TYPES
	this.OSErr = this.SInt16;
	this.OSStatus = this.SInt32;
	this.ProcessApplicationTransformState = this.UInt32;
	
	this. ProcessSerialNumber = new ctypes.StructType('ProcessSerialNumber', [
		{ highLongOfPSN: this.UInt32 },
		{ lowLongOfPSN: this.UInt32 }
	]);
	this.ProcessSerialNumberPtr = this.ProcessSerialNumber.ptr;
	
	// CONSTANTS
	this.kCurrentProcess = 2;
	this.kProcessTransformToForegroundApplication = 1;
}
var ostypes = new mactypesInit();

// start - skeleton, shouldn't have to edit
var lib = {};
function _lib(path) {
	//ensures path is in lib, if its in lib then its open, if its not then it adds it to lib and opens it. returns lib
	//path is path to open library
	//returns lib so can use straight away

	if (!(path in lib)) {
		//need to open the library
		//default it opens the path, but some things are special like libc in mac is different then linux or like x11 needs to be located based on linux version
		switch (path) {
			default:
				try {
					lib[path] = ctypes.open(path);
				} catch (e) {
					console.error('Integration Level 1: Could not get open path:', path, 'e:' + e);
					throw new Error('Integration Level 1: Could not get open path:"' + path + '" e: "' + e + '"');
				}
		}
	}
	return lib[path];
}

var dec = {};
function _dec(declaration) { // it means ensureDeclared and return declare. if its not declared it declares it. else it returns the previously declared.
	if (!(declaration in dec)) {
		dec[declaration] = preDec[declaration](); //if declaration is not in preDec then dev messed up
	}
	return dec[declaration];
}
// end - skeleton, shouldn't have to edit

// start - predefine your declares here
var preDec = { //stands for pre-declare (so its just lazy stuff) //this must be pre-populated by dev // do it alphabateized by key so its ez to look through
	GetCurrentProcess: function() {
		/* https://github.com/philikon/osxtypes/blob/b359c655b39e947d308163994f7cce94ca14d98f/modules/HIServices.jsm#L543
		 */
		return _lib(lib_HIServices).declare('GetCurrentProcess', ctypes.default_abi,
			ostypes.OSErr,						// return
			ostypes.ProcessSerialNumberPtr		// 
		);
	},
	SetFrontProcess: function() {
		/* https://github.com/philikon/osxtypes/blob/b359c655b39e947d308163994f7cce94ca14d98f/modules/HIServices.jsm#L543
		 */
		return _lib(lib_HIServices).declare('SetFrontProcess', ctypes.default_abi,
			ostypes.OSErr,						// return
			ostypes.ProcessSerialNumberPtr		// 
		);
	},
	TransformProcessType: function() {
		/* https://github.com/philikon/osxtypes/blob/b359c655b39e947d308163994f7cce94ca14d98f/modules/HIServices.jsm#L557
		 */
		return _lib(lib_HIServices).declare('TransformProcessType', ctypes.default_abi,
			ostypes.OSStatus,							// return
			ostypes.ProcessSerialNumberPtr,				// 
			ostypes.ProcessApplicationTransformState	// 
		);
	}
}
// end - predefine your declares here

// start - helper functions

// end - helper functions

function shutdown() {
	// do in here what you want to do before shutdown
	
	for (var l in lib) {
		lib[l].close();
	}
}

// my globals
var lib_HIServices = '/System/Library/Frameworks/ApplicationServices.framework/Frameworks/HIServices.framework/HIServices';
var lib_CoreFoundation = '/System/Library/Frameworks/CoreFoundation.framework/CoreFoundation';

function main() {
	//do code here

	var psn = ostypes.ProcessSerialNumber(0, ostypes.kCurrentProcess);
	console.info('psn:', psn, psn.toString, uneval(psn));

	var rez_GetCurrentProcess = _dec('GetCurrentProcess')(psn.address());
	console.info('rez_GetCurrentProcess:', rez_GetCurrentProcess, rez_GetCurrentProcess.toString(), uneval(rez_GetCurrentProcess));
	
	console.info('psn:', psn, psn.toString, uneval(psn));
	
	var rez_TransformProcessType = _dec('TransformProcessType')(psn.address(), ostypes.kProcessTransformToForegroundApplication);
	console.info('rez_TransformProcessType:', rez_TransformProcessType, rez_TransformProcessType.toString(), uneval(rez_TransformProcessType));
	/*
	if (rez_ShowWindow == true) {
		console.log('window succesfully hidden');
	} else if (rez_ShowWindow == false) {
		console.warn('window failed to hide, it may already be hidden');
	} else {
		throw new Error('ShowWindow returned not false or true, this should never happen, if it did it should crash');
	}
	*/
	var rez_SetFrontProcess = _dec('SetFrontProcess')(psn.address());
	console.info('rez_SetFrontProcess:', rez_SetFrontProcess, rez_SetFrontProcess.toString(), uneval(rez_SetFrontProcess));
}

try {
	main();
} catch(ex) {
	console.error('caught:', ex);
} finally {
	shutdown();
}

function install() {}
function uninstall() {}

function startup() {

}
 
function shutdown() {
	for (var l in lib) {
		lib[l].close();
	}	
}
