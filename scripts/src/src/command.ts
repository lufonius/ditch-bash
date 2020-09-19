import { exec } from "child_process";

export abstract class Command<T> {
  protected constructor(private command: string) {}

  protected abstract convertOutput(commandOutput: string): T;

  // execute is now perfectly typed. it returns the datastructure
  // we pass in as T. convertOutput has to be implemented so that
  // it returns that datastructure.
  public async execute(): Promise<T> {
    return new Promise((resolve, reject) => {
      exec(this.command, (error, stdout, stderr) => {
        if (!!stdout) {
          console.log(stdout);
        }

        if (!!stderr) {
          console.error(stderr);
        }

        if (!!error) {
          reject(error.message);
          return;
        }

        resolve(this.convertOutput(stdout));
      });
    });
  }
}
