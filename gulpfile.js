import gulp from 'gulp';
import sass from 'gulp-sass';
import postcss from 'gulp-postcss';
import plumber from 'gulp-plumber';
import imgmin from 'gulp-imagemin';
import autoprefixer from 'autoprefixer';
import sync from 'browser-sync';
import del from 'del';

// Tasks
export const server = () => {
  sync.init({
    ui: false,
    notify: false,
    server: {
      baseDir: 'dist'
    }
  });
}

export const copy = () => {
  return gulp.src([
      'src/img/*.{jpg,png,webp,svg}',
      'src/fonts/*.{woff,woff2}'
    ], {
      base: 'src'
    })
    .pipe(gulp.dest('dist'));
}

export const deleteDist = () => {
  return del('dist');
}

// Default
// exports.default;
