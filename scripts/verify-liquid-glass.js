const { spawnSync } = require("child_process");
const path = require("path");

const verifySitePath = path.join(__dirname, "verify-site.js");

const result = spawnSync(process.execPath, [verifySitePath], {
  cwd: path.resolve(__dirname, ".."),
  stdio: "inherit",
});

if (result.status !== 0) {
  process.exit(result.status || 1);
}

console.log("Liquid Glass verifier is superseded by scripts/verify-site.js.");
