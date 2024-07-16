import React, { useState } from 'react';
import './Register.css';
import { AiOutlineClose } from 'react-icons/ai'; 
function RegisterModal({ onClose, onSave }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [accessLevel, setAccessLevel] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleSave = () => {
    if (password === confirmPassword) {
      if (accessLevel < 1 || accessLevel > 5) {
        setError('O nível de acesso deve estar entre 1 e 5');
        return;
      }

      setShowConfirmation(true);
    } else {
      setError('As senhas não correspondem');
    }
  };

  const handleConfirmSave = async () => {
    const newUser = { name, email, accessLevel, password };

    try {
      const response = await fetch('http://localhost:8080/user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newUser),
      });

      if (response.ok) {
        const result = await response.json();
        onSave(result);
        setSuccessMessage('Usuário cadastrado com sucesso!');
        setTimeout(() => {
          setSuccessMessage('');
          onClose();
        }, 2000);
      } else {
        alert('Erro ao cadastrar o usuário');
      }
    } catch (error) {
      console.error('Erro ao cadastrar o usuário:', error);
      alert('Erro ao cadastrar o usuário');
    } finally {
      setShowConfirmation(false);
    }
  };

  const handleCancel = () => {
    setShowConfirmation(false);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <AiOutlineClose className="close-icon" onClick={onClose} />
        <h2>Cadastro de Usuário</h2>
        <div className="form-group">
          <label>Nome:</label>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        <div className="form-group">
          <label>Email:</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div className="form-group">
          <label>Tipo de Usuário:</label>
          <select value={accessLevel} onChange={(e) => setAccessLevel(e.target.value)} className="access-level-select">
            <option value="">Selecione um nível</option>
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
            <option value="5">5</option>
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
        {successMessage && <p className="success-message">{successMessage}</p>}
        <div className="modal-buttons">
          <button className="btn-save" onClick={handleSave}>Cadastrar</button>
        </div>
      </div>

      {showConfirmation && (
        <div className="confirmation-modal-overlay">
          <div className="confirmation-modal-content">
            <h3>Confirmar Cadastro</h3>
            <p>Tem certeza de que deseja cadastrar este usuário?</p>
            <div className="confirmation-buttons">
              <button className="btn-confirm" onClick={handleConfirmSave}>Confirmar</button>
              <button className="btn-cancel" onClick={handleCancel}>Cancelar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default RegisterModal;
