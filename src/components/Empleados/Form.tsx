import React, { useState, useEffect } from 'react';
import { InventoryItem, RecordItem, ProductItem } from '@/hooks/useInventoryManagement';
import Swal from 'sweetalert2';

interface FormProps {
  inventory: InventoryItem[];
  products: ProductItem[];
  onSubmit: (action: 'add' | 'remove', formData: Omit<RecordItem, 'id'>) => void;
}

const Form: React.FC<FormProps> = ({ inventory, products, onSubmit }) => {
  const [formData, setFormData] = useState<Omit<RecordItem, 'id'>>({
    product: '',
    quantity: 0,
    reason: '',
    house: 'Cassa tessila',
    date: new Date().toISOString().split('T')[0]
  });

  useEffect(() => {
    if (products.length > 0 && !formData.product) {
      setFormData(prev => ({ ...prev, product: products[0].id }));
    }
  }, [products, formData.product]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      [name]: name === 'quantity' ? parseInt(value) || 0 : value 
    }));
  };

  const handleSubmit = (action: 'add' | 'remove') => {
    if (!formData.product || formData.quantity <= 0) {
      Swal.fire('Error', 'Por favor, completa todos los campos correctamente', 'error');
      return;
    }
    onSubmit(action, formData);
    setFormData(prev => ({ ...prev, quantity: 0, reason: '' }));
  };

  return (
    <form className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">Producto:</label>
        <select
          name="product"
          value={formData.product}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
        >
          {products.map(item => (
            <option key={item.id} value={item.id}>{item.name}</option>
          ))}
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Cantidad:</label>
        <input
          type="number"
          name="quantity"
          value={formData.quantity}
          onChange={handleChange}
          min="1"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Razón:</label>
        <input
          type="text"
          name="reason"
          value={formData.reason}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Vivienda:</label>
        <input
          type="text"
          name="house"
          value={formData.house}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Fecha:</label>
        <input
          type="date"
          name="date"
          value={formData.date}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
        />
      </div>
      <div className="flex space-x-2">
        <button 
          type="button" 
          onClick={() => handleSubmit('add')} 
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
        >
          Añadir
        </button>
        <button 
          type="button" 
          onClick={() => handleSubmit('remove')} 
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
        >
          Retirar
        </button>
      </div>
    </form>
  );
};

export default Form;