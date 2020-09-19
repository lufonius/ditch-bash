import { Command } from "../../command";

export class GitCloneCommand extends Command<string> {
  public constructor(params: {
    sourceBranchToClone: string;
    remoteRepositoryPath: string;
    destinationFolderPath: string;
  }) {
    const {
      sourceBranchToClone,
      remoteRepositoryPath,
      destinationFolderPath,
    } = params;
    super(
      `git clone ${remoteRepositoryPath} --branch ${sourceBranchToClone} --single-branch ${destinationFolderPath}`
    );
  }

  protected convertOutput(commandOutput: string): string {
    return commandOutput;
  }
}
