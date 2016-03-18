// SAMPLE GULPFILE

var gulp = require('gulp');
var browserify = require('browserify');
var babelify = require('babelify');
var source = require('vinyl-source-stream');

gulp.task('javascript', function() {
    return browserify({
        entries: './index.js',
        extensions: ['.js', '.jsx'],
        debug: true
    })
        .transform(babelify, {presets: ['es2015', 'react']})
        .bundle()
        .pipe(source('app.js'))
        .pipe(gulp.dest('./js'));
});

gulp.task('watch', function() {
    gulp.watch('./*.js', ['javascript']);
});
