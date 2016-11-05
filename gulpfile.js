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
var header = require('gulp-header');
var pkg = require('./package.json');
var filename = pkg.name.replace('tui-component-', '');
var banner = ['/**',
    ' * <%= pkg.name %>',
    ' * @author <%= pkg.author %>',
    ' * @version v<%= pkg.version %>',
    ' * @license <%= pkg.license %>',
    ' */',
    ''].join('\n');

var BUNDLE_PATH = 'dist/';

gulp.task('test', function(done) {
    new KarmaServer({
        configFile: path.join(__dirname, 'karma.conf.private.js'),
        singleRun: true
    }, done).start();
});

gulp.task('connect', function() {
    connect.server({
        livereload: true
    });
    gulp.watch(['./src/**/*.js', './index.js'], ['bundle']);
});

gulp.task('bundle', function() {
    var b = browserify({
        entries: 'index.js'
    });

    return b.bundle()
        .on('error', function(err) {
            console.log(err.message);
            this.emit('end');
        })
        .pipe(source(filename + '.js'))
        .pipe(buffer())
        .pipe(header(banner, { pkg : pkg } ))
        .pipe(gulp.dest(BUNDLE_PATH));
});

gulp.task('compress', ['bundle'], function() {
    gulp.src(BUNDLE_PATH + filename + '.js')
        .pipe(uglify())
        .pipe(concat(filename + '.min.js'))
        .pipe(header(banner, { pkg : pkg } ))
        .pipe(gulp.dest(BUNDLE_PATH));
});

gulp.task('default', ['bundle', 'compress']);
