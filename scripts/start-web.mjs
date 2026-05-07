import { spawn } from "node:child_process";
import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, "..");
const configPath = path.resolve(projectRoot, process.env.WEB_CONFIG_FILE ?? "web.config.json");
const command = process.argv[2] ?? "start";
const allowedCommands = new Set(["dev", "start"]);

if (!allowedCommands.has(command)) {
  console.error(`Unsupported web command "${command}". Use "dev" or "start".`);
  process.exit(1);
}

function readWebConfig() {
  try {
    return JSON.parse(readFileSync(configPath, "utf8"));
  } catch (error) {
    console.error(`Failed to read web config: ${configPath}`);
    console.error(error.message);
    process.exit(1);
  }
}

function normalizeHost(value) {
  if (typeof value !== "string" || value.trim() === "") {
    console.error("web.config.json must set a non-empty string host.");
    process.exit(1);
  }

  return value.trim();
}

function normalizePort(value) {
  const port = Number(value);

  if (!Number.isInteger(port) || port < 1 || port > 65535) {
    console.error("web.config.json must set port to an integer from 1 to 65535.");
    process.exit(1);
  }

  return String(port);
}

const webConfig = readWebConfig();
const host = normalizeHost(webConfig.host);
const port = normalizePort(webConfig.port);
const nextCli = path.join(projectRoot, "node_modules", "next", "dist", "bin", "next");
const child = spawn(
  process.execPath,
  [nextCli, command, "-H", host, "-p", port, ...process.argv.slice(3)],
  {
    cwd: projectRoot,
    env: process.env,
    stdio: "inherit",
  },
);

child.on("exit", (code, signal) => {
  if (signal) {
    process.kill(process.pid, signal);
    return;
  }

  process.exit(code ?? 1);
});
