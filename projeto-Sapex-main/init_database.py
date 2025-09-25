#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Script de Inicialização do Banco de Dados
ARKAD AI - Sistema de Usuários

Este script inicializa o banco de dados e cria alguns usuários de exemplo
para demonstração do sistema.
"""

import os
import sys
from datetime import datetime, timedelta
from database import DatabaseManager
from config import get_config, MESSAGES

def main():
    """Função principal para inicializar o banco de dados"""
    print("=" * 60)
    print("ARKAD AI - Inicialização do Banco de Dados")
    print("=" * 60)
    
    try:
        # Inicializar o banco de dados
        print("\n1. Inicializando banco de dados...")
        db = DatabaseManager()
        print("✓ Banco de dados inicializado com sucesso!")
        
        # Criar usuários de exemplo
        print("\n2. Criando usuários de exemplo...")
        usuarios_exemplo = criar_usuarios_exemplo()
        
        for usuario in usuarios_exemplo:
            resultado = db.cadastrar_usuario(
                nome=usuario['nome'],
                aniversario=usuario['aniversario'],
                email=usuario['email'],
                senha=usuario['senha']
            )
            
            if resultado['success']:
                print(f"✓ Usuário {usuario['nome']} criado com sucesso!")
            else:
                print(f"⚠ {resultado['message']} para {usuario['nome']}")
        
        # Testar funcionalidades
        print("\n3. Testando funcionalidades do banco...")
        testar_funcionalidades(db)
        
        # Mostrar estatísticas
        print("\n4. Estatísticas do banco de dados:")
        mostrar_estatisticas(db)
        
        print("\n" + "=" * 60)
        print("✓ Banco de dados inicializado e testado com sucesso!")
        print("=" * 60)
        
        # Mostrar informações de uso
        mostrar_informacoes_uso()
        
    except Exception as e:
        print(f"\n❌ Erro durante a inicialização: {str(e)}")
        sys.exit(1)

def criar_usuarios_exemplo():
    """Cria uma lista de usuários de exemplo"""
    hoje = datetime.now()
    
    return [
        {
            'nome': 'João Silva',
            'aniversario': '1990-05-15',
            'email': 'joao.silva@email.com',
            'senha': '123456'
        },
        {
            'nome': 'Maria Santos',
            'aniversario': '1985-08-22',
            'email': 'maria.santos@email.com',
            'senha': '123456'
        },
        {
            'nome': 'Pedro Oliveira',
            'aniversario': '1992-03-10',
            'email': 'pedro.oliveira@email.com',
            'senha': '123456'
        },
        {
            'nome': 'Ana Costa',
            'aniversario': '1988-12-05',
            'email': 'ana.costa@email.com',
            'senha': '123456'
        },
        {
            'nome': 'Carlos Ferreira',
            'aniversario': '1995-07-18',
            'email': 'carlos.ferreira@email.com',
            'senha': '123456'
        }
    ]

def testar_funcionalidades(db):
    """Testa as principais funcionalidades do banco de dados"""
    
    # Teste de busca por email
    print("  - Testando busca por email...")
    usuario = db.buscar_usuario_por_email('joao.silva@email.com')
    if usuario['success']:
        print(f"    ✓ Usuário encontrado: {usuario['usuario']['nome']}")
    else:
        print(f"    ❌ Erro na busca: {usuario['message']}")
    
    # Teste de verificação de login
    print("  - Testando verificação de login...")
    login = db.verificar_login('joao.silva@email.com', '123456')
    if login['success']:
        print(f"    ✓ Login válido para: {login['usuario']['nome']}")
    else:
        print(f"    ❌ Erro no login: {login['message']}")
    
    # Teste de login inválido
    print("  - Testando login inválido...")
    login_invalido = db.verificar_login('joao.silva@email.com', 'senha_errada')
    if not login_invalido['success']:
        print(f"    ✓ Login inválido detectado corretamente")
    else:
        print(f"    ❌ Login inválido não foi detectado")
    
    # Teste de listagem
    print("  - Testando listagem de usuários...")
    usuarios = db.listar_usuarios()
    if usuarios['success']:
        print(f"    ✓ {len(usuarios['usuarios'])} usuários listados")
    else:
        print(f"    ❌ Erro na listagem: {usuarios['message']}")

def mostrar_estatisticas(db):
    """Mostra estatísticas básicas do banco de dados"""
    usuarios = db.listar_usuarios()
    
    if usuarios['success']:
        total = len(usuarios['usuarios'])
        print(f"  - Total de usuários: {total}")
        
        # Usuários por mês de aniversário
        meses = {}
        for usuario in usuarios['usuarios']:
            mes = datetime.strptime(usuario['aniversario'], '%Y-%m-%d').month
            nome_mes = datetime(2000, mes, 1).strftime('%B')
            meses[nome_mes] = meses.get(nome_mes, 0) + 1
        
        print("  - Usuários por mês de aniversário:")
        for mes, quantidade in sorted(meses.items()):
            print(f"    • {mes}: {quantidade} usuário(s)")
    else:
        print(f"  ❌ Erro ao obter estatísticas: {usuarios['message']}")

def mostrar_informacoes_uso():
    """Mostra informações sobre como usar o sistema"""
    print("\n📚 COMO USAR O SISTEMA:")
    print("1. Acesse a página de cadastro: Index/cadastro-usuarios.html")
    print("2. Use os usuários de exemplo para testar o login:")
    print("   • Email: joao.silva@email.com | Senha: 123456")
    print("   • Email: maria.santos@email.com | Senha: 123456")
    print("3. O banco de dados está salvo em: usuarios.db")
    print("4. Para desenvolvimento, os dados também são salvos no localStorage")
    
    print("\n🔧 FUNCIONALIDADES DISPONÍVEIS:")
    print("• Cadastro de usuários")
    print("• Login e autenticação")
    print("• Listagem de usuários")
    print("• Edição de dados")
    print("• Remoção de usuários")
    print("• Busca e filtros")
    print("• Estatísticas básicas")
    
    print("\n⚠️  IMPORTANTE:")
    print("• Este é um sistema de demonstração")
    print("• Em produção, use um banco de dados mais robusto")
    print("• Implemente autenticação JWT ou similar")
    print("• Use HTTPS para transmissão segura de dados")

if __name__ == "__main__":
    main()
