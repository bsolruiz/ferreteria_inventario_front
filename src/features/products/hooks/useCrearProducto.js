import { useState, useEffect } from 'react';
import { crearProducto, listarCategorias } from '../pages/productoService';
import { toast } from 'react-hot-toast';

export function useCrearProducto(onNavegar) {
  const [form, setForm] = useState({
    nombreProducto: '',
    descripcion: '',
    precio: '',
    codigoBarras: '',
    categoriaId: '',
  });
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading]       = useState(false);
  const [error, setError]           = useState('');

  useEffect(() => {
    listarCategorias().then(setCategorias).catch(() => {});
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await crearProducto({
        ...form,
        precio:      parseFloat(form.precio),
        categoriaId: parseInt(form.categoriaId),
      });
      toast.success('Producto creado correctamente');
      onNavegar('inventario');
    } catch (err) {
      const msg = err.response?.data?.mensaje || 'Error al crear el producto';
      toast.error(msg);
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return { form, categorias, loading, error, handleChange, handleSubmit };
}