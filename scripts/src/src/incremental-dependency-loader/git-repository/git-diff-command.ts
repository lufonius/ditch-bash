import { Command } from "../../command";

export class GitDiffCommand extends Command<string[]> {
  public constructor(params: { branch: string; directory: string }) {
    const { branch, directory } = params;
    super(`git -C ${directory} diff origin ${branch} ${branch} --name-only`);
  }

  protected convertOutput(commandOutput: string): string[] {
    const lines = commandOutput.split("\n");
    lines.pop();
    return lines;
  }
}
