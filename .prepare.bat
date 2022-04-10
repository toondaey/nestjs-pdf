@ECHO OFF

@REM This checks if husky is installed in the npm modules
@REM before setting it up. This is so no installation
@REM fails in production.

CALL npm ls husky --depth 0 > NUL
IF %ERRORLEVEL% EQU 0 (
    husky install
)
@ECHO ON
