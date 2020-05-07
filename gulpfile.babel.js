/************************************/
/* 				Tasks				*/
/************************************/
/*
 * Gulp Libraries
 * ...
 */
import gulp from 'gulp';
import yargs from 'yargs'; //TO set flag in command line wiht --prod flag
//import gulpif from 'gulp-if';
import nunjucksRender from 'gulp-nunjucks-render';
import htmlbeautify from 'gulp-html-beautify';
import removeEmptyLines from 'gulp-remove-empty-lines';
//import removeHtmlComments from 'gulp-remove-html-comments';
import del from 'del';
import browserSync from 'browser-sync';
import newer from 'gulp-newer';
import sass from 'gulp-sass';
import postcss from 'gulp-postcss';
import autoprefixer from 'autoprefixer';
import sourcemaps from 'gulp-sourcemaps';
import plumber from 'gulp-plumber';

const serve = browserSync.create(),
    PRODUCTION = yargs.argv.prod,

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

    scssSource = {
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


export const cleanBuild = () => del([destination + '*']);


export const nunjucks = () => {
	return gulp.src(html.in)
    .pipe(nunjucksRender({
        path: [source + 'html/'] // String or Array
    }))
    //.pipe(removeHtmlComments())
    .pipe(removeEmptyLines())
    .pipe(htmlbeautify({"indent_size": 2}))
    .pipe(gulp.dest(html.out));
};

export const style = () => {
    return gulp.src(css.in)
        .pipe(sourcemaps.init())
        .pipe(sass(sassOptions)).on('error', sass.logError)
        .pipe(postcss([autoprefixer(autoprefixerOptions)]))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(css.out))
        .pipe(serve.stream());
};

export const graphics = () => {
    return gulp.src(images.in)
        .pipe(newer(images.out))
        .pipe(gulp.dest(images.out));
};

export const typography = () => {
    return gulp.src(fonts.in)
        .pipe(newer(fonts.out))
        .pipe(gulp.dest(fonts.out));
};

export const sassCopy = () => {
    return gulp.src(scssSource.in)
        .pipe(gulp.dest(scssSource.out));
};

export const js = () => {
    return gulp.src(scripts.in)
        .pipe(plumber())
        .pipe(gulp.dest(scripts.out));
};

export const watch = () => {
    serve.init(browsersyncOptions);
    gulp.watch(watcher.sass, gulp.series([style, sassCopy]));
    gulp.watch(watcher.html, nunjucks);
    gulp.watch(watcher.scripts, js);
    gulp.watch(watcher.images, graphics);
    gulp.watch(watcher.fonts, typography);
    gulp.watch([
        html.out + '*.html',
        css.out + '*.css',
        scripts.out + '*.js',
        images.out + '*',
        fonts.out + '*'
    ]).on('change', serve.reload);
};


export const init = (done) => {
    gulp.series(
        'nunjucks',
        'style',
        'graphics',
        'typography',
        'sassCopy',
        'js'
    )() ;
    done();
};

const build = gulp.series(init, watch);

export default build;