# PowerShell script to set the environment
param(
    [Parameter(Mandatory=$true)]
    [ValidateSet('sit1', 'uat1', 'staging1')]
    [string]$Environment
)

$envDir = Join-Path $PSScriptRoot ".." "env"
$sourceEnvFile = Join-Path $envDir ".env.$Environment"
$targetEnvFile = Join-Path $envDir ".env"

if (Test-Path $sourceEnvFile) {
    Copy-Item $sourceEnvFile $targetEnvFile -Force
    Write-Host "Environment set to $Environment"
    Write-Host "Copied $sourceEnvFile to $targetEnvFile"
} else {
    Write-Error "Environment file for $Environment not found at $sourceEnvFile"
}