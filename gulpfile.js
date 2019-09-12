'use strict';

var gulp = require('gulp-param')(require('gulp'), process.argv),
	$ = require('gulp-load-plugins')(),
    cleanCSS = require('gulp-clean-css');

gulp.destPath = 'dist';
gulp.srcPath = 'src';

function buildCSS(sources){
    sources = sources || false;

    return gulp.src([gulp.srcPath + '/**/*.css'])
        .pipe($.plumber())
        .pipe($.concat('SimpleCarousel.min.css'))
        .pipe($.autoprefixer(['last 2 versions', 'Explorer > 8']))
        .pipe(cleanCSS({level: {1: {specialComments: 0}}}))
        .pipe(gulp.dest(gulp.destPath + '/'));
}

function buildJsMin(sources){
    sources = sources || false;

    return gulp.src([gulp.srcPath + '/**/*.js'])
        .pipe($.plumber())
        .pipe($.concat('SimpleCarousel.min.js'))
        .pipe($.babel({
            presets: [
                ['@babel/env', {
                    modules: false
                }]
            ]
        }))
        .pipe($.uglify()).on('error', function(err){ console.log(err);})
        .pipe(gulp.dest(gulp.destPath + '/'));
}

function buildJs(sources){
    sources = sources || false;

    return gulp.src([gulp.srcPath + '/**/*.js'])
        .pipe($.plumber())
        .pipe($.concat('SimpleCarousel.js'))
        .pipe(gulp.dest(gulp.destPath + '/'));
}

function watcher(){
    return gulp.watch([gulp.srcPath + '/**/*.js'], gulp.parallel(buildJs, buildJsMin, buildCSS));
}

gulp.task('default', gulp.parallel(buildJsMin, buildJs, buildCSS, watcher), function(){});
