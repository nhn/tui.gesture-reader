/*eslint-disable*/
var path = require('path');
var gulp = require('gulp');
var connect = require('gulp-connect');
var browserify = require('browserify');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var KarmaServer = require('karma').Server;
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
var filename = require('./package.json').name.replace('component-', '');

gulp.task('test', function() {
    new KarmaServer({
        configFile: path.join(__dirname, 'karma.conf.js'),
        singleRun: true
    }, done).start();
});

gulp.task('connect', function() {
    connect.server({
        livereload: true
    });
    gulp.watch(['./src/**/*.js', './index.js', './demo/**/*.html'], ['bundle']);
});

gulp.task('bundle', function() {
    var b = browserify({
        entries: 'index.js',
        debug: true
    });

    return b.bundle()
        .on('error', function(err) {
            console.log(err.message);
            this.emit('end');
        })
        .pipe(source(filename + '.js'))
        .pipe(buffer())
        .pipe(gulp.dest('./'));
});

gulp.task('compress', ['bundle'], function() {
    gulp.src(filename + '.js')
        .pipe(uglify())
        .pipe(concat(filename + '.min.js'))
        .pipe(gulp.dest('./'));

});

gulp.task('concat', ['compress'], function() {
    gulp.src(filename + '.js')
        .pipe(concat(filename + '.js'))
        .pipe(gulp.dest('./samples/js/'));
});

gulp.task('default', ['bundle', 'compress', 'concat']);