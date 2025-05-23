import typescript from "rollup-plugin-typescript2";
import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import json from "@rollup/plugin-json";
import { uglify } from "rollup-plugin-uglify";
import dts from "rollup-plugin-dts";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const packagesDir = path.resolve(__dirname, "packages");
const packageFiles = fs.readdirSync(packagesDir);

/**
 * @returns {import ('rollup').RollupOptions}
 */
const output = (name) => {
  return [
    {
      input: [path.resolve(packagesDir, name, "index.ts")],
      output: [
        {
          file: path.resolve(packagesDir, name, "dist/cjs/index.cjs.js"),
          format: "cjs",
          name: "cds-moditor",
          sourcemap: true,
        },
        {
          file: path.resolve(packagesDir, name, "dist/esm/index.esm.js"),
          format: "esm",
          name: "cds-moditor",
          sourcemap: true,
        },
        {
          file: path.resolve(packagesDir, name, "dist/index.js"),
          format: "umd",
          name: "cds-moditor",
          sourcemap: true,
          plugins: [uglify()],
        },
        {
          file: path.resolve(packagesDir, name, "dist/umd/index.umd.js"),
          format: "umd",
          name: "cds-moditor",
          sourcemap: true,
        },
      ],
      plugins: [
        typescript({
          exclude: ["**/__tests__"],
          tsconfigOverride: {
            compilerOptions: {
              declaration: true,
              declarationDir: path.resolve(packagesDir, name, "dist"),
            },
            useTsconfigDeclarationDir: true,
          },
        }),
        resolve(),
        commonjs(),
        json(),
      ],
    },
    {
      input: [path.resolve(packagesDir, name, "index.ts")],
      output: [
        {
          file: path.resolve(packagesDir, name, "dist/cjs/index.cjs.d.ts"),
          format: "cjs",
        },
        {
          file: path.resolve(packagesDir, name, "dist/esm/index.esm.d.ts"),
          format: "esm",
        },
        {
          file: path.resolve(packagesDir, name, "dist/index.d.ts"),
          format: "umd",
        },
        {
          file: path.resolve(packagesDir, name, "dist/umd/index.umd.d.ts"),
          format: "umd",
        },
      ],
      plugins: [dts()],
    },
  ];
};

export default packageFiles.map((file) => output(file)).flat();
