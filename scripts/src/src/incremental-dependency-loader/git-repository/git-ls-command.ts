import { Command } from "../../command";

export class GitLsCommand extends Command<string[]> {
  public constructor(params: { directory: string }) {
    const { directory } = params;
    super(`cd ${directory} && git ls-files`);
  }

  protected convertOutput(commandOutput: string): string[] {
    const lines = commandOutput.split("\n");
    lines.pop();
    return lines.map((line) => line.split("/").pop());
  }
}
