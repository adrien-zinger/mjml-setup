import { src, dest, watch, parallel, series } from 'gulp';
import mjml from 'gulp-mjml';
import handlebars from 'gulp-compile-handlebars';
import fs from 'fs';
import path from 'path';

const mjmlEngine = require('mjml');
const browserSync = require('browser-sync').create();
const tap = require('gulp-tap');

let data;
const english = () => compile('en');
const french = () => compile('fr');

function setup () {
    data = JSON.parse(fs.readFileSync('./locals.json', 'utf8'))
    return Promise.resolve();
}

function compile (local) {
    if (!data) {
        return Promise.reject(new Error('No local data available.'));
    }
    const viewdata = data[local];
    return src('./src/index.mjml')
        .pipe(tap(function(file) {
            const filename = path.basename(file.path).replace('.mjml', '');
            viewdata.filename = filename;
            viewdata.lang = local;
        }))
        .pipe(mjml(mjmlEngine, {validationLevel: 'strict'})) //todo minify
        .pipe(handlebars(viewdata))
        .pipe(dest('./build/' + local));
}

function cleanup () {
    return Promise.resolve(() => data = null);
}

const main = series(setup, parallel(english, french), cleanup);

export {main as build};
export default function () {
    main();
    browserSync.init({
        server: {
            baseDir: './build/en'
        }
    });
    watch('./src/*.mjml', main);
    watch('./locals.json', main);
    watch('./build/**/*.html', done => {
        browserSync.reload();
        done();
    });
};
