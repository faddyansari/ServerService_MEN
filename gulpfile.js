var gulp = require('gulp');
var babel = require('gulp-babel');
var uglify = require('gulp-uglify');
var cleanCSS = require('gulp-clean-css');
var gzip = require('gulp-gzip');
var clean = require('gulp-clean');
var htmlmin = require('gulp-htmlmin');
var runSequence = require('run-sequence')
var concat = require('gulp-concat');
var hash = require("gulp-hash");
var clean = require('gulp-clean');
var inject = require('gulp-inject');
var rename = require("gulp-rename");
var flatmap = require('gulp-flatmap');
var util = require("gulp-util");
var path = require("path");
var fs = require('fs');









var babelignore = [
    'socket.io.js',
    'socket.io.slim.js',
    'jquery.min.js',
    'jquery.slim.min.js',
    'vendor.bundle.js'
]

//For Chat Window Build
/* 
1 - Concat 3rd Party js
2 - Generate All Asset hashes
3 - Inject Css and JS to ChatWindow HTML HEAD
4 - Inject JS to Chat Window Deffered 
*/
var vendorjs = [
    'node_modules/socket.io-client/dist/socket.io.js',
    'node_modules/jquery/dist/jquery.min.js'
];


var chatWindowInjectionsCSS = [
    'public/static/assets/css/fontello.css',
    'public/static/assets/css/chat-window.css'
];



gulp.task('vendorjs', function () {
    return gulp.src(vendorjs)
        .pipe(concat('vendor.bundle.js'))
        .pipe(gulp.dest('public/static/assets/js'))
});

gulp.task('injectCB', function () {
    return gulp.src('public/static/assets/html/chatBubble.html')
        .pipe(inject(gulp.src('public/static/assets/js/chat-bubble.js', { read: false }), {
            transform: function (filepath) {
                var contents = JSON.parse(fs.readFileSync('build/public/assets.json', 'utf-8'));
                var headTags = '';
                if (contents['chat-bubble.js']) {
                    headTags += '<script src="/cw/js/' + contents['chat-bubble.js'] + '"></script>';
                }
                return headTags;
            }
        }))
        .pipe(inject(gulp.src(['public/static/assets/css/chat-bubble.css'], { read: false }), {
            transform: function (filepath) {
                var contents = JSON.parse(fs.readFileSync('build/public/assets.json', 'utf-8'));
                var headTags = '';
                if (contents['chat-bubble.css']) {
                    return '<link href="/cw/css/' + contents['chat-bubble.css'] + '" rel="stylesheet"/>';
                }
            }
        }))
        .pipe(gulp.dest('build/public/static/assets/html'));

});

gulp.task('injectAM', function () {
    return gulp.src('public/static/assets/html/autoMessage.html')
        .pipe(inject(gulp.src('public/static/assets/js/autoMessage.js', { read: false }), {
            transform: function (filepath) {
                var contents = JSON.parse(fs.readFileSync('build/public/assets.json', 'utf-8'));
                var headTags = '';
                if (contents['autoMessage.js']) {
                    headTags += '<script src="/cw/js/' + contents['autoMessage.js'] + '"></script>';
                }
                return headTags;
            }
        }))
        .pipe(inject(gulp.src(['public/static/assets/css/auto-message.css', 'public/static/assets/css/fontello.css', 'public/static/assets/css/fonts.css'], { read: false }), {
            transform: function (filepath) {
                var contents = JSON.parse(fs.readFileSync('build/public/assets.json', 'utf-8'));
                var headTags = '';
                if (path.basename(filepath) == 'fontello.css') {
                    return '<link href="/cw/css/' + contents['fontello.css'] + '" rel="stylesheet"/>';
                }
                if (path.basename(filepath) == 'auto-message.css') {
                    return '<link href="/cw/css/' + contents['auto-message.css'] + '" rel="stylesheet" />';
                }
                if (path.basename(filepath) == 'fonts.css') {
                    return '<link href="/cw/css/' + contents['fonts.css'] + '" rel="stylesheet" />';
                }
            }
        }))
        .pipe(gulp.dest('build/public/static/assets/html'));

});

gulp.task('injectCW', function () {
    return gulp.src('public/static/assets/html/chatWindow.html')
        .pipe(inject(gulp.src(['public/static/assets/js/vendor.bundle.js'], { read: false }), {
            name: 'head',
            transform: function (filepath) {
                var contents = JSON.parse(fs.readFileSync('build/public/assets.json', 'utf-8'));
                var headTags = '';
                if (contents['vendor.bundle.js']) {
                    headTags += '<script src="/cw/js/' + contents['vendor.bundle.js'] + '"></script>';
                }
                if (contents['cwLoader.js']) {
                    headTags += '<script src="/cw/js/' + contents['cwLoader.js'] + '"></script>';
                }
                return headTags;
            }
        }))
        //    .pipe(inject(gulp.src('public/static/assets/js/chatWindow.js', { read: false }), {
        //         transform: function (filepath) {
        //             var contents = JSON.parse(fs.readFileSync('build/public/assets.json', 'utf-8'));
        //             var headTags = '';
        //             if (contents['chatWindow.js']) {
        //                 headTags += '<script src="/cw/js/' + contents['chatWindow.js'] + '"></script>';
        //             }
        //             return headTags;
        //         }
        //     }))
        .pipe(inject(gulp.src(['public/static/assets/css/chat-window.css', 'public/static/assets/css/fontello.css', 'public/static/assets/css/fonts.css'], { read: false }), {
            transform: function (filepath) {
                var contents = JSON.parse(fs.readFileSync('build/public/assets.json', 'utf-8'));
                var headTags = '';
                if (path.basename(filepath) == 'fontello.css') {
                    return '<link href="/cw/css/' + contents['fontello.css'] + '" rel="stylesheet"/>';
                }
                if (path.basename(filepath) == 'chat-window.css') {
                    return '<link href="/cw/css/' + contents['chat-window.css'] + '" rel="stylesheet" />';
                }
                if (path.basename(filepath) == 'fonts.css') {
                    return '<link href="/cw/css/' + contents['fonts.css'] + '" rel="stylesheet" />';
                }
            }
        }))
        .pipe(gulp.dest('build/public/static/assets/html'));
});


