import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [authEmail, setAuthEmail] = useState('');
  const navigate = useNavigate(); // Hook para navegação

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const response = await fetch('http://localhost:8080/auth', {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          });

          if (response.ok) {
            const result = await response.json();
            setAuthEmail(result.response);
            setSuccess('');
          } else {
            setAuthEmail('');
          }
        } catch (error) {
          console.error('Erro ao verificar autenticação:', error);
        }
      }
    };

    checkAuth();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();

    const credentials = btoa(`${email}:${password}`); // Codifica email e senha em base64
    try {
      const response = await fetch('http://localhost:8080/login', {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${credentials}`,
        },
      });

      if (response.ok) {
        const result = await response.json();
        const token = result.response;
        localStorage.setItem('token', token); // Armazena o token no localStorage
        setSuccess('Login bem-sucedido!');
        setError('');
        setAuthEmail('');
        navigate('/userlist'); // Redireciona para /userlist
      } else if (response.status === 400) {
        setError('Senha não encontrada ou registro não encontrado');
        setSuccess('');
      } else {
        setError('Erro ao tentar realizar o login');
        setSuccess('');
      }
    } catch (error) {
      console.error('Erro ao tentar realizar o login:', error);
      setError('Erro ao tentar realizar o login');
      setSuccess('');
    }
  };

  return (
    <div className="login-container">
      <div className="login-content">
        <div className="welcome-section">
          <h2>Bem-vindo</h2>
          <p>Acesse sua conta</p>
        </div>
        <div className="login-form-container">
          <div className="login-form">
            <form onSubmit={handleSubmit}>
              <div className="input-group">
                <label htmlFor="email">Email</label>
                <input
                  id="email"
                  type="email"
                  placeholder="Digite seu email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="input-group">
                <label htmlFor="password">Senha</label>
                <input
                  id="password"
                  type="password"
                  placeholder="Digite sua senha"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <button type="submit">Login</button>
              {error && <p className="error-message">{error}</p>}
              {success && <p className="success-message">{success}</p>}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
