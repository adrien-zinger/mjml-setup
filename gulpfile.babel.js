import { src, dest, watch, parallel, series, task } from 'gulp';
import mjml from 'gulp-mjml';
import handlebars from 'gulp-compile-handlebars';
import fs from 'fs';
import path from 'path';

const mjmlEngine = require('mjml');
const browserSync = require('browser-sync').create();
const tap = require('gulp-tap');

let data;

function setup () {
    data = JSON.parse(fs.readFileSync('./placeholder.json', 'utf8'))
    return Promise.resolve();
}

// TODO import this section from my github package in dependencies
// Section start
//Delimiters like {? variable ?}
const options = {
    openDelimiter: "{",
    closeDelimiter: "}",
    delimiter: "?"
};

/**
 * Return a promise rendering template from path
 * @param {string} path ejs template path file
 * @returns {Promise}
 */
function rf(path, variables) {
    if (!path) return Promise.reject(Error("Renderer need a path"))
        return new Promise((resolve, reject) => {
            return renderFile(
            path,
            variables,
            options,
            (err, html) => {
                if (err) return reject(err)
                return resolve({ html, variables })
            })
    })
}
// Section end


function fillContent () {
    content = JSON.parse(fs.readFileSync('./content.json', 'utf8'))
    return src('build/placeholder/*.html')
        .pipe(tap(file => {
            console.log('file', file)
            // for each language, if content[lang] contain filename, build
            for (const lang of Object.keys(content)) {

                Object.keys(content[lang]).indexOf(file)
            }
            //rf(file, )
        }));
}

const fr = () => template_gen('fr');
const en = () => template_gen('en');
const placeholder = () => template_gen('placeholder');

function template_gen (local) {
    if (!data) {
        return Promise.reject(new Error('No local data available.'));
    }
    const viewdata = data[local];
    return src('./src/index.mjml')
        .pipe(tap(file => {
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

const main = series(setup, parallel(fr, en), cleanup);
const email = series(setup, placeholder, fillContent, cleanup);

export {main as build, email};
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
