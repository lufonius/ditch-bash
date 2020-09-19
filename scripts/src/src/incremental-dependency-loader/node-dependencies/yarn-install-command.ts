import { Command } from "../../command";

export class YarnInstallCommand extends Command<string> {
  public constructor(params: { directory: string }) {
    const { directory } = params;
    super(`cd ${directory} && yarn install --frozen-lockfile`);
  }

  protected convertOutput(commandOutput: string): string {
    return commandOutput;
  }
}
