import typescript from "rollup-plugin-typescript2";
import commonjs from '@rollup/plugin-commonjs';
import babel from '@rollup/plugin-babel';
import {terser} from "rollup-plugin-terser";
import nodeResolve from "@rollup/plugin-node-resolve";

const external = id => !id.startsWith('\0') && !id.startsWith('.') && !id.startsWith('/');

const baseConfig = {
    input: "lib/index.ts",
    plugins: [
        babel({
            exclude: "node_modules/**",
            babelHelpers: "bundled",
        }),
        nodeResolve(),
        typescript({useTsconfigDeclarationDir: true}),
        commonjs({extensions: ['.js', '.ts', '.tsx']}), // the ".ts" extension is required
    ],
    external: external,
};

const minifyConfig = {
    ...baseConfig,
    plugins: [
        ...baseConfig.plugins,
        terser()
    ]
}

export default [
    Object.assign(
        {
            output: {
                file: "cjs/index.js",
                format: "cjs",
                exports: "named",
                sourcemap: true
            }
        },
        baseConfig
    ),
    Object.assign(
        {
            output: {
                file: "cjs/index.min.js",
                format: "cjs",
                exports: "named",
                sourcemap: true
            }
        },
        minifyConfig
    ),
    Object.assign(
        {
            output: {
                file: "es/index.js",
                format: "esm",
                exports: "named",
                sourcemap: true
            }
        },
        baseConfig
    )
];
