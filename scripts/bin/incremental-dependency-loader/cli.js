#!/usr/bin/env node

const commandLineArgs = require('command-line-args');
const incrementalDependencyLoader = require('./index.js');

(async () => {
    const loadDependenciesIncrementallyCommand = [
        { name: 'remoteSSH', alias: 'r', type: String },
        { name: 'branch', alias: 'b', type: String },
        { name: 'directory', alias: 'd', type: String },
        { name: 'dependencyLockFileName', alias: 'l', type: String },
        { name: 'dependencyFileName', alias: 'f', type: String }
    ];

    const {
        remoteSSH,
        branch,
        directory,
        dependencyLockFileName,
        dependencyFileName
    } = commandLineArgs(loadDependenciesIncrementallyCommand);

    await incrementalDependencyLoader.loadDependenciesIncrementally(
        remoteSSH,
        branch,
        directory,
        dependencyLockFileName,
        dependencyFileName
    );
})();
