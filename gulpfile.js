import gulp from 'gulp';
import sass from 'gulp-sass';
import postcss from 'gulp-postcss';
import plumber from 'gulp-plumber';
import imgmin from 'gulp-imagemin';
import autoprefixer from 'autoprefixer';
import sync from 'browser-sync';
import del from 'del';
import sourcemaps from 'gulp-sourcemaps';
import rename from 'gulp-rename';
import cssnano from 'cssnano';
import imagemin from 'gulp-imagemin';
import svgstore from 'gulp-svgstore';
import posthtml from 'gulp-posthtml';
import htmlInclude from 'posthtml-include';

// Tasks
export const copyAssets = () => {
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

export const makeStyle = () => {
  return gulp.src('src/scss/style.scss')
    .pipe(plumber())
    .pipe(sourcemaps.init())
    .pipe(sass())
    .pipe(postcss([
      autoprefixer(),
      cssnano()
    ]))
    .pipe(rename('style.min.css'))
    .pipe(gulp.dest('dist/css'))
    .pipe(sync.stream());
}

export const makeSvgSprite = () => {
  return gulp.src('src/img/vector/sprite/*.svg')
    .pipe(svgstore({ inlineSvg: true }))
    .pipe(gulp.dest('src/components/svg-sprite'));
}

export const makeHtml = () => {
  return gulp.src('src/**/*.html')
    .pipe(plumber())
    .pipe(posthtml([
      htmlInclude()
    ]))
    .pipe(gulp.dest('dist'))
;
}

export const compressImages = () => {
  return gulp.src('src/img/*.{jpg,svg}')
  .pipe(imagemin([
    imagemin.mozjpeg({ quality: 70, progressive: true }),
    imagemin.svgo({
        plugins: [
            { removeViewBox: true },
            { cleanupIDs: false }
        ]
    })
  ]));
}

export const refresh = () => {
  sync.reload();
}

export const startServer = () => {
  sync.init({
    ui: false,
    notify: false,
    open: true,
    cors: true,
    server: {
      baseDir: 'dist'
    }
  });

  gulp.watch('src/*.html', gulp.series(makeHtml, refresh));
  gulp.watch('src/**/*.html', gulp.series(makeHtml, refresh));
  gulp.watch('src/img/vector/sprite/*.svg', gulp.series(makeSvgSprite, makeHtml, refresh))
  gulp.watch('src/scss/**/*.scss', gulp.series(makeStyle, refresh));
  gulp.watch(
    [
      'src/fonts/*.{woff2,woff}',
      'src/img/*.{jpg,png,webp}'
    ],
    copyAssets
  );
}

// Default
export default gulp.series(
  deleteDist,
  gulp.parallel(
    makeSvgSprite,
    makeStyle,
    copyAssets,
  ),
  makeHtml,
  startServer,
);
