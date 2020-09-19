import { GitRepository } from "./git-repository/git-repository";
import { NodeDependencies } from "./node-dependencies/node-dependencies";

export class IncrementalDependencyLoader {
  public constructor(
    private gitRepository: GitRepository,
    private nodeDependencies: NodeDependencies,
    private branch: string
  ) {}

  public async updateOrCloneRepo(): Promise<string[]> {
    if (await this.gitRepository.hasBeenClonedBefore()) {
      const changedFilesFromDiff = await this.gitRepository.getChangedFilesSinceLastPull(
        this.branch
      );

      if (changedFilesFromDiff.length > 0) {
        await this.gitRepository.pull(this.branch);
      }

      return changedFilesFromDiff;
    } else {
      await this.gitRepository.clone(this.branch);
      return await this.gitRepository.listFiles();
    }
  }

  public async updateOrKeepNodeModules(changedFiles: string[]) {
    if (this.nodeDependencies.includesDependencyFiles(changedFiles)) {
      await this.nodeDependencies.installDependencies();
    }
  }
}
