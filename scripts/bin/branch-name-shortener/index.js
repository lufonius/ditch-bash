'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function shortenBranchName(branchname, length) {
    const nonSpecialChars = branchname.replace(/([^a-zA-Z0-9])/, "");
    return nonSpecialChars.slice(0, length);
}

exports.shortenBranchName = shortenBranchName;
