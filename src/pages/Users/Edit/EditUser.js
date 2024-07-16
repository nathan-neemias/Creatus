import React, { useState } from 'react';
import './EditModal.css';
import { AiOutlineClose } from 'react-icons/ai';  // Importa o ícone de fechar

function EditModal({ user, onClose, onSave }) {
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [accessLevel, setAccessLevel] = useState(user.accessLevel);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  const handleSave = async () => {
    if (password === confirmPassword) {
      const updatedUser = {
        name,
        email,
        accessLevel,
        password: password ? password : user.password,
      };

      try {
        const response = await fetch(`http://localhost:8080/user/${user.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(updatedUser),
        });

        if (response.ok) {
          const result = await response.json();
          onSave(result);
          onClose();
        } else {
          const errorText = await response.text();
          console.error('Erro ao atualizar o usuário:', errorText);
          alert('Erro ao atualizar o usuário');
        }
      } catch (error) {
        console.error('Erro ao atualizar o usuário:', error);
        alert('Erro ao atualizar o usuário');
      }
    } else {
      setError('As senhas não correspondem');
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <AiOutlineClose className="close-icon" onClick={onClose} />
        <h2>Editar Usuário</h2>
        <div className="form-group">
          <label>Nome:</label>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        <div className="form-group">
          <label>Email:</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div className="form-group">
          <label>Nível de Acesso:</label>
          <select value={accessLevel} onChange={(e) => setAccessLevel(e.target.value)} className="access-level-select">
            <option value="1">1 - Usuário Básico</option>
            <option value="2">2 - Usuário Avançado</option>
            <option value="3">3 - Moderador</option>
            <option value="4">4 - Administrador</option>
            <option value="5">5 - Super Administrador</option>
          </select>
        </div>
        <div className="form-group">
          <label>Senha:</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>
        <div className="form-group">
          <label>Confirmar Senha:</label>
          <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
        </div>
        {error && <p className="error-message">{error}</p>}
        <div className="modal-buttons">
          <button className="btn-save" onClick={handleSave}>Salvar</button>
        </div>
      </div>
    </div>
  );
}

export default EditModal;
