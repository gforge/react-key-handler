const rollupBabel = require('rollup-plugin-babel')
const resolve = require('rollup-plugin-node-resolve');
const commonjs = require('rollup-plugin-commonjs');

module.exports = {
  input: './lib/index.js',
  output: {
    file: './dist/keyhandler.es.js',
    format: 'es',
    exports: 'named',
  },
  external: ['react'],
  plugins: [
    rollupBabel({
      babelrc: false,
      presets: [
        'stage-1',
        'react',
        'flow',
      ],
      plugins: ['transform-class-properties'],
    }),
    resolve(),
    commonjs({
      include: 'node_modules/**',  // Default: undefined
      // these values can also be regular expressions
      // include: /node_modules/

      // search for files other than .js files (must already
      // be transpiled by a previous plugin!)
      extensions: ['.js', '.coffee', '.json'],  // Default: [ '.js' ]

      // if true then uses of `global` won't be dealt with by this plugin
      ignoreGlobal: true,  // Default: false

      namedExports: {
        // left-hand side can be an absolute path, a path
        // relative to the current directory, or the name
        // of a module in node_modules
        'node_modules/exenv/index.js': [ 'canUseDOM' ]
      }
    }),
  ],
}
