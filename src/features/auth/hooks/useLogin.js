import { useState } from 'react';
import { loginUsuario } from '../services/authService';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function useLogin(onLogin) {
  const [correo, setCorreo]       = useState('');
  const [contrasena, setContrasena] = useState('');
  const [error, setError]         = useState('');
  const [loading, setLoading]     = useState(false);

  const validar = () => {
    if (!correo.trim()) {
      setError('El correo es obligatorio.');
      return false;
    }
    if (!EMAIL_REGEX.test(correo)) {
      setError('Ingresa un correo válido. Ej: usuario@dominio.com');
      return false;
    }
    if (!contrasena.trim()) {
      setError('La contraseña es obligatoria.');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!validar()) return;
    setLoading(true);
    try {
      const usuario = await loginUsuario(correo, contrasena);
      onLogin(usuario);
    } catch (err) {
      setError(err.response?.data?.mensaje || 'Error al conectar con el servidor');
    } finally {
      setLoading(false);
    }
  };

  return { correo, setCorreo, contrasena, setContrasena, error, loading, handleSubmit };
}