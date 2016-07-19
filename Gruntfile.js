// Tip: When developing, use the following commands to auto-compile the scripts when a change is detected.
//
// $ watchify html/main.js -o html/bundle.js -v &
// $ watchify html/minimax.js -o html/bundle_minimax.js -v &

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
		},
		babel: {
			options: {
				sourceMap: false,
				presets: ["es2015"],
				compact: false
			},
			dist: {
				files: {
					"html/bundle.js": "html/bundle.js",
					"html/bundle_minimax.js": "html/bundle_minimax.js"
				}
			}
		},
		uglify: {
			options: {
				mangle: false,
				sourceMap: false,
				compress: {
					dead_code: true
				},
				beautify: {
					beautify: true
				}
			},
			dist: {
				files: {
					"html/bundle.js": ["html/bundle.js"],
					"html/bundle_minimax.js": ["html/bundle_minimax.js"]
				}
			}
		}
	});
	grunt.loadNpmTasks("grunt-browserify");
	grunt.loadNpmTasks("grunt-babel");
	grunt.loadNpmTasks("grunt-contrib-uglify");
	grunt.registerTask("default", ["browserify", "babel", "uglify"]);
};
