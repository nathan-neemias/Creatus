import React from 'react';
import './ModalConfirm.css';

function ConfirmModal({ message, onConfirm, onCancel }) {
  return (
    <div className="confirm-modal-overlay">
      <div className="confirm-modal-content">
        <h2>Confirmação</h2>
        <p>{message}</p>
        <div className="confirm-modal-buttons">
          <button className="btn-confirm" onClick={onConfirm}>Confirmar</button>
          <button className="btn-cancel" onClick={onCancel}>Cancelar</button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmModal;
