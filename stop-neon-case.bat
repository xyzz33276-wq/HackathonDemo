@echo off
powershell -NoProfile -ExecutionPolicy Bypass -Command "$ports = Get-NetTCPConnection -LocalPort 8797 -ErrorAction SilentlyContinue; if (-not $ports) { Write-Host 'Neon Case is not running on port 8797.'; exit 0 }; $ports | Select-Object -ExpandProperty OwningProcess -Unique | ForEach-Object { try { Stop-Process -Id $_ -Force; Write-Host \"Stopped Neon Case process $_\" } catch { Write-Host \"Failed to stop process $_\" } }"
pause
