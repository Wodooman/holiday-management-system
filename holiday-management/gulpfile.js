var gulp = require("gulp");
var del = require('del');
var ts = require("gulp-typescript");
var tsProject = ts.createProject("tsconfig.json");
var sourcemaps = require('gulp-sourcemaps');
var path = require('path');
var nodemon = require('gulp-nodemon');

gulp.task('clean', function () {
    return del(['dist/**/*']);
});

gulp.task("transpile", function () {
    return tsProject.src()
        .pipe(sourcemaps.init())
        .pipe(tsProject())
        .js.pipe(sourcemaps.write('.', { sourceRoot: path.relative('dist', 'src'), includeContent: false }))
        .pipe(gulp.dest("dist"));
});

gulp.task('copy-folders', function () {
    return gulp.src(['public/**/*']).pipe(gulp.dest('dist/public'));
});

gulp.task("rebuild", gulp.series('clean', 'copy-folders', 'transpile'));

gulp.task('host', function () {
    var stream = nodemon({ script: './dist/app.js'
        , ext: 'ts'
        , tasks: ['transpile']
        , execArgs: ["--inspect"] })

    stream
        .on('restart', function () {
            console.log('restarted!')
        })
        .on('crash', function() {
            console.error('Application has crashed!\n')
            stream.emit('restart', 10)  // restart the server in 10 seconds
        });
});

gulp.task("default", gulp.series('rebuild', 'host'));