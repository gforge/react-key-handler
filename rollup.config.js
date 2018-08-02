import rollupBabel from 'rollup-plugin-babel';
import commonjs from 'rollup-plugin-commonjs';
import filesize from 'rollup-plugin-filesize';
import { terser } from 'rollup-plugin-terser';
import sourceMaps from 'rollup-plugin-sourcemaps';
import pkg from './package.json';

const commonJsResolver = commonjs({
  // non-CommonJS modules will be ignored, but you can also
  // specifically include/exclude files
  include: 'node_modules/**',  // Default: undefined
  // these values can also be regular expressions
  // include: /node_modules/

  // search for files other than .js files (must already
  // be transpiled by a previous plugin!)
  extensions: ['.js', '.coffee', '.json'],  // Default: [ '.js' ]

  // if true then uses of `global` won't be dealt with by this plugin
  ignoreGlobal: true,  // Default: false

  // if false then skip sourceMap generation for CommonJS modules
  sourceMap: true,  // Default: true

  namedExports: {
    // left-hand side can be an absolute path, a path
    // relative to the current directory, or the name
    // of a module in node_modules
    'node_modules/exenv/index.js': [ 'canUseDOM' ],
  },
});


const sharedPlugins = [
  commonJsResolver,
  rollupBabel({
    babelrc: false,
    presets: [
      ['env', { modules: false }],
      'stage-1',
      'react',
      'flow',
    ],
    plugins: ['transform-class-properties', 'external-helpers'],
  }),
];


const shared = {
  input: 'lib/index.js',
  external: ['react', 'prop-types'],
};

export default [
  {
    ...shared,
    output: {
      name: 'react-key-handler',
      file:
        process.env.NODE_ENV === 'production'
          ? './dist/keyhandler.umd.min.js'
          : './dist/keyhandler.umd.js',
      format: 'umd',
      exports: 'named',
      sourcemap: process.env.NODE_ENV !== 'production',
      globals: { react: 'React', 'prop-types': 'PropsTypes', exenv: 'exenv' },
    },
    plugins: [
      ...sharedPlugins,
      process.env.NODE_ENV === 'production' && filesize(),
      process.env.NODE_ENV === 'production' &&
          terser({
            output: { comments: false },
            compress: {
              keep_infinity: true,
              pure_getters: true,
            },
            warnings: true,
            ecma: 6,
            toplevel: false,
          }),
    ],
  },
  {
    ...shared,
    external: shared.external.concat(Object.keys(pkg.dependencies)),
    output: [
      {
        file: 'dist/keyhandler.es6.js',
        format: 'es',
        exports: 'named',
        sourcemap: true,
      },
      {
        file: 'dist/keyhandler.js',
        format: 'cjs',
        exports: 'named',
        sourcemap: true,
      },
    ],
    plugins: [
      ...sharedPlugins,
      sourceMaps(),
      process.env.NODE_ENV === 'production' && filesize(),
    ],
  },
];
