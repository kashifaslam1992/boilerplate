
/************************************/
/* 				Tasks				*/
/************************************/
/*
 * Gulp Libraries
 * ...
 */

var gulp = require('gulp'),
    nunjucksRender = require('gulp-nunjucks-render'),
    del = require('del'),
    browserSync = require("browser-sync").create(),
    newer = require('gulp-newer'),

    sass = require('gulp-sass'),
    postcss = require("gulp-postcss"),
    autoprefixer = require('autoprefixer'),
    sourcemaps = require('gulp-sourcemaps'),

    plumber = require('gulp-plumber'),


    /*
     * Soruce and Destination Folders
     * ...
     */
    source = 'src/',
    destination = 'dist/',


    /*
     * Options List
     * ...
     */

    sassOptions = {
        errToLogConsole: true,
        precision: 4,
        outputStyle: 'expanded',
        sourceComments: false,
        indentWidth: 4
    },

    autoprefixerOptions = {
        overrideBrowserslist: ['> 2%','last 3 versions'],
        cascade: false
    },

    browsersyncOptions = {
        server: {
            baseDir: destination,
            index: 'index.html'
        },
        open: true,
        notify: true
    },

    /*
     * Source and Destination Assets
     * ...
     */
    html = {
        in: source + 'html/*.html',
        out: destination
    },

    css = {
        in: source + 'sass/*.scss',
        out: destination + 'css/'
    },

    cssSource = {
        in: source + 'sass/**/*',
        out: destination + 'sass/'
    },

    scripts = {
        in: [
            // Add All vendor paths here
            source + 'js/*.js'
        ],
        out: destination + 'js/'
    },

    images = {
        in: [source + 'images/*.*', source + 'images/**/*.*'],
        out: destination + 'images/'
    },

    fonts = {
        in: source + 'fonts/**/*',
        out: destination + 'fonts/'
    },

    watcher = {
        html: [source + '*.html', source + 'html/*.html', source + 'html/**/*.html'],
        sass: [source + 'sass/**/*.scss'],
        fonts: [source + 'fonts/*'],
        images: [source + 'images/*.*', source + 'images/**/*.*'],
        scripts: [source + 'js/*.js', source + 'js/**/*.js']
    };


function cleanBuild() {
    return del([
        destination + '*'
    ]);
}


function nunjucks() {
	return gulp.src(html.in)
    .pipe(nunjucksRender({
        path: [source+'/html/'] // String or Array
    }))
	.pipe(gulp.dest(html.out));
}

function style() {
    return gulp.src(css.in)
        .pipe(sourcemaps.init())
        .pipe(sass(sassOptions)).on('error', sass.logError)
        .pipe(postcss([autoprefixer(autoprefixerOptions)]))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(css.out))
        .pipe(browserSync.stream());
}

function graphics() {
    return gulp.src(images.in)
        .pipe(newer(images.out))
        .pipe(gulp.dest(images.out));
}

function typography() {
    return gulp.src(fonts.in)
        .pipe(newer(fonts.out))
        .pipe(gulp.dest(fonts.out));
}

function sassCopy() {
    return gulp.src(cssSource.in)
        .pipe(gulp.dest(cssSource.out));
}

function js() {
    return gulp.src(scripts.in)
        .pipe(plumber())
        .pipe(gulp.dest(scripts.out));
}

function watch() {
    browserSync.init(browsersyncOptions);
    gulp.watch(watcher.sass, gulp.series([style, sassCopy]));
    gulp.watch(watcher.html, nunjucks);
    gulp.watch(watcher.scripts, js);
    gulp.watch(watcher.images, graphics);
    gulp.watch(watcher.fonts, typography);
    gulp.watch([html.out + '*.html', css.out + '*.css', scripts.out + '*.js', images.out + '*', fonts.out + '*']).on('change', browserSync.reload);
}

exports.cleanBuild = cleanBuild;
exports.nunjucks = nunjucks;
exports.style = style;
exports.graphics = graphics;
exports.typography = typography;
exports.sassCopy = sassCopy;
exports.js = js;


var build = gulp.parallel(watch);

gulp.task('default', build);