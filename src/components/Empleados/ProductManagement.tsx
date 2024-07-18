import React, { useState } from 'react';
import { InventoryItem } from '@/hooks/useInventoryManagement';
import Swal from 'sweetalert2';

interface ProductManagementProps {
  inventory: InventoryItem[];
  onAddProduct: (product: Omit<InventoryItem, 'id'>) => void;
  onUpdateProduct: (product: InventoryItem) => void;
}

const ProductManagement: React.FC<ProductManagementProps> = ({ inventory, onAddProduct, onUpdateProduct }) => {
  const [newProduct, setNewProduct] = useState<Omit<InventoryItem, 'id'>>({ name: '', quantity: 0, minQuantity: 0 });
  const [editingProduct, setEditingProduct] = useState<InventoryItem | null>(null);

  const handleAddNewProduct = () => {
    if (newProduct.name && newProduct.quantity >= 0 && newProduct.minQuantity >= 0) {
      onAddProduct(newProduct);
      setNewProduct({ name: '', quantity: 0, minQuantity: 0 });
    } else {
      Swal.fire('Error', 'Por favor, completa todos los campos correctamente', 'error');
    }
  };

  const handleEditProduct = (product: InventoryItem) => setEditingProduct(product);

  const handleUpdateProduct = () => {
    if (editingProduct) {
      if (editingProduct.name && editingProduct.quantity >= 0 && editingProduct.minQuantity >= 0) {
        onUpdateProduct(editingProduct);
        setEditingProduct(null);
      } else {
        Swal.fire('Error', 'Por favor, completa todos los campos correctamente', 'error');
      }
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, isNewProduct: boolean) => {
    const { name, value } = e.target;
    if (isNewProduct) {
      setNewProduct(prev => ({ ...prev, [name]: name === 'name' ? value : parseInt(value) || 0 }));
    } else if (editingProduct) {
      setEditingProduct(prev => ({ ...prev!, [name]: name === 'name' ? value : parseInt(value) || 0 }));
    }
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Gestionar Productos</h2>
      <div className="mb-4 grid grid-cols-4 gap-2">
        <input
          type="text"
          placeholder="Nombre"
          name="name"
          value={newProduct.name}
          onChange={(e) => handleInputChange(e, true)}
          className="col-span-2 p-2 border rounded"
        />
        <input
          type="number"
          placeholder="Cantidad"
          name="quantity"
          value={newProduct.quantity}
          onChange={(e) => handleInputChange(e, true)}
          className="p-2 border rounded"
        />
        <input
          type="number"
          placeholder="Mínimo"
          name="minQuantity"
          value={newProduct.minQuantity}
          onChange={(e) => handleInputChange(e, true)}
          className="p-2 border rounded"
        />
        <button onClick={handleAddNewProduct} className="col-span-4 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">Añadir Producto</button>
      </div>
      <table className="w-full mb-4">
        <thead>
          <tr>
            <th className="text-left">Producto</th>
            <th className="text-left">Cantidad</th>
            <th className="text-left">Mínimo</th>
            <th className="text-left">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {inventory.map((item) => (
            <tr key={item.id}>
              <td>
                {editingProduct && editingProduct.id === item.id ? (
                  <input
                    type="text"
                    name="name"
                    value={editingProduct.name}
                    onChange={(e) => handleInputChange(e, false)}
                    className="p-1 border rounded w-full"
                  />
                ) : item.name}
              </td>
              <td>
                {editingProduct && editingProduct.id === item.id ? (
                  <input
                    type="number"
                    name="quantity"
                    value={editingProduct.quantity}
                    onChange={(e) => handleInputChange(e, false)}
                    className="p-1 border rounded w-full"
                  />
                ) : item.quantity}
              </td>
              <td>
                {editingProduct && editingProduct.id === item.id ? (
                  <input
                    type="number"
                    name="minQuantity"
                    value={editingProduct.minQuantity}
                    onChange={(e) => handleInputChange(e, false)}
                    className="p-1 border rounded w-full"
                  />
                ) : item.minQuantity}
              </td>
              <td>
                {editingProduct && editingProduct.id === item.id ? (
                  <button onClick={handleUpdateProduct} className="bg-blue-500 text-white px-2 py-1 rounded mr-2 hover:bg-blue-600">Guardar</button>
                ) : (
                  <button onClick={() => handleEditProduct(item)} className="bg-yellow-500 text-white px-2 py-1 rounded mr-2 hover:bg-yellow-600">Editar</button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProductManagement;


