const esbuild = require("esbuild");
const fs = require("fs-extra");

// Page script
esbuild.buildSync({
    entryPoints: ["src/index.ts"],
    bundle: true,
    format: "iife",
    target: "es2020",
    outfile: "dist/index.js"
});

// Content script
esbuild.buildSync({
    entryPoints: ["src/injector.ts"],
    bundle: false,
    format: "iife",
    target: "es2020",
    outfile: "dist/injector.js"
});

// Popup script
esbuild.buildSync({
    entryPoints: ["src/popup.ts"],
    bundle: true,
    format: "esm",
    target: "es2020",
    outfile: "dist/popup.js"
});

// Copy public folder contents to dist
fs.copySync("public", "dist", { overwrite: true });