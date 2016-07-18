module.exports = function(grunt) {
	grunt.initConfig({
		pkg: grunt.file.readJSON("package.json"),
		browserify: {
			dist: {
				files: {
					"html/bundle.js": ["html/main.js"],
					"html/bundle_minimax.js": ["html/minimax.js"]
				}
			}
		}
	});
	grunt.loadNpmTasks("grunt-browserify");
	grunt.registerTask("default", ["browserify"]);
};
