#!/usr/bin/env bash
# One model, 3-turn conversation inside the Cloud-SSD project "jaanch-site" through the real OpenCode CLI.
# Turn 1: ask about the project. Turn 2: make a file (task). Turn 3: ask what was said before (memory).
# Usage: bash oc-convo.sh <provider/model> <slug>   -> logs/model-check/oc-<slug>-*.txt
model="$1"; slug="$2"
export PATH="/c/Users/Roshan/AppData/Roaming/npm/node_modules/bun/bin:$PATH"
export OPENCODE_CONFIG_DIR="C:\\Users\\Roshan\\Downloads\\Programming\\config"
export OPENCODE_CHANNEL=local
proj="/c/Users/Roshan/Cloud-SSD/All Accounts/Coding-Projects/jaanch-site"
logs="/c/Users/Roshan/Downloads/Programming/logs/model-check"
cli_dir="C:/Users/Roshan/Downloads/Programming/opencode/packages/cli"
sid="ses_mt_${slug}_$(date +%H%M%S)"
cd "$proj" || exit 1

turn() {
  local n="$1"; shift
  local t0=$(date +%s)
  PWD="$proj" timeout 400 bun run --cwd "$cli_dir" src/index.ts run --standalone --auto --archived --session "$sid" --model "$model" "$@" \
    > "$logs/oc-$slug-$n.txt" 2>&1
  echo "exit=$? secs=$(( $(date +%s) - t0 ))" >> "$logs/oc-$slug-$n.txt"
}

turn 1 "Is project folder me kya hai? Kaunsi files hain, page ka title kya hai aur h1 heading me kya likha hai? Hinglish me chhota sa jawab do."
turn 2 "Ab ek nayi file model-test/$slug.js banao. Usme function jodo(a, b) ho jo a aur b ka jod lautaye, aur aakhir me module.exports = { jodo }. Sirf ye ek file banao, index.html mat chhuna."
turn 3 "Maine tumse sabse pehle kya poocha tha, aur abhi tumne kaunsi file banayi? Ek line me batao."

# Check the task really worked.
f="$proj/model-test/$slug.js"
if [ -f "$f" ]; then
  r=$(node -e "try{console.log(require(process.argv[1]).jodo(2,3))}catch(e){console.log('ERR '+e.message)}" "$(cygpath -w "$f")")
  echo "FILE ok, jodo(2,3)=$r" > "$logs/oc-$slug-check.txt"
else
  echo "FILE missing" > "$logs/oc-$slug-check.txt"
fi
