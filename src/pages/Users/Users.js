import React, { useState, useEffect } from 'react';
import './UserList.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import EditModal from './Edit/EditUser';
import RegisterModal from './Register/Register';
import ConfirmModal from '../../components/ModalConfirm';  

function UserList() {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showRegisterModal, setShowRegisterModal] = useState(false); 
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch('http://localhost:8080/users');
        if (response.ok) {
          const data = await response.json();
          setUsers(data);
        } else {
          console.error('Erro ao buscar usuários:', response.statusText);
        }
      } catch (error) {
        console.error('Erro ao buscar usuários:', error);
      }
    };

    fetchUsers();
  }, []);

  const handleEditClick = (user) => {
    setSelectedUser(user);
  };

  const handleModalClose = () => {
    setSelectedUser(null);
  };

  const handleSaveUser = (updatedUser) => {
    setUsers(users.map(user => user.id === updatedUser.id ? updatedUser : user));
    setSelectedUser(null);
  };

  const handleOpenRegisterModal = () => {
    setShowRegisterModal(true);
  };

  const handleRegisterClose = () => {
    setShowRegisterModal(false);
  };

  const handleRegisterSave = (newUser) => {
    setUsers([...users, newUser]);
    setShowRegisterModal(false);
  };

  const handleDeleteUser = (userId) => {
    setUserToDelete(userId);
    setShowConfirmModal(true);
  };

  const confirmDeleteUser = async () => {
    setShowConfirmModal(false);
    if (userToDelete) {
      try {
        const response = await fetch(`http://localhost:8080/user/${userToDelete}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          // Remove o usuário da lista
          setUsers(users.filter(user => user.id !== userToDelete));
          setUserToDelete(null);
        } else {
          console.error('Erro ao excluir usuário:', response.statusText);
          alert('Erro ao excluir o usuário');
        }
      } catch (error) {
        console.error('Erro ao excluir o usuário:', error);
        alert('Erro ao excluir o usuário');
      }
    }
  };

  const cancelDeleteUser = () => {
    setShowConfirmModal(false);
    setUserToDelete(null);
  };

  return (
    <div className="user-list-container">
      <div className="header">
        <h1>Usuários</h1>
        <button className="btn-cadastro" onClick={handleOpenRegisterModal}>Adicionar Usuário</button>
      </div>
      <div className="user-content">
        <table className="user-table">
          <thead>
            <tr>
              <th>Nome</th>
              <th>Email</th>
              <th>Nível de Acesso</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.id} className="user-item">
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.accessLevel}</td>
                <td className="actions">
                  <button className="btn-editar" onClick={() => handleEditClick(user)}>
                    <i className="fas fa-pen"></i>
                  </button>
                  <button className="btn-excluir" onClick={() => handleDeleteUser(user.id)}>
                    <i className="fas fa-trash"></i>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {selectedUser && (
        <EditModal
          user={selectedUser}
          onClose={handleModalClose}
          onSave={handleSaveUser}
        />
      )}
      {showRegisterModal && (
        <RegisterModal
          onClose={handleRegisterClose}
          onSave={handleRegisterSave}
        />
      )}
      {showConfirmModal && (
        <ConfirmModal
          message="Tem certeza de que deseja excluir este usuário?"
          onConfirm={confirmDeleteUser}
          onCancel={cancelDeleteUser}
        />
      )}
    </div>
  );
}

export default UserList;
