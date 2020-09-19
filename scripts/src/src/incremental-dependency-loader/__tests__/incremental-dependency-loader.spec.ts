import { IncrementalDependencyLoader } from "../incremental-dependency-loader";
import { anyString, instance, mock, reset, verify, when } from "ts-mockito";
import { GitRepository } from "../git-repository/git-repository";
import { NodeDependencies } from "../node-dependencies/node-dependencies";

describe("IncrementalDependencyLoader", () => {
  const gitRepositoryMock = mock(GitRepository);
  const gitRepository = instance(gitRepositoryMock);
  const nodeDependenciesMock = mock(NodeDependencies);
  const nodeDependencies = instance(nodeDependenciesMock);

  afterEach(() => {
    reset(gitRepositoryMock);
    reset(nodeDependenciesMock);
  });

  it("should clone repo if the repo hasnt been cloned before", async () => {
    const branch = "master";
    const incrementalDependencyLoader = buildIncrementalDependenciesLoader(
      branch
    );

    when(gitRepositoryMock.hasBeenClonedBefore()).thenReturn(
      Promise.resolve(false)
    );

    const filesFromClone = ["some-file"];
    when(gitRepositoryMock.listFiles()).thenReturn(
      Promise.resolve(filesFromClone)
    );

    const clonedFiles = await incrementalDependencyLoader.updateOrCloneRepo();

    verify(gitRepositoryMock.clone(branch)).once();
    verify(gitRepositoryMock.getChangedFilesSinceLastPull(branch)).never();
    verify(gitRepositoryMock.pull(branch)).never();
    expect(clonedFiles).toEqual(filesFromClone);
  });

  it("should pull repo if it has been cloned before and there are changes since last pull", async () => {
    const branch = "master";
    const incrementalDependencyLoader = buildIncrementalDependenciesLoader(
      branch
    );

    when(gitRepositoryMock.hasBeenClonedBefore()).thenReturn(
      Promise.resolve(true)
    );

    const changedFilesFromDiff = ["someirrelevantfile.txt"];
    when(gitRepositoryMock.getChangedFilesSinceLastPull(branch)).thenReturn(
      Promise.resolve(changedFilesFromDiff)
    );

    const changedFiles = await incrementalDependencyLoader.updateOrCloneRepo();

    verify(gitRepositoryMock.pull(branch)).once();
    verify(gitRepositoryMock.clone(anyString())).never();
    expect(changedFiles).toEqual(changedFilesFromDiff);
  });

  it("should not pull repo if it has been cloned before and there are no changes since last pull", async () => {
    const branch = "master";
    const incrementalDependencyLoader = buildIncrementalDependenciesLoader(
      branch
    );

    when(gitRepositoryMock.hasBeenClonedBefore()).thenReturn(
      Promise.resolve(true)
    );

    when(gitRepositoryMock.getChangedFilesSinceLastPull(branch)).thenReturn(
      Promise.resolve([])
    );

    await incrementalDependencyLoader.updateOrCloneRepo();

    verify(gitRepositoryMock.pull(branch)).never();
    verify(gitRepositoryMock.clone(anyString())).never();
  });

  it("should not load dependencies if changed files do not include dependency files", async () => {
    const branch = "master";
    const incrementalDependencyLoader = buildIncrementalDependenciesLoader(
      branch
    );

    const changedFiles = ["package.json"];
    when(nodeDependenciesMock.includesDependencyFiles(changedFiles)).thenReturn(
      true
    );

    await incrementalDependencyLoader.updateOrKeepNodeModules(changedFiles);

    verify(nodeDependenciesMock.installDependencies()).once();
  });

  it("should load dependencies if changed files include dependency files", async () => {
    const branch = "master";
    const incrementalDependencyLoader = buildIncrementalDependenciesLoader(
      branch
    );

    const changedFiles = ["something"];
    when(nodeDependenciesMock.includesDependencyFiles(changedFiles)).thenReturn(
      false
    );

    await incrementalDependencyLoader.updateOrKeepNodeModules(changedFiles);

    verify(nodeDependenciesMock.installDependencies()).never();
  });

  const buildIncrementalDependenciesLoader = (branch: string) => {
    return new IncrementalDependencyLoader(
      gitRepository,
      nodeDependencies,
      branch
    );
  };
});
