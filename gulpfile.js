var gulp = require('gulp');
var uglify = require('gulp-uglify');
var rename = require("gulp-rename");
var replace = require('gulp-replace');

gulp.task('build', function() {
    return gulp.src('src/*.js')
        .pipe(uglify())
        .pipe(replace('    ', ''))
        .pipe(rename({
            extname: '.min.js'
        }))
        .pipe(gulp.dest('dist'));
});
