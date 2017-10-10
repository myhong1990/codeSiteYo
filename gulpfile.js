// include gulp
var gulp = require('gulp'),
// include gulp plugins
jshint = require('gulp-jshint'), // checks any JavaScript file in our directory and makes sure there are no errors in our code.
concat = require('gulp-concat'),
uglify = require('gulp-uglify'),
uglify_es = require('gulp-uglify-es').default; // this uglify to work for es6 syntax
rename = require('gulp-rename'),
notify = require('gulp-notify'),
gulpPath = require('gulp-path'), // this plugin used to organize files' path
// other third parties plugins
sass = require('gulp-ruby-sass'), // preprocessor for CSS
less = require('gulp-less'),
pug = require('gulp-pug'),
job = require('gulp-pug-job'),
// error hanlder to print out specific errors
pump = require('pump'), 
path = require('path'),
chalk = require('chalk');


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

// interpret pug into html
gulp.task('views', function buildHTML() {
    return gulp.src(['src/main/dev/views/*.pug'])
    .pipe(notify({ message: 'Gathering & Compiling .pug files' }))
    .pipe(pug())
    //   .pipe(concat('index.html'))
    .pipe(gulp.dest('src/main/dist/html'))
    .pipe(notify({ message: 'Successfully Compiled' }));
});

// checks any JavaScript file in our directory and makes sure there are no errors in our code.
gulp.task('lint', function (cb) {
    pump([
        gulp.src('src/main/dev/scripts/controllers/**/*.js'), // looks for all .js files in this repository
        notify({ message: 'Start checking script files syntax errors'}),
        jshint(),
        jshint.reporter('default'),
        notify({ message: 'PASSED Successfully'})
    ],
    cb
  );
});
// task to concatenate and minify all javascript files
gulp.task('scripts', function (cb) {
    pump([
        gulp.src('src/main/dev/scripts/controllers/**/*.js'), // take all file with extension .js
        concat('index.js'), // concatenate sources .js file into main.js
        gulp.dest('src/main/dist/controllers'), // OPTIONAL store the concatenated version in specified path
        rename({suffix: '.min'}), // rename file to index.min.js
        uglify_es(), //minify the file content
        gulp.dest('src/dest/js') // tell gulp where to put concatenated file
      ],
      cb
    );
});

/**
 * run task to interpret Sass into CSS
 */
gulp.task('sass', function() {
    // return gulp.src('src/styles/*.scss')
    // .pipe(concat('index.scss')) 
    // .pipe(sass('src/styles/index.scss', {style: 'compressed'}))
    // .pipe(rename({suffix: '.min'}))
    // .pipe(gulp.dest('src/styles'));
});

/**
 * run task to interpret LESS into CSS
 */
gulp.task('less', function() {
    // return gulp.src('src/**/*.less')
    // .pipe(less({paths: [path.join(__dirname, 'css', 'includes')]}))
    // .pipe(gulp.dest('src/styles/css'));
});





// Watch Files For Changes
gulp.task('watch', function() {
    gulp.watch('src/main/dev/scripts/**/*.js', ['lint', 'scripts']);
    // gulp.watch('src/styles/less/*.less', ['less']);
});


gulp.task('test', ['watch']);
gulp.task('default', ['views', 'lint', 'scripts']);
