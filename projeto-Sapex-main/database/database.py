import sqlite3
import hashlib
from datetime import datetime
import os

class DatabaseManager:
    def __init__(self, db_name="usuarios.db"):
        self.db_name = db_name
        self.init_database()
    
    def init_database(self):
        """Inicializa o banco de dados e cria a tabela de usuários"""
        conn = sqlite3.connect(self.db_name)
        cursor = conn.cursor()
        
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS usuarios (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                nome TEXT NOT NULL,
                aniversario DATE NOT NULL,
                email TEXT UNIQUE NOT NULL,
                senha TEXT NOT NULL,
                data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        ''')
        
        conn.commit()
        conn.close()
        print(f"Banco de dados '{self.db_name}' inicializado com sucesso!")
    
    def cadastrar_usuario(self, nome, aniversario, email, senha):
        """Cadastra um novo usuário no banco de dados"""
        try:
            # Hash da senha para segurança
            senha_hash = hashlib.sha256(senha.encode()).hexdigest()
            
            conn = sqlite3.connect(self.db_name)
            cursor = conn.cursor()
            
            cursor.execute('''
                INSERT INTO usuarios (nome, aniversario, email, senha)
                VALUES (?, ?, ?, ?)
            ''', (nome, aniversario, email, senha_hash))
            
            conn.commit()
            conn.close()
            return {"success": True, "message": "Usuário cadastrado com sucesso!"}
            
        except sqlite3.IntegrityError:
            return {"success": False, "message": "Email já cadastrado!"}
        except Exception as e:
            return {"success": False, "message": f"Erro ao cadastrar: {str(e)}"}
    
    def verificar_login(self, email, senha):
        """Verifica as credenciais de login do usuário"""
        try:
            senha_hash = hashlib.sha256(senha.encode()).hexdigest()
            
            conn = sqlite3.connect(self.db_name)
            cursor = conn.cursor()
            
            cursor.execute('''
                SELECT id, nome, email, aniversario FROM usuarios 
                WHERE email = ? AND senha = ?
            ''', (email, senha_hash))
            
            usuario = cursor.fetchone()
            conn.close()
            
            if usuario:
                return {
                    "success": True, 
                    "usuario": {
                        "id": usuario[0],
                        "nome": usuario[1],
                        "email": usuario[2],
                        "aniversario": usuario[3]
                    }
                }
            else:
                return {"success": False, "message": "Email ou senha incorretos!"}
                
        except Exception as e:
            return {"success": False, "message": f"Erro ao verificar login: {str(e)}"}
    
    def buscar_usuario_por_email(self, email):
        """Busca um usuário pelo email"""
        try:
            conn = sqlite3.connect(self.db_name)
            cursor = conn.cursor()
            
            cursor.execute('''
                SELECT id, nome, email, aniversario FROM usuarios 
                WHERE email = ?
            ''', (email,))
            
            usuario = cursor.fetchone()
            conn.close()
            
            if usuario:
                return {
                    "success": True,
                    "usuario": {
                        "id": usuario[0],
                        "nome": usuario[1],
                        "email": usuario[2],
                        "aniversario": usuario[3]
                    }
                }
            else:
                return {"success": False, "message": "Usuário não encontrado!"}
                
        except Exception as e:
            return {"success": False, "message": f"Erro ao buscar usuário: {str(e)}"}
    
    def listar_usuarios(self):
        """Lista todos os usuários cadastrados"""
        try:
            conn = sqlite3.connect(self.db_name)
            cursor = conn.cursor()
            
            cursor.execute('''
                SELECT id, nome, email, aniversario, data_criacao FROM usuarios
                ORDER BY nome
            ''')
            
            usuarios = cursor.fetchall()
            conn.close()
            
            return {
                "success": True,
                "usuarios": [
                    {
                        "id": u[0],
                        "nome": u[1],
                        "email": u[2],
                        "aniversario": u[3],
                        "data_criacao": u[4]
                    } for u in usuarios
                ]
            }
            
        except Exception as e:
            return {"success": False, "message": f"Erro ao listar usuários: {str(e)}"}
    
    def atualizar_usuario(self, email, nome=None, aniversario=None, nova_senha=None):
        """Atualiza dados de um usuário existente"""
        try:
            conn = sqlite3.connect(self.db_name)
            cursor = conn.cursor()
            
            updates = []
            params = []
            
            if nome:
                updates.append("nome = ?")
                params.append(nome)
            
            if aniversario:
                updates.append("aniversario = ?")
                params.append(aniversario)
            
            if nova_senha:
                senha_hash = hashlib.sha256(nova_senha.encode()).hexdigest()
                updates.append("senha = ?")
                params.append(senha_hash)
            
            if not updates:
                return {"success": False, "message": "Nenhum dado para atualizar!"}
            
            params.append(email)
            query = f"UPDATE usuarios SET {', '.join(updates)} WHERE email = ?"
            
            cursor.execute(query, params)
            conn.commit()
            conn.close()
            
            if cursor.rowcount > 0:
                return {"success": True, "message": "Usuário atualizado com sucesso!"}
            else:
                return {"success": False, "message": "Usuário não encontrado!"}
                
        except Exception as e:
            return {"success": False, "message": f"Erro ao atualizar usuário: {str(e)}"}
    
    def deletar_usuario(self, email):
        """Deleta um usuário do banco de dados"""
        try:
            conn = sqlite3.connect(self.db_name)
            cursor = conn.cursor()
            
            cursor.execute('DELETE FROM usuarios WHERE email = ?', (email,))
            conn.commit()
            conn.close()
            
            if cursor.rowcount > 0:
                return {"success": True, "message": "Usuário deletado com sucesso!"}
            else:
                return {"success": False, "message": "Usuário não encontrado!"}
                
        except Exception as e:
            return {"success": False, "message": f"Erro ao deletar usuário: {str(e)}"}

# Exemplo de uso
if __name__ == "__main__":
    db = DatabaseManager()
    
    # Exemplo de cadastro
    resultado = db.cadastrar_usuario(
        nome="João Silva",
        aniversario="1990-05-15",
        email="joao@email.com",
        senha="123456"
    )
    print(resultado)
    
    # Exemplo de listagem
    usuarios = db.listar_usuarios()
    print(usuarios)
