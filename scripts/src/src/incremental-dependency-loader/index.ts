import { IncrementalDependencyLoader } from "./incremental-dependency-loader";
import { GitRepository } from "./git-repository/git-repository";
import { NodeDependencies } from "./node-dependencies/node-dependencies";

export async function loadDependenciesIncrementally(
  gitRemotePath: string,
  branch: string,
  directory: string,
  dependencyLockFileName: string,
  dependencyFileName: string
) {
  const gitRepository = new GitRepository(gitRemotePath, directory);
  const nodeDependencies = new NodeDependencies(
    directory,
    dependencyLockFileName,
    dependencyFileName
  );

  const incrementalDependencyLoader = new IncrementalDependencyLoader(
    gitRepository,
    nodeDependencies,
    branch
  );

  try {
    const changedFiles = await incrementalDependencyLoader.updateOrCloneRepo();
    await incrementalDependencyLoader.updateOrKeepNodeModules(changedFiles);
  } catch (error) {
    console.error(Error(error));
    // see why process.exit(1); was not used https://stackoverflow.com/questions/5266152/how-to-exit-in-node-js
    process.exitCode = 1;
  }
}
