// include gulp
var gulp = require('gulp'),
// use to start server
autoprefixer = require('gulp-autoprefixer'),
nodemon = require('gulp-nodemon'),
// include gulp plugins
jshint = require('gulp-jshint'), // checks any JavaScript file in our directory and makes sure there are no errors in our code.
concat = require('gulp-concat'),
uglify = require('gulp-uglify'),
uglify_es = require('gulp-uglify-es').default; // this uglify to work for es6 syntax
sourcemaps = require('gulp-sourcemaps'),
livereload = require('gulp-livereload'),
lessautoprefix = require('less-plugin-autoprefix'),
rename = require('gulp-rename'),
notify = require('gulp-notify'),
gulpPath = require('gulp-path'), // this plugin used to organize files' path
// other third parties plugins
sass = require('gulp-ruby-sass'), // Sass preprocessor for CSS, Sass is ruby base
less = require('gulp-less'),
pug = require('gulp-pug'),
job = require('gulp-pug-job'),
// error hanlder to print out specific errors
pump = require('pump'), 
path = require('path'),
chalk = require('chalk'),
del = require('del'),
// Minify plugin
cssmin = require('gulp-cssmin'),
htmlmin = require('gulp-htmlmin');


var paths = {
    src: 'src/**/*',
    srcViews: 'src/main/dev/**/*.pug',
    srcStyles: 'src/main/dev/**/*.less',
    srcScripts: 'src/main/dev/**/*.js',
    tmp: 'tmp',
    tmpViews: 'tmp/index.html',
    tmpStyles: 'tmp/**/*.css',
    tmpScripts: 'tmp/**/*.js',
    dist: 'dist',
    distViews: 'src/main/dist/**/*.html',
    distStyles: 'src/main/dist/**/*.css',
    distScripts: 'src/main/dist/**/*.js'
};


function errorHandler(error) {
    if (typeof error== 'object' && error.message) {
        error = error.message;
    }
    console.error(chalk.red('[gulp]') + chalk.red(error));
}

//Concatenate and minify JS files
// gulp.task('scripts', function() {
//     return gulp.src('src/main/scripts/controllers/*.js') // take all file with extension .js
//     .pipe(concat('index.js')) // concatenate sources .js file into main.js
//     .pipe(gulp.dest('src/main_dist/controllers')) // OPTIONAL store the concatenated version in specified path
//     .pipe(rename({suffix: '.min'})) // rename file to index.min.js
//     .pipe(uglify()) //minify the file content
//     .pipe(gulp.dest('src/main_min/controllers')) // tell gulp where to put concatenated file
//     .on('error', function(err) {
//         console.error('Error in scripts task', err.toString());
//     })
// });

// checks any JavaScript file in our directory and makes sure there are no errors in our code.
gulp.task('lint', function (cb) {
    pump([
        gulp.src('./src/main/dev/scripts/**/*.js'), // looks for all .js files in this repository
        jshint('.jshintrc'),
        jshint.reporter('jshint-stylish'),
        livereload()
    ],
    cb
  );
});

gulp.task('clean', function () {
    del([paths.distViews,paths.distStyles,paths.distScripts]);
});

// interpret pug into html
gulp.task('views', function buildHTML() {
    return gulp.src('./src/main/dev/views/**/*.pug')
    .pipe(pug({pretty:true, basedir:__dirname + '/src/main/'}))
    .pipe(htmlmin({collapseWhitespace: true}))
    .pipe(gulp.dest('./src/main/dist/views'))
    .pipe(livereload());
});

// create task to reload browser whenever an .pug files gets changed
gulp.task('html', function () {
    return gulp.src('./src/main/dev/views/*.pug')
    .pipe(livereload());
});

// task to concatenate and minify all javascript files
// run scripts task after lint task is done.
gulp.task('scripts',['lint'], function (cb) {
    pump([
        gulp.src('./src/main/dev/scripts/**/*.js'), // take all file with extension .js
        sourcemaps.init(),
        autoprefixer(),
        // concat('index.js'), // concatenate sources .js file into main.js
        rename({suffix: '.min'}), // rename file to index.min.js
        uglify_es(), //minify the file content
        sourcemaps.write('.'),
        gulp.dest('./src/main/dist/scripts'), // tell gulp where to put concatenated file
        livereload()
      ],
      cb
    );
});

/**
 * run task to interpret LESS into CSS
 * Minify less file and convert to css
 */
var autoprefix = new lessautoprefix({ browsers: ['last 2 versions'] });
gulp.task('less', function() {
    return gulp.src('./src/main/dev/styles/**/*.less')
    .pipe(sourcemaps.init())
    .pipe(autoprefixer())
    .pipe(less({
        plugins: [autoprefix]
    }))
    .pipe(rename({suffix: '.min'}))
    .pipe(cssmin())
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('./src/main/dist/styles'))
    .pipe(livereload())
});



// Watch Files For Changes
gulp.task('watch', function() {
    livereload.listen();
    gulp.watch('./src/main/dev/scripts/**/*.js', ['lint', 'scripts']);
    gulp.watch('./src/main/dev/styles/*.less', ['less']);
    gulp.watch('./src/main/dev/views/*.pug', ['views']);
});


gulp.task('server', function() {
    nodemon({
        'script': 'app.js',
        'ignore': 'src/main/dev/scripts/*.js'
    });
});

gulp.task('serve', ['server', 'watch']);
gulp.task('default', ['clean', 'views', 'scripts', 'less', 'serve']);


