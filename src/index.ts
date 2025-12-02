#!/usr/bin/env bun
// src/index.ts

import { spawn } from "bun";
import { resolve } from "node:path";
import { homedir } from "node:os";
import { buildJudgePrompt, DEFAULT_PREFERENCES } from "./prompts";
import type { TestConfig } from "./types";

async function main() {
  const { flags, positional } = parseArgs(process.argv.slice(2));
  const userPrompt = positional[0] || "Please execute judgment";

  // Handle --help
  if (flags.help || flags.h) {
    console.log(`
claude-checker - Test your CLAUDE.md behavioral compliance

Usage: claude-checker [prompt] [options]

Arguments:
  prompt                  Initial prompt to start evaluation (default: "Please execute judgment")

Options:
  --claude-md <path>      Path to CLAUDE.md (default: ~/.claude/CLAUDE.md)
  --source <user|project> Setting source to test (default: user)
  --model <model>         Judge model: opus, sonnet, haiku (default: opus)
  --preferences <file>    Custom preferences JSON file
  --tasks <n>             Tasks per preference (default: 3)
  --help                  Show this help

Examples:
  claude-checker "Please execute judgment"           # Start with custom prompt
  claude-checker --source project                    # Test ./.claude/CLAUDE.md
  claude-checker "Begin" --model sonnet              # Use Sonnet (cheaper) as judge
  claude-checker --preferences prefs.json            # Use custom preferences
`);
    process.exit(0);
  }

  // Resolve to absolute path to avoid issues with spawned processes
  const rawPath = flags.claudeMd || flags.claudemd || `${homedir()}/.claude/CLAUDE.md`;
  const claudeMdPath = resolve(rawPath);

  const config: TestConfig = {
    claudeMdPath,
    settingSource: (flags.source as "user" | "project") || "user",
    model: flags.model || "opus",
    tasksPerPreference: Number(flags.tasks) || 3,
  };

  // Verify CLAUDE.md exists
  const claudeMdExists = await Bun.file(config.claudeMdPath).exists();
  if (!claudeMdExists) {
    console.error(`❌ CLAUDE.md not found at: ${config.claudeMdPath}`);
    console.error(`\nEither create it or specify a different path with --claude-md`);
    process.exit(1);
  }

  // Load custom preferences or use defaults
  let preferences = DEFAULT_PREFERENCES;
  if (flags.preferences) {
    const customPrefs = await Bun.file(flags.preferences).json();
    preferences = customPrefs.preferences;
  }

  console.log("🧪 claude-checker - CLAUDE.md Behavioral Compliance Tester");
  console.log("━".repeat(55));
  console.log(`CLAUDE.md:      ${config.claudeMdPath}`);
  console.log(`Setting source: ${config.settingSource}`);
  console.log(`Judge model:    ${config.model}`);
  console.log(`Preferences:    ${preferences.length}`);
  console.log("━".repeat(55));
  console.log("");
  console.log("Spawning ISOLATED judge (no settings, no MCP)...\n");

  // Build the judge's system prompt
  const systemPrompt = buildJudgePrompt(
    preferences,
    config.claudeMdPath,
    config.settingSource
  );

  // Spawn the judge in COMPLETE ISOLATION
  const proc = spawn({
    cmd: [
      "claude",
      userPrompt,
      "--model", config.model,
      "--setting-sources", "",
      "--strict-mcp-config",
      "--mcp-config", '{"mcpServers":{}}',
      "--system-prompt", systemPrompt,
    ],
    stdin: "inherit",
    stdout: "inherit",
    stderr: "inherit",
  });

  const exitCode = await proc.exited;
  process.exit(exitCode);
}

interface ParsedArgs {
  flags: Record<string, string>;
  positional: string[];
}

function parseArgs(args: string[]): ParsedArgs {
  const flags: Record<string, string> = {};
  const positional: string[] = [];

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (arg.startsWith("--")) {
      const key = arg.slice(2).replace(/-/g, "");
      if (args[i + 1] && !args[i + 1].startsWith("--")) {
        flags[key] = args[++i];
      } else {
        flags[key] = "true";
      }
    } else if (arg.startsWith("-") && arg.length === 2) {
      flags[arg.slice(1)] = "true";
    } else {
      positional.push(arg);
    }
  }

  return { flags, positional };
}

main().catch(console.error);
