'use strict';
const autoprefixer = require('autoprefixer')
const fs = require('fs');
const packageJSON = require('../package.json');
const upath = require('upath');
const postcss = require('postcss')
const sass = require('sass');
const sh = require('shelljs');

const stylesPath = '../src/scss/technobureau.scss';
const destPath = upath.resolve(upath.dirname(__filename), '../dist/css/technobureau.css');

module.exports = function renderSCSS() {
    
    const results = sass.renderSync({
        data: entryPoint,
        includePaths: [
            upath.resolve(upath.dirname(__filename), '../node_modules')
        ],
      });

    const destPathDirname = upath.dirname(destPath);
    if (!sh.test('-e', destPathDirname)) {
        sh.mkdir('-p', destPathDirname);
    }

    postcss([ autoprefixer ]).process(results.css, {from: 'technobureau.css', to: 'technobureau.css'}).then(result => {
        result.warnings().forEach(warn => {
            console.warn(warn.toString())
        })
        fs.writeFileSync(destPath, result.css.toString());
    })

};

const entryPoint = `/*!
* TechnoBureau - ${packageJSON.title} v${packageJSON.version} (${packageJSON.homepage})
* Copyright 2013-${new Date().getFullYear()} ${packageJSON.author}
* Licensed under ${packageJSON.license} (https://github.com/TechnoBureau/${packageJSON.name}/blob/master/LICENSE)
*/
@import "${stylesPath}"
`