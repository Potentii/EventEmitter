// *Getting the build modules:
const gulp = require('gulp');
const pump = require('pump');
const rename = require('gulp-rename');
const uglify = require('gulp-uglify');
const babel = require('gulp-babel');


// *Defining the minification task:
gulp.task('minify', cb => {
   // *Defining the rename function:
   let rename_fn = path => path.basename = path.basename.toLowerCase() + ".min";

   // *Setting up the stream flow:
   let flow = [gulp.src('../dist/**/*'), uglify(), rename(rename_fn), gulp.dest('../dist')];

   // *Returning and executing the stream:
   return pump(flow);
});


// *Defininf the ES5 downgrade task:
gulp.task('es5', cb => {
   // *Defining the rename function:
   let rename_fn = path => path.basename = path.basename.toLowerCase() + ".es5";

   // *Setting up the stream flow:
   let flow = [gulp.src('../src/**/*'), babel({presets: ['es2015']}), rename(rename_fn), gulp.dest('../dist')];

   // *Returning and executing the stream:
   return pump(flow);
});
