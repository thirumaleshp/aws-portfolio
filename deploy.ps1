<#
  deploy.ps1 - package the static site and ship it to AWS Amplify Hosting.

  Usage:  .\deploy.ps1

  Uses Amplify's manual (zip) deployment API, so no GitHub OAuth connection
  is required.

  Note: PowerShell's Compress-Archive writes backslash path separators into
  zip entries, which Amplify unpacks as flat filenames and then 404s on.
  This uses `tar` instead, which writes forward slashes. Kept ASCII-only so
  Windows PowerShell 5.1 parses it regardless of file encoding.
#>

$ErrorActionPreference = 'Stop'

$AppId  = 'd2kch2pensq2r2'
$Region = 'ap-south-1'
$Branch = 'main'

$root = $PSScriptRoot
$dist = Join-Path $env:TEMP 'portfolio-dist'
$zip  = Join-Path $env:TEMP 'site.zip'

Write-Host "[1/3] packaging..." -ForegroundColor Cyan
Remove-Item -Recurse -Force $dist -ErrorAction SilentlyContinue
Remove-Item -Force $zip -ErrorAction SilentlyContinue
New-Item -ItemType Directory -Force $dist | Out-Null

Copy-Item (Join-Path $root 'index.html') $dist
Copy-Item -Recurse (Join-Path $root 'css') $dist
Copy-Item -Recurse (Join-Path $root 'js')  $dist

Push-Location $dist
tar -a -c -f $zip index.html css js
Pop-Location

Write-Host "[2/3] uploading ($([math]::Round((Get-Item $zip).Length / 1KB, 1)) KB)..." -ForegroundColor Cyan
$d = aws amplify create-deployment --app-id $AppId --branch-name $Branch --region $Region --output json | ConvertFrom-Json
Invoke-WebRequest -Uri $d.zipUploadUrl -Method Put -InFile $zip -ContentType 'application/zip' -UseBasicParsing | Out-Null
aws amplify start-deployment --app-id $AppId --branch-name $Branch --job-id $d.jobId --region $Region --output json | Out-Null

Write-Host "[3/3] deploying job $($d.jobId)..." -ForegroundColor Cyan
for ($i = 0; $i -lt 30; $i++) {
  $status = (aws amplify get-job --app-id $AppId --branch-name $Branch --job-id $d.jobId --region $Region --output json | ConvertFrom-Json).job.summary.status
  if ($status -in @('SUCCEED', 'FAILED', 'CANCELLED')) { break }
  Start-Sleep -Seconds 5
}

$url = "https://$Branch.$AppId.amplifyapp.com"
if ($status -eq 'SUCCEED') {
  Write-Host "OK - live at $url" -ForegroundColor Green
} else {
  Write-Host "FAILED - deployment status: $status" -ForegroundColor Red
  exit 1
}
