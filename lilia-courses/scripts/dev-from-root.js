#!/usr/bin/env node
/**
 * Run next dev from the project root so public/ and images load correctly.
 * Usage: node scripts/dev-from-root.js   OR   npm run dev
 * (Use this if "npm run dev" from parent folder breaks image loading.)
 */
const path = require("path");
const { spawn } = require("child_process");

const projectRoot = path.resolve(path.join(__dirname, ".."));
process.chdir(projectRoot);
process.env.NEXT_PROJECT_ROOT = projectRoot;

const child = spawn("npx", ["next", "dev"], {
  stdio: "inherit",
  shell: true,
  env: { ...process.env, NEXT_PROJECT_ROOT: projectRoot },
});
child.on("exit", (code) => process.exit(code ?? 0));
