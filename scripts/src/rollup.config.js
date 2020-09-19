import typescript from '@rollup/plugin-typescript';

const incrementalDependencyLoader = {
  input: 'src/incremental-dependency-loader/index.ts',
  output: {
    dir: '../bin/incremental-dependency-loader',
    format: 'cjs'
  },
  plugins: [typescript()]
};

const branchNameShortener = {
  input: 'src/branch-name-shortener/index.ts',
  output: {
    dir: '../bin/branch-name-shortener',
    format: 'cjs'
  },
  plugins: [typescript()]
};

export default [
  incrementalDependencyLoader,
  branchNameShortener
];

