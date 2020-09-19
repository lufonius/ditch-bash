'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var child_process = require('child_process');

/*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */

function __awaiter(thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
}

class IncrementalDependencyLoader {
    constructor(gitRepository, nodeDependencies, branch) {
        this.gitRepository = gitRepository;
        this.nodeDependencies = nodeDependencies;
        this.branch = branch;
    }
    updateOrCloneRepo() {
        return __awaiter(this, void 0, void 0, function* () {
            if (yield this.gitRepository.hasBeenClonedBefore()) {
                const changedFilesFromDiff = yield this.gitRepository.getChangedFilesSinceLastPull(this.branch);
                if (changedFilesFromDiff.length > 0) {
                    yield this.gitRepository.pull(this.branch);
                }
                return changedFilesFromDiff;
            }
            else {
                yield this.gitRepository.clone(this.branch);
                return yield this.gitRepository.listFiles();
            }
        });
    }
    updateOrKeepNodeModules(changedFiles) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.nodeDependencies.includesDependencyFiles(changedFiles)) {
                yield this.nodeDependencies.installDependencies();
            }
        });
    }
}

class CommandExecution {
    constructor(command) {
        this.command = command;
    }
    execute() {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                child_process.exec(this.command, (error, stdout, stderr) => {
                    if (!!stdout) {
                        console.log(stdout);
                    }
                    if (!!error) {
                        reject(error.message);
                        return;
                    }
                    resolve(this.convertOutput(stdout));
                });
            });
        });
    }
}

class GitCloneCommand extends CommandExecution {
    constructor(params) {
        const { sourceBranchToClone, remoteRepositoryPath, destinationFolderPath, } = params;
        super(`git clone ${remoteRepositoryPath} --branch ${sourceBranchToClone} --single-branch ${destinationFolderPath}`);
    }
    convertOutput(commandOutput) {
        return commandOutput;
    }
}

class GitFetchCommand extends CommandExecution {
    constructor(params) {
        const { remoteRepositoryPath, sourcesDirectory } = params;
        super(`git -C ${sourcesDirectory} fetch`);
    }
    convertOutput(commandOutput) {
        return commandOutput;
    }
}

class GitPullCommand extends CommandExecution {
    constructor(params) {
        const { branchToPull, directoryPathToPullInto } = params;
        super(`git -C ${directoryPathToPullInto} pull origin ${branchToPull}:${branchToPull}`);
    }
    convertOutput(commandOutput) {
        return commandOutput;
    }
}

class FindDirectoryCommand extends CommandExecution {
    constructor(params) {
        const { pathToSearchIn, directoryToFindByName } = params;
        super(`find "${pathToSearchIn}" -type d -name "${directoryToFindByName}"`);
    }
    convertOutput(commandOutput) {
        return commandOutput.trim().length > 0;
    }
}

class GitDiffCommand extends CommandExecution {
    constructor(params) {
        const { branch, directory } = params;
        super(`git -C ${directory} diff origin ${branch} ${branch} --name-only`);
    }
    convertOutput(commandOutput) {
        const lines = commandOutput.split("\n");
        lines.pop();
        return lines;
    }
}

class GitLsCommand extends CommandExecution {
    constructor(params) {
        const { directory } = params;
        super(`cd ${directory} && git ls-files`);
    }
    convertOutput(commandOutput) {
        const lines = commandOutput.split("\n");
        lines.pop();
        return lines.map((line) => line.split("/").pop());
    }
}

class GitRepository {
    constructor(remotePath, localDirectory) {
        this.remotePath = remotePath;
        this.localDirectory = localDirectory;
    }
    clone(sourceBranch) {
        return __awaiter(this, void 0, void 0, function* () {
            const gitCloneCommand = new GitCloneCommand({
                sourceBranchToClone: sourceBranch,
                destinationFolderPath: this.localDirectory,
                remoteRepositoryPath: this.remotePath,
            });
            yield gitCloneCommand.execute();
        });
    }
    pull(branchToPull) {
        return __awaiter(this, void 0, void 0, function* () {
            const gitPullCommand = new GitPullCommand({
                directoryPathToPullInto: this.localDirectory,
                branchToPull,
            });
            yield gitPullCommand.execute();
        });
    }
    hasBeenClonedBefore() {
        return __awaiter(this, void 0, void 0, function* () {
            const hasGitRepoCommand = new FindDirectoryCommand({
                directoryToFindByName: ".git",
                pathToSearchIn: this.localDirectory,
            });
            return yield hasGitRepoCommand.execute();
        });
    }
    getChangedFilesSinceLastPull(branch) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.fetch();
            const gitDiffCommand = new GitDiffCommand({
                branch,
                directory: this.localDirectory,
            });
            return yield gitDiffCommand.execute();
        });
    }
    listFiles() {
        return __awaiter(this, void 0, void 0, function* () {
            const gitLsCommand = new GitLsCommand({ directory: this.localDirectory });
            return yield gitLsCommand.execute();
        });
    }
    fetch() {
        return __awaiter(this, void 0, void 0, function* () {
            const gitFetchCommand = new GitFetchCommand({
                remoteRepositoryPath: this.remotePath,
                sourcesDirectory: this.localDirectory,
            });
            yield gitFetchCommand.execute();
        });
    }
}

class YarnInstallCommand extends CommandExecution {
    constructor(params) {
        const { directory } = params;
        super(`cd ${directory} && yarn install --frozen-lockfile`);
    }
    convertOutput(commandOutput) {
        return commandOutput;
    }
}

class NodeDependencies {
    constructor(sourcesDirectory, dependencyLockFileName, dependencyFilename) {
        this.sourcesDirectory = sourcesDirectory;
        this.dependencyLockFileName = dependencyLockFileName;
        this.dependencyFilename = dependencyFilename;
    }
    installDependencies() {
        return __awaiter(this, void 0, void 0, function* () {
            const yarnInstallCommand = new YarnInstallCommand({
                directory: this.sourcesDirectory,
            });
            yield yarnInstallCommand.execute();
        });
    }
    includesDependencyFiles(changedFiles) {
        return changedFiles.some((filename) => filename === this.dependencyLockFileName ||
            filename === this.dependencyFilename);
    }
    get dependencyFileNames() {
        return [this.dependencyFilename, this.dependencyLockFileName];
    }
}

function loadDependenciesIncrementally(gitRemotePath, branch, directory, dependencyLockFileName, dependencyFileName) {
    return __awaiter(this, void 0, void 0, function* () {
        const gitRepository = new GitRepository(gitRemotePath, directory);
        const nodeDependencies = new NodeDependencies(directory, dependencyLockFileName, dependencyFileName);
        const incrementalDependencyLoader = new IncrementalDependencyLoader(gitRepository, nodeDependencies, branch);
        try {
            const changedFiles = yield incrementalDependencyLoader.updateOrCloneRepo();
            yield incrementalDependencyLoader.updateOrKeepNodeModules(changedFiles);
        }
        catch (error) {
            console.error(Error(error));
            // see why process.exit(1); was not used https://stackoverflow.com/questions/5266152/how-to-exit-in-node-js
            process.exitCode = 1;
        }
    });
}

exports.loadDependenciesIncrementally = loadDependenciesIncrementally;
