# PowerShell Runner for SafeCampus Java 26 Project
Write-Host "=========================================================" -ForegroundColor Cyan
Write-Host " Building SafeCampus Java Disaster Preparedness System..." -ForegroundColor Green
Write-Host "=========================================================" -ForegroundColor Cyan

if (-not (Test-Path "bin")) {
    New-Item -ItemType Directory -Path "bin" | Out-Null
}

javac -d bin -sourcepath src src/org/disaster/Main.java
if ($LASTEXITCODE -eq 0) {
    Write-Host "Compilation Succeeded!" -ForegroundColor Green
    Write-Host "Starting Java HTTP Server on http://localhost:8080..." -ForegroundColor Yellow
    java -cp bin org.disaster.Main 8080
} else {
    Write-Host "Compilation failed with error code $LASTEXITCODE" -ForegroundColor Red
}
