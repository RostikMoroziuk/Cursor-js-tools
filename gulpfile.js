var gulp = require("gulp");
var jshint = require('gulp-jshint'); //validate js

gulp.task('lint', function () {
  return gulp.src('./src/js/*.js')
    .pipe(jshint())
    .pipe(jshint.reporter('default'));
});