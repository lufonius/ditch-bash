#!/usr/bin/env node

const commandLineArgs = require('command-line-args');
const branchNameShortener = require('./index.js');

(() => {
    const branchNameShortenerOptions = [
        { name: 'branchName', alias: 'b', type: String },
        { name: 'length', alias: 'l', type: Number }
    ];

    const {
        branchName,
        length
    } = commandLineArgs(branchNameShortenerOptions);

    console.log(branchNameShortener.shortenBranchName(branchName, length));
})();



