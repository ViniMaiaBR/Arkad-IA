#!/bin/bash

echo "========================================"
echo "  ARKAD AI - Servidor Local HTTP"
echo "========================================"
echo ""
echo "Iniciando servidor HTTP na porta 8000..."
echo ""
echo "Acesse: http://localhost:8000/Index/documentos.html"
echo ""
echo "Pressione Ctrl+C para parar o servidor"
echo ""
echo "========================================"
echo ""

cd "$(dirname "$0")"
python3 -m http.server 8000

