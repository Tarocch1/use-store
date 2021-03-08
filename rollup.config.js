import pkg from './package.json';
import { babel } from '@rollup/plugin-babel';

const input = 'src/index.js';
const deps = Object.keys(pkg.peerDependencies);
const external = id => deps.includes(id) || id.includes('@babel/runtime/');

export default [
  {
    input,
    output: { file: pkg.main, format: 'cjs' },
    external,
    plugins: [babel({ babelHelpers: 'bundled' })],
  },
  {
    input,
    output: { file: pkg.module, format: 'es' },
    external,
    plugins: [babel({ babelHelpers: 'bundled' })],
  },
];
