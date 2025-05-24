"use client"
import React from "react";
import 'flowbite';
import axios from "axios";
import Layout from "../layouts/Layout";
import DataTable from "react-data-table-component";
import LoadingBar from "../components/LoadingBar";
import ProductModal from "../components/ProductModal";
import { toast, Toaster } from "react-hot-toast";

export default function ProductPage() {
  const [products, setProducts] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [modalMode, setModalMode] = React.useState('create');
  const [selectedProduct, setSelectedProduct] = React.useState(null);

  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  const fetchProducts = async () => {
    try {
      const response = await fetch(`${API_URL}/api/product`);
      const data = await response.json();
      setProducts(data.data);
    } catch (error) {
      toast.error("This didn't work.")
      console.log("Gagal mengambil data produk.");
    } finally {
      setLoading(false);
    }
  };

  const addProduct = async (newProduct) => {
    try {
      const response = await axios.post(`${API_URL}/api/product`, newProduct);
      return response.status === 201;
    } catch (error) {
      toast.error("This didn't work.")
      return false;
    }
  };

  const handleAddProduct = async (newProduct) => {
    const success = await addProduct(newProduct);
    if (success) {
      setIsModalOpen(false);
      await fetchProducts(setProducts, setLoading);
      toast.success("Product successfully added!");
    } else {
      console.log("Gagal menambahkan product");
      toast.error("This didn't work.")
    }
  };

  const handleEditProduct = async (updatedProduct) => {
    try {
      const response = await axios.put(`${API_URL}/api/product/${selectedProduct.id}`, updatedProduct);
      if (response.status === 200) {
        setIsModalOpen(false);
        await fetchProducts();
        toast.success("Product updated successfully!");
      }
    } catch (error) {
      toast.error("This didn't work.");
      console.error("Gagal memperbarui produk:", error);
    }
  };

  const handleShowProduct = (product) => {
    setSelectedProduct(product);
    setModalMode('show');
    setIsModalOpen(true);
  };

  const handleEditButtonClick = (product) => {
    setSelectedProduct(product);
    setModalMode('edit');
    setIsModalOpen(true);
  };

  const deleteProduct= async (id) => {
    try {
      const response = await axios.delete(`${API_URL}/api/product/${id}`);
      if (response.status === 200) {
        await fetchProducts();
        toast.success("Product successfully deleted!");
      }
    } catch (error) {
      toast.error("This didn't work.");
      console.error("Gagal menghapus product:", error);
    }
  };

  const handleDeleteButtonClick = (product) => {
    if (window.confirm(`Apakah anda yakin ingin menghapus produk ${product.name}?`)) {
      deleteProduct(product.id);
    }
  };

  const formatRupiah = (angka) => {
    if (!angka) return "Rp 0";
    const numeric = angka.toString().replace(/[^0-9]/g, "");
    return "Rp " + numeric.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  const columns = [
    {
      name: '#',
      cell: (row, index) => index + 1,
      width: '70px'
    },
    {
      name: 'Name',
      selector: row => row.name,
    },
    {
      name: 'Category',
      selector: row => row.category,
    },
    {
      name: 'Price',
      selector: row => formatRupiah(row.price),
    },
    {
      name: `Actions`,
      grow: 1,
      cell: (row) => (
        <div className="flex gap-2">
          <button className="bg-blue-400 hover:bg-blue-500 px-3 py-2 cursor-pointer rounded" onClick={() => handleShowProduct(row)}>Detail</button>
          <button className="bg-yellow-300 hover:bg-yellow-400 px-3 py-2 cursor-pointer rounded" onClick={() => handleEditButtonClick(row)}>Edit</button>
          <button className="bg-red-500 hover:bg-red-600 px-3 py-2 text-white cursor-pointer rounded" onClick={() => {handleDeleteButtonClick(row)}}>Delete</button>
        </div>
      )
    }
  ];

  React.useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <Layout>
      <LoadingBar loading={loading} />
      {loading ? (
        <div className="flex justify-center items-center h-screen">
          <p className="text-gray-500">Loading...</p>
        </div>
      ) : (
        <div className="mt-4">
          <h1 className="text-2xl font-bold text-[#3F4151]">Product Page</h1>
          <div className="text-end mt-5 mb-3">
            <button className="bg-[#3F4151] hover:bg-[#2e3240] px-3 py-2 rounded-lg cursor-pointer text-sm" onClick={() => {setModalMode('create'); setIsModalOpen(true)}}>Add Product</button>
          </div>
          <DataTable
            columns={columns}
            data={products}
            pagination
          />
        </div>
      )}

      <ProductModal
        isOpen={isModalOpen}
        onClose={() => { setIsModalOpen(false); setSelectedProduct(null); }}
        onSubmit={modalMode === 'edit' ? handleEditProduct : handleAddProduct}
        mode={modalMode}
        productData={selectedProduct}
      />
    </Layout>
  );
}
