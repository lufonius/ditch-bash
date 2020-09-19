import { Command } from "./command";

export class FindDirectoryCommand extends Command<boolean> {
  public constructor(params: {
    pathToSearchIn: string;
    directoryToFindByName: string;
  }) {
    const { pathToSearchIn, directoryToFindByName } = params;
    super(`find "${pathToSearchIn}" -type d -name "${directoryToFindByName}"`);
  }
  protected convertOutput(commandOutput: string): boolean {
    return commandOutput.trim().length > 0;
  }
}
