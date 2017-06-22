var gulp = require('gulp');
var jshint = require('gulp-jshint'); //validate js
var less = require('gulp-less'); //compile to css
var babel = require('gulp-babel'); //transpile es2015 to es5
var gulpCopy = require('gulp-copy'); //copy file
var concat = require('gulp-concat'); //concatination files to one file
var uglify = require('gulp-uglify'); //compress js
var csso = require('gulp-csso'); //compress js
var del = require('del'); //delete folders and files
var browserSync = require('browser-sync').create();

gulp.task('lint', function () {
  return gulp.src('./src/js/*.js')
    .pipe(jshint())
    .pipe(jshint.reporter('default')); //default reporter show errors and warnings if exist (fail - stop running)
});

gulp.task('less', function () {
  return gulp.src('./src/styles/*.less')
    .pipe(less())
    .pipe(gulp.dest('./dist/styles/'));
});

gulp.task('transpile', function () {
  var tr = gulp.src('./src/js/*.js')
    .pipe(babel({
      presets: ['es2015']
    }))
    .pipe(gulp.dest('./dist/js/'));
  browserSync.reload();
  return tr;
});

gulp.task('copyHTML', function () {
  var res = gulp.src('./src/*.html')
    .pipe(gulpCopy('./dist/'));
  browserSync.reload();
  return res;
});

gulp.task('concat', function () {
  //concat js
  gulp.src('./src/js/*.js')
    .pipe(concat('all.js'))
    .pipe(gulp.dest('./src/js/'));

  //concat less
  gulp.src('./src/styles/*.less')
    .pipe(concat('all.less'))
    .pipe(gulp.dest('./src/styles/'));
});

gulp.task('compress', function () {
  //uglify js
  gulp.src('./src/js/*.js')
    .pipe(uglify())
    .pipe(gulp.dest('./src/js/min/'));

  //concat less
  gulp.src('./src/styles/*.less')
    .pipe(csso())
    .pipe(gulp.dest('./src/styles/min/'));
});

gulp.task('clearDist', function () {
  del('./dist/');
});

//watch for all less, js, html and livereload
gulp.task('server', function () {
  //init server
  browserSync.init({
    server: './dist'
  });
  //add watchers for html, js, less
  gulp.watch('./src/styles/*.less', ['less']);
  gulp.watch('./src/js/*.js', ['transpile']);
  gulp.watch('./src/*.html', ['copyHTML']);
});