/*
 * @Author: 黄昱森
 * @LastEditors: 黄昱森
 * @Description: 
 */
import { defineConfig } from 'rollup';
import nodeResolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import externals from "rollup-plugin-node-externals";
import json from "@rollup/plugin-json";
import terser from "@rollup/plugin-terser";
import typescript from 'rollup-plugin-typescript2';

export default defineConfig({
  input: {
    index: 'src/index.ts' // 入口文件
  },
  output: {
    dir: 'dist',
    format: 'cjs', // 脚手架工具运行在node环境，所以打包格式为cjs,
  },
  plugins: [
    nodeResolve({
      exportConditions: ['node'],
    }),
    externals({
      devDeps: false, // package.json中的依赖当作外部依赖处理 不会直接将其中引用的方法打包出来
    }),
    typescript(),
    json(),
    commonjs(),
    terser(),
  ]
})