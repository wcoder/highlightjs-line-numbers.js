var gulp = require('gulp');
var uglify = require('gulp-uglify');
var rename = require("gulp-rename");
var replace = require('gulp-replace');
var rollup = require('rollup-stream');
var buffer = require('vinyl-buffer');
var source = require('vinyl-source-stream');

gulp.task('build', function() {
    return rollup({
            input: 'src/highlightjs-line-numbers.js',
            format: 'iife'
        })
        .pipe(source('highlightjs-line-numbers.js'))
        .pipe(buffer())
        .pipe(uglify())
        .pipe(rename({
            extname: '.min.js'
        }))
        .pipe(gulp.dest('dist'))
        .pipe(gulp.dest('test'));
});
