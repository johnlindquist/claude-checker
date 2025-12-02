#!/bin/bash
# PreToolUse hook: auto-allow any Bash command containing "claude --model haiku"

# Read the tool input from stdin
input=$(cat)

# Check if this is a Bash tool and contains "claude --model haiku"
if echo "$input" | grep -q '"tool_name".*"Bash"' && echo "$input" | grep -q 'claude --model haiku'; then
  echo '{"decision": "allow"}'
  exit 0
fi

# For all other commands, let normal permission flow handle it
exit 0
