import { Command } from "../../command";

export class GitFetchCommand extends Command<string> {
  public constructor(params: {
    sourcesDirectory: string;
  }) {
    const { sourcesDirectory } = params;
    super(`git -C ${sourcesDirectory} fetch`);
  }

  protected convertOutput(commandOutput: string): string {
    return commandOutput;
  }
}