// .pipe(hash())
//         .pipe(gulp.dest('build/public/static/assets/js'))
//         .pipe(hash.manifest('./public/assets.json', { // Generate the manifest file
//             deleteOld: true,
//             sourceDir: __dirname + '/public/css'
//           }))
gulp.task('compilejs', function () {

    return gulp.src('public/static/assets/js/**/*.js')
        .pipe(babel({ presets: ['es2015'], ignore: babelignore }))
        .pipe(uglify({
            mangle: {
                keep_fnames: true // keep function names
            }
        }))
        .pipe(hash())
        .pipe(gulp.dest('build/public/static/assets/js'))
        .pipe(hash.manifest('./assets.json', { // Generate the manifest file
            deleteOld: true,
            sourceDir: __dirname + '../../../'
        }))
        .pipe(gulp.dest('build/public'))

});


gulp.task('minifycCss', function () {

    return gulp.src('public/static/assets/css/**/*.css')
        .pipe(cleanCSS({ compatibility: 'ie8' }))
        .pipe(hash())
        .pipe(gulp.dest('build/public/static/assets/css'))
        .pipe(hash.manifest('./assets.json', { // Generate the manifest file
            deleteOld: true,
            sourceDir: __dirname + 'build/public'
        }))
        .pipe(gulp.dest('build/public'))


});

gulp.task('minifyHTML', function () {
    return gulp.src('build/public/static/assets/html/**/*.html', { base: "./" })
        //    .pipe(flatmap(function(stream, file){
        //         var contents = JSON.parse(fs.readFileSync('./assets.json','utf-8'));
        //         util.log(contents);
        //         return gulp.src(path.basename(file.path));
        //     }));   
        .pipe(htmlmin({ collapseWhitespace: true }))
        .pipe(gulp.dest('.'));
});

gulp.task('copyFonts', function () {
    return gulp.src('public/static/assets/fonts/**/*')
        .pipe(gulp.dest('build/public/static/assets/fonts'))
        .pipe(gzip({ gzipOptions: { level: 9 } }))
        .pipe(gulp.dest('build/public/static/assets/fonts'));
});

gulp.task('copyImages', function () {
    return gulp.src('public/static/assets/images/**/*')
        .pipe(gulp.dest('build/public/static/assets/images'))
        .pipe(gzip({ gzipOptions: { level: 9 } }))
        .pipe(gulp.dest('build/public/static/assets/images'));
});

gulp.task('copyPackages', function () {
    return gulp.src('public/static/assets/packages/**/*')
        .pipe(gulp.dest('build/public/static/assets/packages'))
        .pipe(gulp.dest('build/public/static/assets/packages'));
});

gulp.task('copyErrorPages', function () {
    return gulp.src('public/static/assets/error_pages/**/*')
        .pipe(htmlmin({ collapseWhitespace: true }))
        .pipe(gulp.dest('build/public/static/assets/error_pages'))
        .pipe(gulp.dest('build/public/static/assets/error_pages'));
});

gulp.task('copyDyanmicPages', function () {
    return gulp.src('public/static/assets/dynamichtml/**/*')
        .pipe(htmlmin({ collapseWhitespace: true }))
        .pipe(gulp.dest('build/public/static/assets/html'))
        .pipe(gulp.dest('build/public/static/assets/html'));
});

gulp.task('compress', function () {
    return gulp.src('build/public/static/assets/**/*.*', { base: "./" })
        .pipe(gzip({ gzipOptions: { level: 9 } }))
        .pipe(gulp.dest("."));
});

gulp.task('clean', function () {
    return gulp.src('build/public/static', { read: false })
        .pipe(clean());
})

gulp.task('build_prod_clean', function (callback) {
    runSequence('clean', 'minifycCss', 'vendorjs', 'compilejs', ['injectCW', 'injectCB', 'injectAM'], 'minifyHTML', ['copyFonts', 'copyImages', 'copyPackages', 'copyErrorPages', 'copyDyanmicPages'], 'compress', callback);
});

gulp.task('build_prod', function (callback) {
    runSequence('minifycCss', 'vendorjs', 'compilejs', ['injectCW', 'injectCB', 'injectAM'], 'minifyHTML', ['copyFonts', 'copyImages', 'copyPackages', 'copyErrorPages', 'copyDyanmicPages'], 'compress', callback);
});