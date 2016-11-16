const path = require('path')
const json = require('rollup-plugin-json')
const babel = require('rollup-plugin-babel')
const typescript = require('rollup-plugin-typescript')
const istanbul = require('rollup-plugin-istanbul')
const commonjs = require('rollup-plugin-commonjs')

const version = process.env.VERSION || require('../package.json').version

const banner =
  '/*!\n' +
  ' * XQ.js v' + version + '\n' +
  ' * (c) 2016-' + new Date().getFullYear() + ' FuYin\n' +
  ' * Released under the MIT License.\n' +
  ' */'
// console.log(path.resolve(__dirname, 'src/entries/web-runtime.js'))

export default {
  entry: path.resolve('./index.tsx'),
  dest: path.resolve('./dist/bundle.js'),
  format: 'umd',
  external: [
    'react'
  ],
  plugins: [
    typescript(),
    babel({
      babelrc: false,
      presets: ['es2015-rollup', 'react'],
      exclude: 'node_modules/**'
    }),
    json(),
    commonjs({
      include: 'node_modules/**'
    })
  ],
  banner
}