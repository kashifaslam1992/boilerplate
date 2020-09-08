// General
import gulp from 'gulp';
import yargs from 'yargs';
import gulpif from 'gulp-if';
import del from 'del';
import browserSync from 'browser-sync';
import zip from 'gulp-zip';

// HTML
import nunjucksRender from 'gulp-nunjucks-render';
import htmlbeautify from 'gulp-html-beautify';
import removeEmptyLines from 'gulp-remove-empty-lines';

// CSS
import sass from 'gulp-sass';
import postcss from 'gulp-postcss';
import autoprefixer from 'autoprefixer';
import sourcemaps from 'gulp-sourcemaps';

// Javascript
import webpack from 'webpack-stream';
import plumber from 'gulp-plumber';

// Images
import imagemin from 'gulp-imagemin';

const serve = browserSync.create(),
    PRODUCTION = yargs.argv.prod,
    src = 'src/',
    dist = 'dist/',
    option = {
        sass: {
            errToLogConsole: true,
            precision: 4,
            outputStyle: 'expanded',
            sourceComments: false,
            indentWidth: 4
        },
        autoprefixer: {
            overrideBrowserslist: ['> 2%','last 3 versions'],
            cascade: false
        },
        browsersync: {
            server: {
                baseDir: dist,
                index: 'index.html'
            },
            open: true,
            notify: true
        }
    },
    path = {
        html : {
            in: src + 'html/*.html',
            out: dist,
            watch: [src + 'html/*.html', src + 'html/**/*.html']
        },
        css : {
            in: src + 'sass/*.scss',
            out: dist + 'css/',
            watch: src + 'sass/**/*.scss'
        },
        scripts : {
            in: [ src + 'js/*.js' ],
            out: dist + 'js/',
            watch: [ src + 'js/*.js' ]
        },
        scriptsES6 : {
            in: src + 'js/script.js',
            out: dist + 'js/',
            watch: [src + 'js/*.js', src + 'js/**/*.js']
        },
        images : {
            in: [src + 'images/*.*', src + 'images/**/*.*'],
            out: dist + 'images/',
            watch: [src + 'images/*.*', src + 'images/**/*.*']
        },
        others: {
            src: src + '{images,js,assets,fonts,sass,scss}/**/*',
            dist: dist
        },
        theme: {
            src: [dist + '{,/**}'],
            dist: 'theme'
        }

    };

export const clean = () => del([dist]);
export const copy = () => {
    return gulp.src(path.others.src)
        .pipe(gulp.dest(path.others.dist))
}

export const compress = () => {
    return gulp.src(path.theme.src)
        .pipe(zip(`theme.zip`))
        .pipe(gulp.dest(path.theme.dist));
}

export const html = () => {
	return gulp.src(path.html.in)
    .pipe(nunjucksRender({
        path: [src + 'html/'] // String or Array
    }))
    .pipe(removeEmptyLines())
    .pipe(htmlbeautify({"indent_size": 2}))
    .pipe(gulp.dest(path.html.out));
};

export const styles = () => {
    return gulp.src(path.css.in)
        .pipe(sourcemaps.init())
        .pipe(sass(option.sass)).on('error', sass.logError)
        .pipe(postcss([autoprefixer(option.autoprefixer)]))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(path.css.out))
        .pipe(serve.stream());
};

export const images = () => {
    return gulp.src(path.images.in)
        .pipe(gulpif(PRODUCTION, imagemin()))
        .pipe(gulp.dest(path.images.out));
};

export const scripts = () => {
    return gulp.src(path.scripts.in)
        .pipe(plumber())
        .pipe(gulp.dest(path.scripts.out));
};

export const scriptsES6 = () => {
    return gulp.src(path.scriptsES6.in)
        .pipe(webpack({
            module: {
                rules: [
                    {
                        test: /\.js$/,
                        use: {
                            loader: 'babel-loader',
                            options: {
                                presets: ['@babel/preset-env'] //or ['babel-preset-env']
                            }
                        }
                    }
                ]
            },
            output: {
                filename: '[name].js'
            },
            devtool: !PRODUCTION ? 'inline-source-map' : false,
            mode: PRODUCTION ? 'production' : 'development' //add this
        }))
        .pipe(gulp.dest(path.scriptsES6.out));
};

export const watch = () => {
    serve.init(option.browsersync);
    gulp.watch(path.css.watch, styles);
    gulp.watch(path.html.watch, html);
    gulp.watch(path.scripts.watch, scripts);
    gulp.watch(path.images.watch, images);
    gulp.watch(path.others.src, copy);
    gulp.watch([
        path.html.out + '*.html',
        path.css.out + '*.css',
        path.scripts.out + '*.js',
        path.images.out + '*'
    ]).on('change', serve.reload);
};


export const dev = (done) => {
    gulp.series(clean, gulp.parallel(html, styles, images, scripts, copy), watch)()
    done();
};

export const build = (done) => {
    gulp.series(clean, gulp.parallel(html, styles, images, scripts, copy))()
    done();
};

export const bundle = (done) => {
    gulp.series(clean, gulp.parallel(html, styles, images, scripts, copy), compress)()
    done();
};

export default dev;
