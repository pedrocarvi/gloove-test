import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useInventoryManagement } from '@/hooks/useInventoryManagement';
import Form from './Form';
import Table from './Table';
import ProductManagement from './ProductManagement';
import { InventoryItem, RecordItem, ProductItem } from '@/hooks/useInventoryManagement';
import Swal from 'sweetalert2';
import { useAuth } from '@/context/AuthContext';

const InventoryPage: React.FC = () => {
  const { user } = useAuth();
  const {
    inventory,
    records,
    products,
    updateInventory,
    addRecord,
    addProduct,
    updateProduct,
    loading,
    error,
    fetchProducts,
    fetchRecords
  } = useInventoryManagement();

  const [activeTab, setActiveTab] = useState('inventory');
  const [isConsoleExpanded, setIsConsoleExpanded] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<string | null>(null);

  useEffect(() => {
    if (products.length === 0 && !loading) {
      fetchProducts();
    }
    fetchRecords();
  }, [products, loading, fetchProducts, fetchRecords]);

  useEffect(() => {
    if (records.length > 0) {
      const sortedRecords = [...records].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      setLastUpdate(new Date(sortedRecords[0].date).toLocaleString());
    }
  }, [records]);

  const handleInventorySubmit = useCallback(async (action: 'add' | 'remove', formData: Omit<RecordItem, 'id'>) => {
    const { product, quantity } = formData;
    const quantityNumber = typeof quantity === 'string' ? parseInt(quantity, 10) : quantity;

    if (isNaN(quantityNumber)) {
      Swal.fire('Error', 'Cantidad inválida', 'error');
      return;
    }

    try {
      await updateInventory(product, quantityNumber, action);
      await addRecord({ ...formData, quantity: quantityNumber, date: new Date().toISOString() });
      Swal.fire('Éxito', 'Inventario actualizado correctamente', 'success');
      fetchRecords(); // Refresh records after update
    } catch (err) {
      console.error("Error handling inventory submit:", err);
      Swal.fire('Error', 'Error al actualizar el inventario', 'error');
    }
  }, [updateInventory, addRecord, fetchRecords]);

  const handleAddProduct = useCallback(async (product: Omit<ProductItem, 'id'>) => {
    try {
      await addProduct(product);
      Swal.fire('Éxito', 'Producto añadido correctamente', 'success');
    } catch (err) {
      console.error("Error adding product:", err);
      Swal.fire('Error', 'Error al añadir el producto', 'error');
    }
  }, [addProduct]);

  const handleUpdateProduct = useCallback(async (product: ProductItem) => {
    try {
      await updateProduct(product);
      Swal.fire('Éxito', 'Producto actualizado correctamente', 'success');
    } catch (err) {
      console.error("Error updating product:", err);
      Swal.fire('Error', 'Error al actualizar el producto', 'error');
    }
  }, [updateProduct]);

  const lowStockProducts = useMemo(() => 
    inventory.filter(item => item.quantity < item.minQuantity),
    [inventory]
  );

  const renderInventoryTable = useMemo(() => 
    <Table data={inventory} columns={['name', 'quantity', 'minQuantity']} />,
    [inventory]
  );

  const renderRecordsTable = useMemo(() => 
    <Table 
      data={records.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())} 
      columns={['date', 'product', 'quantity', 'reason', 'house']} 
    />,
    [records]
  );

  const renderChart = useMemo(() => (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={inventory}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="quantity" stroke="#8884d8" />
        <Line type="monotone" dataKey="minQuantity" stroke="#82ca9d" />
      </LineChart>
    </ResponsiveContainer>
  ), [inventory]);

  if (loading) return <div className="p-4">Cargando...</div>;
  if (error) return <div className="p-4 text-red-500">Error: {error}</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <header className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Empleado</h1>
        <p>Hola {user?.displayName || 'XXXXX'}</p>
        {lastUpdate && <p>Última actualización: {lastUpdate}</p>}
      </header>
      
      <nav className="mb-8">
        <ul className="flex space-x-4">
          {['Inventario', 'Registros', 'Gestionar Productos', 'Gráfico'].map((tab) => (
            <li key={tab}>
              <button
                onClick={() => setActiveTab(tab.toLowerCase())}
                className={`px-4 py-2 rounded ${activeTab === tab.toLowerCase() ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
              >
                {tab}
              </button>
            </li>
          ))}
        </ul>
      </nav>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <div>
          <h2 className="text-xl font-semibold mb-4">Formulario de Inventario</h2>
          <Form onSubmit={handleInventorySubmit} products={products} inventory={inventory} />
        </div>
        <div>
          <h2 className="text-xl font-semibold mb-4">
            Consola de Datos
            {lowStockProducts.length > 3 && (
              <span className="ml-2 text-red-500">({lowStockProducts.length})</span>
            )}
            <button 
              onClick={() => setIsConsoleExpanded(!isConsoleExpanded)}
              className="ml-2 text-blue-500"
            >
              {isConsoleExpanded ? 'Contraer' : 'Expandir'}
            </button>
          </h2>
          <div className={`bg-gray-100 p-4 rounded ${isConsoleExpanded ? 'h-auto' : 'h-40 overflow-hidden'}`}>
            <h3 className="font-semibold mb-2">Productos Bajo Mínimo:</h3>
            {lowStockProducts.length === 0 ? (
              <p>No hay productos bajo el mínimo.</p>
            ) : (
              <ul>
                {lowStockProducts.map(product => (
                  <li key={product.id} className="text-red-500">
                    {product.name}: {product.quantity} (Mínimo: {product.minQuantity})
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>

      {activeTab === 'inventario' && renderInventoryTable}
      {activeTab === 'registros' && renderRecordsTable}
      {activeTab === 'gestionar productos' && (
        <ProductManagement
          inventory={inventory}
          onAddProduct={handleAddProduct}
          onUpdateProduct={handleUpdateProduct}
        />
      )}
      {activeTab === 'gráfico' && renderChart}
    </div>
  );
};

export default InventoryPage;