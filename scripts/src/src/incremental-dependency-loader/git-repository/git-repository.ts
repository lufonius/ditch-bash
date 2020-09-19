import { GitCloneCommand } from "./git-clone-command";
import { GitFetchCommand } from "./git-fetch-command";
import { GitPullCommand } from "./git-pull-command";
import { FindDirectoryCommand } from "../../find-directory-command";
import { GitDiffCommand } from "./git-diff-command";
import { GitLsCommand } from "./git-ls-command";

export class GitRepository {
  constructor(private remotePath: string, private localDirectory: string) {}

  public async clone(sourceBranch: string) {
    const gitCloneCommand = new GitCloneCommand({
      sourceBranchToClone: sourceBranch,
      destinationFolderPath: this.localDirectory,
      remoteRepositoryPath: this.remotePath,
    });

    await gitCloneCommand.execute();
  }

  public async pull(branchToPull: string) {
    const gitPullCommand = new GitPullCommand({
      directoryPathToPullInto: this.localDirectory,
      branchToPull,
    });

    await gitPullCommand.execute();
  }

  public async hasBeenClonedBefore(): Promise<boolean> {
    const hasGitRepoCommand = new FindDirectoryCommand({
      directoryToFindByName: ".git",
      pathToSearchIn: this.localDirectory,
    });

    return await hasGitRepoCommand.execute();
  }

  public async getChangedFilesSinceLastPull(branch: string): Promise<string[]> {
    await this.fetch();
    const gitDiffCommand = new GitDiffCommand({
      branch,
      directory: this.localDirectory,
    });

    return await gitDiffCommand.execute();
  }

  public async listFiles(): Promise<string[]> {
    const gitLsCommand = new GitLsCommand({ directory: this.localDirectory });
    return await gitLsCommand.execute();
  }

  private async fetch() {
    const gitFetchCommand = new GitFetchCommand({
      sourcesDirectory: this.localDirectory,
    });

    await gitFetchCommand.execute();
  }
}
