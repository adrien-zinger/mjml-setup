import { src, dest, watch, parallel, series } from 'gulp';
import mjml from 'gulp-mjml';
import handlebars from 'gulp-compile-handlebars';
import fs from 'fs';
import path from 'path';

const mjmlEngine = require('mjml');
const browserSync = require('browser-sync').create();
const tap = require('gulp-tap');

function handlebar_gen () {
    return src('./src/*.mjml')
        .pipe(mjml(mjmlEngine, {validationLevel: 'strict'}))
        .pipe(dest('./build/hb/'));
}

function set_content (done) {
    const content = JSON.parse(fs.readFileSync('./content.json', 'utf8'));
    if (!content) return Promise.reject(new Error('No local data available.'));
    const tasks = fs.readdirSync('./build/hb').filter(file => {
        return content[file.replace('.html', '')] !== undefined;
    }).map(file => {
        return getTasksByCountryAndFileName(
            content[file.replace('.html', '')], file);
    }).flat();
    return parallel(...tasks, (parallelDone) => {
        parallelDone();
        done();
    })();
}

function getTasksByCountryAndFileName (data, filename) {
    if (!data) return Promise.reject(new Error('No local data available.'));
    return Object.keys(data).map((country) => {
        function genbyCountry() {
            const viewdata = data[country];
            return src(`./build/hb/${filename}`)
                .pipe(tap(file => {
                    const name = path.basename(file.path).replace('.html', '');
                    viewdata.filename = name;
                    viewdata.lang = country;
                }))
                .pipe(handlebars(viewdata))
                .pipe(dest('./dist/' + country));
        }
        genbyCountry.displayName = `dist_${filename}_${country}`;
        return genbyCountry;
    });
}

function template_gen (done) {
    const data = JSON.parse(fs.readFileSync('./placeholder.json', 'utf8'));
    if (!data) return Promise.reject(new Error('No local data available.'));
    const tasks = Object.keys(data).map((country) => {
        function genbyCountry() {
            const viewdata = data[country];
            return src('./src/*.mjml')
                .pipe(tap(file => {
                    const name = path.basename(file.path).replace('.mjml', '');
                    viewdata.filename = name;
                    viewdata.lang = country;
                }))
                .pipe(mjml(mjmlEngine, {validationLevel: 'strict'}))
                .pipe(handlebars(viewdata))
                .pipe(dest('./build/templates/' + country));
        }
        genbyCountry.displayName = `build_${country}`;
        return genbyCountry;
    });
    return parallel(...tasks, (parallelDone) => {
        parallelDone();
        done();
    })();
}

const main = series(template_gen);
const dist = series(handlebar_gen, set_content);

export {main as build, dist};
export default function () {
    var argv = require('yargs').argv;
    main();
    browserSync.init({
        server: {
            baseDir: './build/templates/placeholder',
            index: `${argv.t}.html`
        }
    });
    watch('./src/*.mjml', main);
    watch('./locals.json', main);
    watch('./build/template/**/*.html', done => {
        browserSync.reload();
        done();
    });
}
