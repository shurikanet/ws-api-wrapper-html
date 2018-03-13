const gulp = require('gulp');
const browserSync = require('browser-sync').create();
const sass = require('gulp-sass');



// Compile Sass (Bootstrap Sass & Our Sass file) and Inject into browser

gulp.task('sass_bootstrap', () => {
    return gulp.src(['node_modules/bootstrap/scss/bootstrap.scss'])
        .pipe(sass())
        .pipe(gulp.dest("src/3rd-party/css"))
});

gulp.task('sass', () => {
    return gulp.src(['src/scss/*.scss'])
    .pipe(sass())
    .pipe(gulp.dest("src/css"))
    .pipe(browserSync.stream())
});



// Move Js Files to src/js
gulp.task('js', () => {
    return gulp.src(['node_modules/bootstrap/dist/js/bootstrap.min.js',
        'node_modules/jquery/dist/jquery.min.js',
        'node_modules/popper.js/dist/umd/popper.min.js',
        'node_modules/select2/dist/js/select2.min.js'
    ])
     .pipe(gulp.dest("src/3rd-party/js"))
     .pipe(browserSync.stream())

});

// Watch Sass, Html & Serve. Also reload browser if any changes was made.

gulp.task('serve', ['sass'], () => {
    browserSync.init({
        server: "./src"
    });

    gulp.watch(("src/scss/*.scss"), ['sass']);
    gulp.watch("src/*.html").on('change', browserSync.reload);
    gulp.watch("src/js/custom.js").on('change', browserSync.reload);

})

// Move Fonts Awesome Fonts Folder to src/fonts
gulp.task('fonts', () => {
    return gulp.src('node_modules/font-awesome/fonts/*')
        .pipe(gulp.dest("src/3rd-party/fonts"));
})

// Move Select2
gulp.task('css', () => {
    return gulp.src(['node_modules/select2/dist/css/select2.min.css',
        'node_modules/select2-bootstrap4-theme/dist/select2-bootstrap4.css'])
        .pipe(gulp.dest("src/3rd-party/css"));
})


// Move Fonts Awesome Css Folder to src/css
gulp.task('fa', () => {
    return gulp.src('node_modules/font-awesome/css/font-awesome.min.css')
    .pipe(gulp.dest("src/3rd-party/css"));
})

// Create a default file, so when we run gulp, it runs all we need. 
gulp.task('default', ['sass_bootstrap','js', 'serve', 'fa', 'fonts', 'css' ]);