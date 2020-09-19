import { YarnInstallCommand } from "./yarn-install-command";

export class NodeDependencies {
  constructor(
    private sourcesDirectory: string,
    private dependencyLockFileName: string,
    private dependencyFilename: string
  ) {}

  public async installDependencies() {
    const yarnInstallCommand = new YarnInstallCommand({
      directory: this.sourcesDirectory,
    });
    await yarnInstallCommand.execute();
  }

  public includesDependencyFiles(changedFiles: string[]) {
    return changedFiles.some(
      (filename) =>
        filename === this.dependencyLockFileName ||
        filename === this.dependencyFilename
    );
  }

  public get dependencyFileNames() {
    return [this.dependencyFilename, this.dependencyLockFileName];
  }
}
