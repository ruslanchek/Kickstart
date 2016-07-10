'use strict';

const gulp = require('gulp');
const plumber = require('gulp-plumber');
const browserSync = require('browser-sync');
const watch = require('gulp-watch');
const sourcemaps = require('gulp-sourcemaps');
const stylus = require('gulp-stylus');
const jeet = require('jeet');
const rename = require('gulp-rename');
const nib = require('nib');
const del = require('del');
const express = require('express');
const handlebars = require('handlebars');
const gulpHandlebars = require('gulp-handlebars-html')(handlebars);

const port = 3000;

function startExpress(pushPort) {
    const app = express();

    app.use('/', express.static('dist'));

    app.get('*', function (req, res) {
        res.set('content-type', 'text/html');
        res.send(fs.readFileSync('dist/index.html', 'utf8'));
    });

    app.listen(pushPort);
}

function clean() {
    return del([
        '.tmp',
        'dist/*'
    ]);
}

function stylusCompile() {
    return gulp.src('src/styl/project.styl')
        .pipe(plumber())
        .pipe(sourcemaps.init())
        .pipe(stylus({
            use: [
                jeet(),
                nib()
            ]
        }))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('dist/css'))
        .pipe(browserSync.stream());
}

function images(){
    return gulp.src('src/img/**/*.**')
        .pipe(gulp.dest('dist/img'));
}

function baseHtml() {
    let options = {};
    let templateData = {};

    return gulp.src('src/index.hbs')
        .pipe(gulpHandlebars(templateData, options))
        .pipe(rename('index.html'))
        .pipe(gulp.dest('dist'))
        .pipe(browserSync.stream());
}

function browserSyncInit() {
    return browserSync.init({
        open: false,
        ui: {
            port: port
        },
        proxy: 'http://localhost:' + (port + 1)
    });
}

gulp.task('clean', function () {
    return clean();
});

gulp.task('stylus', ['clean'], function () {
    return stylusCompile();
});

gulp.task('images', ['stylus'], function () {
    return images();
});

gulp.task('baseHtml', ['images'], function () {
    return baseHtml();
});

gulp.task('browser-sync', ['baseHtml'], function () {
    browserSyncInit();
});

gulp.task('default', ['browser-sync'], function () {
    startExpress(port + 1);

    gulp.watch([
        './src/*.hbs'
    ], function () {
        baseHtml();
    });

    gulp.watch([
        './src/img/**/*'
    ], function () {
        images();
    });

    gulp.watch([
        './src/fonts/**/*'
    ], function () {
        fonts();
    });

    gulp.watch([
        './src/styl/**/*.styl'
    ], function () {
        stylusCompile();
    });
});