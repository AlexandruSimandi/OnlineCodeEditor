/**
 * Created by rober on 12/03/2016.
 */
var gulp = require('gulp');
var notify = require("gulp-notify");
var bower = require('gulp-bower');

//config object that will hold various settings
var config  = {
    bowerDir: './bower_components',
    nodeModulesDir: './node_modules'
}

gulp.task('javascript',function(){
    gulp
        .src(config.bowerDir + '/jquery/dist/jquery.min.js')
        .pipe(gulp.dest('./public/js'));

    gulp
        .src(config.bowerDir + '/angular/angular.min.js')
        .pipe(gulp.dest('./public/js'));

    gulp
        .src(config.bowerDir + '/angular-ui-router/release/angular-ui-router.min.js')
        .pipe(gulp.dest('./public/js'));

    gulp
        .src(config.bowerDir + '/angular-materialize/src/angular-materialize.js')
        .pipe(gulp.dest('./public/js'));
	gulp
		.src(config.bowerDir + "/socket.io-client/socket.io.js")
		.pipe(gulp.dest('./public/js'));
	gulp
		.src(config.nodeModulesDir + "/codemirror/**/*")
		.pipe(gulp.dest('./public/js/codemirror'));
	gulp
		.src(config.nodeModulesDir + "/clipboard/dist/clipboard.min.js")
		.pipe(gulp.dest('./public/js'));
});



gulp.task('icons', function(){

});

gulp.task('default', ['javascript']);
