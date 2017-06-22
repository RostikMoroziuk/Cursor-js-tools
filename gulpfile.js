var gulp = require('gulp');
var jshint = require('gulp-jshint'); //validate js
var less = require('gulp-less'); //compile to css
var babel = require('gulp-babel'); //transpile es2015 to es5
var gulpCopy = require('gulp-copy'); //copy file
var concat = require('gulp-concat'); //concatination files to one file
var uglify = require('gulp-uglify'); //compress js
var csso = require('gulp-csso'); //compress js
var del = require('del'); //delete folders and files
var rename = require('gulp-rename');
var browserSync = require('browser-sync').create();

gulp.task('lint', function () {
  return gulp.src('./src/js/*.js')
    .pipe(jshint())
    .pipe(jshint.reporter('default')); //default reporter show errors and warnings if exist (fail - stop running)
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

gulp.task('clearProd', function () {
  del('./prod');
});

// build css
gulp.task('less', function () {
  return gulp.src('./src/styles/*.less')
    // .pipe(concat('all.css')) //concat all less files
    .pipe(less()) //compile
    // .pipe(csso()) //minify
    // .pipe(rename({suffix: '.min'})) //add .min
    .pipe(gulp.dest('./src/styles/'))
    .pipe(browserSync.stream()) //injection
});

//build js
gulp.task('js', function () {
  return gulp.src('./src/js/*.js')
    .pipe(babel({
      presets: ['es2015']
    })) //transpile
    .pipe(jshint())
    .pipe(jshint.reporter('default')) //fail reporter stop running if has errors
    .pipe(gulp.dest('./src/js/'));
});

gulp.task('js-watch', ['js'], function (done) {
  browserSync.reload();
  done();
});

//watch for all less, js, html and livereload
gulp.task('server', function () {
  //init server
  browserSync.init({
    server: './src'
  });
  //add watchers for html, js, less
  gulp.watch('./src/styles/*.less', ['less']);
  gulp.watch('./src/js/*.js', ['js-watch']);
  gulp.watch('./src/*.html').on('change', browserSync.reload);
});

gulp.task('prod', function () {
  del('./prod/'); // delete folder if exist
  //copy html, js, css
  gulp.src(['./src/*.html', './src/js/*.js', './src/styles/*.css'])
    .pipe(gulpCopy('./prod/', {prefix: 1}));

  gulp.src('./src/js/*.js')
    .pipe(concat('all.js')) //concat all less files
    .pipe(uglify()) //minify
    .pipe(rename({
      suffix: '.min'
    })) //add .min
    .pipe(gulp.dest('./prod/js/'));
})

gulp.task('default', ['server']);