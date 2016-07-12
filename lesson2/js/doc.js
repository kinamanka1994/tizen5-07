window.onload = function() {
	// TODO:: Do your initialization job

	// add eventListener for tizenhwkey
	document.addEventListener('tizenhwkey', function(e) {
		if (e.keyName === "back") {
			try {
				tizen.application.getCurrentApplication().exit();
			} catch (ignore) {
			}
		}
		ашд
	});
};
var documentsDir;
var filename = "test";

function writeTestFile() {
	
	var dir = tizen.filesystem;

	function onsuccess(files) {
		for (var i = 0; i < files.length; i++) {
			console.log("File name is " + files[i].name);
		}
		var testFile = documentsDir.createFile(filename);
		if (testFile != null) {
			testFile.openStream("w", function(fs) {
				fs.write("HELLO");
				fs.close();
			}, function(e) {
				console.log("Error " + e.message);
			}, "UTF-8");
		}
	}
	function onerror(error) {
		console.log("The error " + error.message
				+ " occured when listing the files in the selected folder");
	}

	tizen.filesystem.resolve('documents', function(dir) {
		documentsDir = dir;
		dir.listFiles(onsuccess, onerror);
	}, function(e) {
		console.log("Error " + e.message);
	}, "rw");
}

function displayFileContentsText() {
	var file;
	try {
		file = documentsDir.resolve(filename);
		console.log('File size: ' + file.fileSize);
	} catch (exc) {
		console.log('Could not resolve file: ' + exc.message);
		// Stop in case of any errors
		return;
	}

	try {
		file.readAsText(
		function(contents) {
			console.log('File contents:' + contents + '; filename: ' + filename);
		},

		function(c){
			console.log(e + " error")
		});
	} catch (exc) {
		console.log('readAsText() exception:' + exc.message + '	');
	}
}



function deleteTestFile() {
	 
	function onsuccess(files) {
		   for (var i = 0; i < files.length; i++) {
		     if (!files[i].isDirectory) {
		       documentsDir.deleteFile(
		           files[i].fullPath,
		           function() {
		             console.log("File Deleted");
		           }, function(e) {
		             console.log("Error" + e.message);
		           });
		     }
		   }
		 }

		 function onerror(error) {
		   console.log("The error " + error.message + " occurred when listing the files in the selected folder");
		 }

		 var documentsDir;
		 tizen.filesystem.resolve(
		   'documents',
		   function(dir) {
		     documentsDir = dir;
		     dir.listFiles(onsuccess,onerror);
		   }, function(e) {
		     console.log("Error" + e.message);
		   }, "rw"
		 ); 
	
	
}