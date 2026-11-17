#!/bin/sh
# usage: runreq.sh <name> <mode: direct|orchestrator> <request>
TOKEN=$(curl -s http://127.0.0.1:4510/ | grep -o '"token":"[a-f0-9]*"' | cut -d'"' -f4)
node -e 'require("fs").writeFileSync(process.argv[1]+".json", JSON.stringify({request: process.argv[3], mode: process.argv[2], project: "C:/Users/Roshan/Downloads/ecosystem-test-project"}))' "$1" "$2" "$3"
S=$(date +%s)
curl -sN --max-time 590 -H "x-sangam-token: $TOKEN" -H 'Content-Type: application/json' http://127.0.0.1:4510/api/run --data-binary @"$1.json" > "$1.out"
echo "===== $1 [$2] ($(( $(date +%s) - S ))s): $3"
grep -E "^ROUTED:|^ROUTE:|^MODEL:|^REASON:|khatam|^\$ |^→|^←|^•|^> |Error|error" "$1.out" | cut -c1-200 | head -16
echo "--- answer (tail)"; grep -vE "^\[Sangam\]|^ROUTED:|^$" "$1.out" | tail -5 | cut -c1-220
