module.exports = function(grunt) {

	// Project configuration.
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),


		/* grab the Bootstrap js and combine it with my custom scripts
		The goal is to limit the number of http requests to increase load time
		 */
		// JS Concatenation Plugin 
		concat: {
			options: {
				stripBanners: false,
				sourceMap: true,
				banner: '',
			},
			scripts: {
				src: ['bower_components/bootstrap-sass/assets/javascripts/bootstrap.min.js', 'js/plugins.js', 'js/main.js'],
				dest: 'dist/js/scripts.js',
			},
		},

		// JS Minification 
		uglify: {
			defer: {
				src: ['js/defer.js'], //input
				dest: 'dist/js/defer.min.js' //output
			},
			scripts: {
				src: ['dist/js/scripts.js'], //input
				dest: 'dist/js/scripts.min.js' //output
			},
		},


		// Sass to CSS
		sass: {
			dist: {
				files: {
					'dist/css/main.css': 'sass/globals.scss' // this is our main scss file
				}
			},
			options: {
				compass: true,
				style: 'compressed',
				sourceMap: true
			}
		},

		// Post CSS (autoprefixer, mqpacker, cssnano) 
		postcss: {
			options: {
				map: true,
				// Load plugins 
				processors: [
					require('autoprefixer')({browsers: ['last 1 version']}),// Runs Post CSS Autoprefixer 
					//require('postcss-flexbugs-fixes'),
				]
			},
			dist: { 
      		src: 'dist/css/main.css', 
      		dest: 'dist/css/prefixedpostcss-main.min.css' 
     		}
		},


		/* Auto Update the scripts and styles when working */
		watch: {
			grunt: { files: ['Gruntfile.js'] },
			js: {
				files: ['js/*.js'],
				tasks: ['jshint', 'concat', 'uglify'],
				options: {
					spawn: false,
				},
			},
			sass: {
				files: ['sass/**/*.scss'],
				tasks: ['sass', 'postcss'],
				options: {
					spawn: false,
				},
			},
			options: {
				livereload: false,
				spawn: false
			}
		},


		browserSync: {
		  dev: {
			 bsFiles: {
				src: [
				  'sass/*.scss',
				  'js/*.js',
				  '*.html',
				  'templates/*.html'
				]
			 },
		options: {
				watchTask: true,
				server: './'
			 }
		  }
		},


		htmlbuild: {
		  dist: {
			src: 'src/index.html',
			dest: 'dist/',
			options: {
			  beautify: true,
			  relative: true,
			  basePath: false,
		  sections: {
				layout: {
				  header: 'templates/header.html',
				  footer: 'templates/footer.html'
				}
			  },
			}
		  }
		},

		imagemin: {
			dynamic: {
				files: [{
					expand: true,
					cwd: 'img/',
					src: ['**/*.{png,jpg,gif}'],
					dest: 'dist/img/build/'
				 }]
			}
		},

		jshint: {
			files: {
			  src: ['*.js', 'js/*.js']
			},
			options: {
				'curly': true,
				'eqeqeq': true,
				'eqnull': true,
				'immed': true,
				'noarg': true,
				'quotmark': 'single',
				'trailing': true,
				'undef': true,
				'unused': false,

				'node': true,
				'jquery': true,
				'browser': true,
				'devel': true,
			}
		},

	});
	// END GRUNT


	// Load the plugins
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-sass');
	grunt.loadNpmTasks('grunt-contrib-imagemin');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-sass');
	//grunt.loadNpmTasks('grunt-autoprefixer');
	grunt.loadNpmTasks('grunt-postcss');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-browser-sync');
	grunt.loadNpmTasks('grunt-html-build');
	grunt.loadNpmTasks('grunt-notify');


	// Default task(s).
	//grunt.registerTask('dev', ['browserSync', 'watch']);
	//grunt.registerTask('css', ['sass', 'postcss', 'autoprefixer', 'imagein']);
	//grunt.registerTask('js', ['jshint', 'concat', 'uglify']);
	//grunt.registerTask('default', ['dev', 'css', 'js', 'notify']);
	grunt.registerTask('default', ['sass', 'postcss:dist', 'concat', 'uglify', 'browserSync', 'watch']);

};