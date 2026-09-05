import { spawn } from "node:child_process";
import process from "node:process";

const services = [
  { name: "gateway", script: "gateway/index.js", port: process.env.PORT || 8000 },
  { name: "auth", script: "services/auth/index.js", port: 8001 },
  { name: "chat", script: "services/chat/index.js", port: 8002 },
  { name: "agent", script: "services/agent/index.js", port: 8003 },
];

if (!process.env.AUTH_SERVICE) process.env.AUTH_SERVICE = "http://localhost:8001";
if (!process.env.CHAT_SERVICE) process.env.CHAT_SERVICE = "http://localhost:8002";
if (!process.env.AGENT_SERVICE) process.env.AGENT_SERVICE = "http://localhost:8003";

const children = services.map(({ name, script, port }) => {
  const child = spawn(process.execPath, [script], {
    env: { ...process.env, PORT: String(port) },
    stdio: ["inherit", "pipe", "pipe"],
  });

  child.stdout.on("data", (chunk) => process.stdout.write(`[${name}] ${chunk}`));
  child.stderr.on("data", (chunk) => process.stderr.write(`[${name}] ${chunk}`));

  child.on("exit", (code) => {
    console.error(`[${name}] exited with code ${code}`);
    if (code !== 0) process.exit(1);
  });

  return child;
});

for (const signal of ["SIGINT", "SIGTERM"]) {
  process.on(signal, () => {
    children.forEach((child) => child.kill(signal));
  });
}