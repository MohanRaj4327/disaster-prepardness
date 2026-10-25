@echo off
echo =========================================================
echo  Building SafeCampus Java Disaster Preparedness System...
echo =========================================================

if not exist bin mkdir bin

javac -d bin -sourcepath src src/org/disaster/Main.java
if %ERRORLEVEL% EQU 0 (
    echo Compilation Succeeded!
    echo Starting Java HTTP Server on http://localhost:8080...
    java -cp bin org.disaster.Main 8080
) else (
    echo Compilation failed!
    pause
)
