import { Command } from "../../command";

export class GitPullCommand extends Command<string> {
  public constructor(params: {
    branchToPull: string;
    directoryPathToPullInto: string;
  }) {
    const { branchToPull, directoryPathToPullInto } = params;
    super(
      `git -C ${directoryPathToPullInto} pull origin ${branchToPull}:${branchToPull}`
    );
  }

  protected convertOutput(commandOutput: string): string {
    return commandOutput;
  }
}
