var gulp = require('gulp')
var babel = require('gulp-babel')
var watch = require('gulp-watch')

gulp.task('watch', function () {
  return gulp.src('src/*')
    .pipe(watch('src/*'))
    .pipe(babel({
      presets: ['es2015'],
      plugins: ['add-module-exports']
    }))
    .pipe(gulp.dest('./'))
})
