# Configurações do Banco de Dados
# ARKAD AI - Sistema de Usuários

import os

# Configurações do Banco de Dados
DATABASE_CONFIG = {
    'nome_arquivo': 'usuarios.db',
    'caminho': os.path.join(os.path.dirname(__file__), 'usuarios.db'),
    'timeout': 30,
    'check_same_thread': False
}

# Configurações de Segurança
SECURITY_CONFIG = {
    'hash_algorithm': 'sha256',
    'salt_length': 32,
    'min_password_length': 6,
    'max_login_attempts': 5,
    'lockout_duration': 300,  # 5 minutos em segundos
}

# Configurações da Aplicação
APP_CONFIG = {
    'nome': 'ARKAD AI',
    'versao': '1.0.0',
    'debug': True,
    'timezone': 'America/Sao_Paulo'
}

# Configurações de Validação
VALIDATION_CONFIG = {
    'nome_min_length': 2,
    'nome_max_length': 100,
    'email_max_length': 255,
    'senha_min_length': 6,
    'senha_max_length': 128
}

# Mensagens do Sistema
MESSAGES = {
    'usuario_cadastrado': 'Usuário cadastrado com sucesso!',
    'usuario_atualizado': 'Usuário atualizado com sucesso!',
    'usuario_deletado': 'Usuário removido com sucesso!',
    'email_ja_existe': 'Email já cadastrado no sistema!',
    'usuario_nao_encontrado': 'Usuário não encontrado!',
    'dados_invalidos': 'Dados fornecidos são inválidos!',
    'senha_incorreta': 'Senha incorreta!',
    'login_sucesso': 'Login realizado com sucesso!',
    'conta_bloqueada': 'Conta temporariamente bloqueada devido a múltiplas tentativas de login!',
    'erro_interno': 'Erro interno do servidor!',
    'validacao_nome': 'Nome deve ter entre 2 e 100 caracteres!',
    'validacao_email': 'Formato de email inválido!',
    'validacao_senha': 'Senha deve ter pelo menos 6 caracteres!',
    'validacao_aniversario': 'Data de aniversário é obrigatória!'
}

# Configurações de Log
LOG_CONFIG = {
    'level': 'INFO',
    'format': '%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    'file': 'app.log',
    'max_size': 10 * 1024 * 1024,  # 10MB
    'backup_count': 5
}

# Configurações de Backup
BACKUP_CONFIG = {
    'auto_backup': True,
    'backup_interval': 24 * 60 * 60,  # 24 horas em segundos
    'backup_path': 'backups/',
    'max_backups': 30
}

def get_database_path():
    """Retorna o caminho completo para o arquivo do banco de dados"""
    return DATABASE_CONFIG['caminho']

def get_config():
    """Retorna todas as configurações em um dicionário"""
    return {
        'database': DATABASE_CONFIG,
        'security': SECURITY_CONFIG,
        'app': APP_CONFIG,
        'validation': VALIDATION_CONFIG,
        'messages': MESSAGES,
        'log': LOG_CONFIG,
        'backup': BACKUP_CONFIG
    }

def is_debug_mode():
    """Verifica se o modo debug está ativado"""
    return APP_CONFIG['debug']

def get_app_info():
    """Retorna informações básicas da aplicação"""
    return {
        'nome': APP_CONFIG['nome'],
        'versao': APP_CONFIG['versao'],
        'timezone': APP_CONFIG['timezone']
    }
