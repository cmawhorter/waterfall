import rollup from 'rollup';

import babel from 'rollup-plugin-babel';
import nodeResolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';

export default {
  entry:              'src/main.js',
  sourceMap:          true,
  plugins: [
    nodeResolve({
      jsnext:         true,
      main:           true,
      browser:        true,
    }),
    commonjs({
      include:        'node_modules/**',
    }),
    babel({
      exclude:        'node_modules/**',
      babelrc:        false,
      presets:        [ [ 'es2015', { modules: false } ] ],
      plugins:        [ 'external-helpers' ],
    }),
  ],
  targets: [
    { dest: 'dist/waterfall.umd.js', format: 'umd', moduleName: 'waterfall' },
    { dest: 'dist/waterfall.es2015.js', format: 'es' },
  ],
}
