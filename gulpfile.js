/**
 * Author:Herui/Administrator;
 * CreateDate:2016/2/16
 *
 * Describe:
 */

//引入gulp
var gulp = require('gulp'),
    less = require('gulp-less'),
    cleancss = require('gulp-clean-css'),
    amdoptimize = require('amd-optimize'),
    concat = require('gulp-concat'),
    jshint=require('gulp-jshint'),
    clean = require('gulp-clean'),
    uglify=require('gulp-uglify'),
    requirejsoptimize=require('gulp-requirejs-optimize');

gulp.task('build-css', function () {
    gulp.src('_Runtime/Static/style/**/*.less')
        .pipe(less())
        .pipe(cleancss())
        .pipe(gulp.dest('Runtime/Static/style'));

    gulp.src('_Runtime/Static/**/*.css')
        .pipe(cleancss())
        .pipe(gulp.dest('Runtime/Static/'));
});

gulp.task('build-script', function () {
    gulp.src('_Runtime/Static/js/**/*.js')
        .pipe(amdoptimize('application', {
                baseUrl:"_Runtime/Static/js",
                paths: {
                    "jquery": "libs/jquery/dist/jquery.min",
                    "Class":"common/core/Class",
                    "system":"../../Content"
                },
                exclude: ['jquery']
            }
        ))
        .pipe(concat("application.js"))
        .pipe(gulp.dest("Runtime/Static/js"));

    gulp.src(['_Runtime/Content/**/*.js'])
        .pipe(amdoptimize('../../Content/b', {
                baseUrl:"_Runtime/Static/js",
                paths: {
                    "jquery": "libs/jquery/dist/jquery.min",
                    "Class":"common/core/Class",
                    "system":"../../Content"
                },
                exclude: ['jquery']
            }
        ))
        .pipe(concat("b.js"))
        .pipe(gulp.dest("Runtime/Content"));

    gulp.src('_Runtime/Static/js/config.js')
        .pipe(gulp.dest('Runtime/Static/js/'));

});

gulp.task('build-html',function(){
    /*build html*/
    gulp.src(['_Runtime/**/*.html','!_Runtime/Static/**/*.html'])
        .pipe(gulp.dest('Runtime/'));
})

gulp.task('clean', function() {
    return gulp.src('Runtime')
        .pipe(clean({force: true}));
});

gulp.task('develop',
    ['clean'],
    function(){
    gulp.run('build-css','build-script','build-html');

    /*build library*/
    gulp.src('_Runtime/Static/js/libs/jquery/dist/jquery.min.js')
        .pipe(uglify())
        .pipe(gulp.dest('Runtime/Static/js/libs/jquery/dist/'));

    gulp.src('_Runtime/Static/js/libs/require-css/css.min.js')
        .pipe(uglify())
        .pipe(gulp.dest('Runtime/Static/js/libs/require-css/'));

    gulp.src('_Runtime/Static/js/libs/requirejs/require.js')
        .pipe(uglify())
        .pipe(gulp.dest('Runtime/Static/js/libs/requirejs/'));

    /*build html*/
    gulp.src('_Runtime/**/*.html')
        .pipe(gulp.dest('Runtime/'));

    /*add listener*/
    gulp.watch('_Runtime/**/*.js', function () {
        gulp.run('build-script');
    });
    gulp.watch(['_Runtime/Static/style/**/*.less','_Runtime/Static/**/*.css'],function(){
        gulp.run('build-css');
    })
});

gulp.task('default', function () {
    gulp.run('develop');
});