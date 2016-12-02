/************************************/
/* 			  Variables				*/
/************************************/

/*
 * Gulp Libraries
 * ...
 */	
	var gulp = require('gulp'),
	del = require('del'),
	browsersync = require('browser-sync'),

	imagemin = require('gulp-imagemin'),
	newer = require('gulp-newer'),
	imacss = require('gulp-imacss'),	

	njk = require('gulp-nunjucks'),

	sass = require('gulp-sass'),
	pleeease = require('gulp-pleeease'),
	compass = require ('gulp-compass'),

	jshint = require('gulp-jshint'),
	concat = require('gulp-concat'),
	htmlclean = require('gulp-htmlclean'),
	stripdebug = require('gulp-strip-debug'),
	uglify = require('gulp-uglify'),

/*
 * Soruce and Destination Folders
 * ...
 */
    source = 'source/',
	destination = 'build/',


/*
 * Options List
 * ...
 */
 	sassOptions = {
 		errToLogConsole: true,
 		precision: 4,
 		outputStyle: 'expanded',
 		sourceComments: true,
 		indentWidth: 4
 	},

 	pleeeaseOptions = {
 		autoprefixer: {
 			browsers: ['> 2%','last 2 versions'], 
 			cascade: false
 		},
 		pseudoElements: true,
 		mqpacker: true,
 		opacity: true
 	},

 	browsersyncOptions = {
 		server: {
 			baseDir: destination,
 			index: 'index.html'
 		},
 		open: true,
 		notify: true
 	},

 	compassOptions	= {
		css: 'build/css',
		sass: 'source/sass',
		image: 'source/images'
	},


/*
 * Source and Destination Assets
 * ...
 */
	html = {
		in: source + '**.html',
		out: destination
	},

	styles = {
		in: source + 'sass/*.scss',
		out: destination + 'css/'
	},

	scripts = {
		in: [
			//add path of any bower component here
			source + 'js/*.js',
			source + 'js/**/*.js'
		],
		out: destination + 'js/',
		filename: 'main.js'
	},

	images = {
		in: [source + 'images/*.*', source + 'images/**/*.*'],
		out: destination + 'images/'
	},

	imageuri = {
		in: source + 'images/inline/*',
		out: source + 'sass/images/',
		filename: '_datauri.scss',
		namespace: 'img'
	},

	fonts = {
		in: source + 'fonts/*',
		out: destination + 'fonts/' 
	},	

	watch = {
		html: [source + '*.html', source + 'template/**/*.html'],
		sass: [source + 'sass/**/*.scss', '!' + imageuri.out + imageuri.filename],
		fonts: [source + 'fonts/*'],
		images: [source + 'images/*.*', source + 'images/**/*.*'],
		scripts: [source + 'js/*.js', source + 'js/**/*.js']
	};	


/************************************/
/* 				Tasks				*/
/************************************/


/*
 * Task to clean the build folder
 * ...
 */
gulp.task('cleanBuild', function(){
	del([
		destination + '*'
	]);
});

/*
 * Task for Browser Sync
 * ...
 */
gulp.task('browsersync', function(){
	browsersync(browsersyncOptions);
});


/*
 * Task to Build HTML from templates and minify HTMl for Production
 * ...
 */
gulp.task('html', function(){
	return gulp
	.src(html.in)
	.pipe(njk.compile())
	.pipe(gulp.dest(html.out));
});


/*
 * Task to Merge and Compile Sass files
 * ...
 */
gulp.task('sass',['imageuri'], function(){
	return gulp.src(styles.in)
	.pipe (compass(compassOptions))
	.pipe(pleeease(pleeeaseOptions))
	.pipe(sass(sassOptions))
	.pipe(gulp.dest(styles.out))
	.pipe(browsersync.reload({stream: true}));
});


/*
 * Task to compress and copy images into build folder
 * ...
 */
gulp.task('images', function(){
	return gulp
	.src(images.in)
	.pipe(newer(images.out))
	.pipe(imagemin())
	.pipe(gulp.dest(images.out));
});


/*
 * Task to Chagne images to Data URI to avoid HTTP Request
 * ...
 */
gulp.task('imageuri', function(){
	return gulp
	.src(imageuri.in)
	.pipe(imagemin())	
	.pipe(imacss(imageuri.filename, imageuri.namespace))
	.pipe(gulp.dest(imageuri.out));
});


/*
 * Task to copy Fonts in build folders
 * ...
 */
gulp.task('fonts', function(){
	return gulp
	.src(fonts.in)
	.pipe(newer(fonts.out))
	.pipe(gulp.dest(fonts.out));
});


/*
 * Task Debug, concat script files and create one file in build folders
 * ...
 */
gulp.task('scripts', function(){
	return gulp
	.src(scripts.in)
	.pipe(newer(scripts.out))
	.pipe(jshint())
	// .pipe(jshint.reporter('default'))
	//.pipe(jshint.reporter('fail'))
	.pipe(concat())
	.pipe(stripdebug())
	.pipe(uglify())
	.pipe(gulp.dest(scripts.out));
});

/*
 * Default Task
 * Watching All of the writtend tasks
 * ...
 */
gulp.task('default', ['html', 'browsersync', 'sass', 'fonts', 'images', 'scripts'] , function() {
	gulp.watch(watch.html, ['html', browsersync.reload]);
	gulp.watch([watch.sass, imageuri.in],['sass']);
	gulp.watch(watch.fonts, ['fonts']);
	gulp.watch(watch.images, ['images']);
	gulp.watch(watch.scripts, ['scripts', browsersync.reload]);
});