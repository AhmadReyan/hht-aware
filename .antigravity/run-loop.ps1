# run-loop.ps1 — keeps the Antigravity autonomous loop running.
#
# WHY THIS EXISTS: an agent completes one turn and its process exits. It does not
# loop forever on its own. This script re-invokes the Antigravity CLI once per
# cycle, so the loop in .antigravity/LOOP.md actually keeps going. Stop it any
# time by creating a file named STOP in this folder (.antigravity/STOP).
#
# USAGE:
#   1. Set $Launcher below to how YOU run Antigravity non-interactively (see notes).
#   2. From the repo root:  powershell -ExecutionPolicy Bypass -File .antigravity\run-loop.ps1
#   3. To stop:             New-Item .antigravity\STOP   (delete it to allow a fresh start)

param(
  [int]$IntervalSeconds = 120,   # pause between cycles — keep >=60 to avoid rate limits
  [int]$MaxCycles = 0            # 0 = run forever (until STOP file)
)

$ErrorActionPreference = 'Continue'
$repo = Split-Path -Parent $PSScriptRoot
Set-Location $repo
$stopFile = Join-Path $PSScriptRoot 'STOP'
$logDir = Join-Path $PSScriptRoot 'logs'
New-Item -ItemType Directory -Force $logDir | Out-Null

# The instruction handed to Antigravity each cycle. One cycle only, then it exits
# and this script fires the next one.
$prompt = @'
Read AGENTS.md and .antigravity/LOOP.md, then run EXACTLY ONE cycle of the loop:
pick the top unblocked item from .antigravity/BACKLOG.md, implement it, adversarially
review the diff, then VERIFY (npm run lint + npm run build + a headless screenshot of
any changed route which you actually inspect). Only if fully green, commit (staging
ONLY the files you changed) and push. Then update BACKLOG.md and CHANGELOG.md (read the
sha from `git rev-parse HEAD` AFTER committing). Obey every guardrail in AGENTS.md. If
verification fails twice, or the task needs a human/new dependency/infra change, STOP
without committing and say why. Do exactly one cycle, then end your turn.
'@

# ============================================================================
#  EDIT THIS: how to launch Antigravity for one non-interactive run.
#  It must take the prompt text and run a single turn, then exit.
#  Replace the body with your real command, e.g. one of:
#     antigravity run --model gemini-3.6-flash --yes $p
#     antigravity -p $p
#     ag chat --headless --message $p
#  (Check `antigravity --help` for the exact non-interactive / headless flags.)
# ============================================================================
$Launcher = {
  param($p)
  Write-Host "!! Set `$Launcher in .antigravity/run-loop.ps1 to your Antigravity CLI command." -ForegroundColor Yellow
  throw "Launcher not configured"
}

$cycle = 0
Write-Host "Antigravity loop runner started. Stop with: New-Item $stopFile" -ForegroundColor Cyan
while ($true) {
  if (Test-Path $stopFile) { Write-Host "STOP file present — exiting cleanly."; break }
  if ($MaxCycles -gt 0 -and $cycle -ge $MaxCycles) { Write-Host "Reached MaxCycles=$MaxCycles — exiting."; break }
  $cycle++
  $stamp = Get-Date -Format 'yyyy-MM-dd_HH-mm-ss'
  $log = Join-Path $logDir "cycle-$stamp.log"
  Write-Host "`n=== Cycle $cycle @ $stamp ===" -ForegroundColor Green
  try {
    & $Launcher $prompt *>&1 | Tee-Object -FilePath $log
  } catch {
    "Cycle $cycle errored: $($_.Exception.Message)" | Tee-Object -FilePath $log -Append | Write-Host
    # Back off a bit on error so we don't spin against a broken CLI/rate limit.
    Start-Sleep -Seconds ([Math]::Max($IntervalSeconds, 60))
  }
  if (Test-Path $stopFile) { Write-Host "STOP file present — exiting cleanly."; break }
  Write-Host "Cycle $cycle done. Sleeping $IntervalSeconds s…  (create $stopFile to stop)"
  Start-Sleep -Seconds $IntervalSeconds
}
