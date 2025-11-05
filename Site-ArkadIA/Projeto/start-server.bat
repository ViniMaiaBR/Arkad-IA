@echo off
echo ========================================
echo   ARKAD AI - Servidor Local HTTP
echo ========================================
echo.
echo Iniciando servidor HTTP na porta 8000...
echo.

cd /d "%~dp0"

REM Tentar Python 3 primeiro
python --version >nul 2>&1
if %errorlevel% equ 0 (
    echo Usando Python...
    echo.
    echo Acesse: http://localhost:8000/Index/documentos.html
    echo.
    echo Pressione Ctrl+C para parar o servidor
    echo.
    echo ========================================
    echo.
    python -m http.server 8000
    goto :end
)

REM Tentar Python3
python3 --version >nul 2>&1
if %errorlevel% equ 0 (
    echo Usando Python3...
    echo.
    echo Acesse: http://localhost:8000/Index/documentos.html
    echo.
    echo Pressione Ctrl+C para parar o servidor
    echo.
    echo ========================================
    echo.
    python3 -m http.server 8000
    goto :end
)

echo ERRO: Python nao encontrado!
echo.
echo Instale Python de: https://www.python.org/downloads/
echo.
pause

:end

