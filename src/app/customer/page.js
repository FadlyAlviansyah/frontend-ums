"use client"
import React from "react";
import 'flowbite';
import axios from "axios";
import Layout from "../layouts/Layout";
import DataTable from "react-data-table-component";
import LoadingBar from "../components/LoadingBar";
import { toast, Toaster } from "react-hot-toast";
import CustomerModal from "../components/CustomerModal";

export default function CustomerPage() {
  const [customers, setCustomers] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [modalMode, setModalMode] = React.useState('create');
  const [selectedCustomer, setSelectedCustomer] = React.useState(null);

  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  const fetchCustomers = async () => {
    try {
      const response = await fetch(`${API_URL}/api/customer`);
      const data = await response.json();
      setCustomers(data.data);
    } catch (error) {
      toast.error("This didn't work.")
      console.log("Gagal mengambil data customer.");
    } finally {
      setLoading(false);
    }
  };

  const addCustomer = async (newCustomer) => {
    try {
      const response = await axios.post(`${API_URL}/api/customer`, newCustomer);
      return response.status === 201;
    } catch (error) {
      toast.error("This didn't work.")
      return false;
    }
  };

  const handleAddCustomer = async (newCustomer) => {
    const success = await addCustomer(newCustomer);
    if (success) {
      setIsModalOpen(false);
      await fetchCustomers(setCustomers, setLoading);
      toast.success("Customer successfully added!");
    } else {
      console.log("Gagal menambahkan produk");
      toast.error("This didn't work.")
    }
  };

  const handleEditCustomer = async (updatedCustomer) => {
    try {
      const response = await axios.put(`${API_URL}/api/customer/${selectedCustomer.id}`, updatedCustomer);
      if (response.status === 200) {
        setIsModalOpen(false);
        await fetchCustomers();
        toast.success("Customer updated successfully!");
      }
    } catch (error) {
      toast.error("This didn't work.");
      console.error("Gagal memperbarui customer:", error);
    }
  };

  const handleShowCustomer = (customer) => {
    setSelectedCustomer(customer);
    setModalMode('show');
    setIsModalOpen(true);
  };

  const handleEditButtonClick = (customer) => {
    setSelectedCustomer(customer);
    setModalMode('edit');
    setIsModalOpen(true);
  };

  const deleteCustomer= async (id) => {
    try {
      const response = await axios.delete(`${API_URL}/api/customer/${id}`);
      if (response.status === 200) {
        await fetchCustomers();
        toast.success("Customer successfully deleted!");
      }
    } catch (error) {
      toast.error("This didn't work.");
      console.error("Gagal menghapus Customer:", error);
    }
  };

  const handleDeleteButtonClick = (customer) => {
    if (window.confirm(`Apakah anda yakin ingin menghapus customer ${customer.name}?`)) {
      deleteCustomer(customer.id);
    }
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
      name: 'Domicile',
      selector: row => row.domicile,
    },
    {
      name: 'Gender',
      selector: (row) => (
        <span className="capitalize">{row.gender}</span>
      ),
    },
    {
      name: `Actions`,
      grow: 1,
      cell: (row) => (
        <div className="flex gap-2">
          <button className="bg-blue-400 hover:bg-blue-500 px-3 py-2 cursor-pointer rounded" onClick={() => handleShowCustomer(row)}>Detail</button>
          <button className="bg-yellow-300 hover:bg-yellow-400 px-3 py-2 cursor-pointer rounded" onClick={() => handleEditButtonClick(row)}>Edit</button>
          <button className="bg-red-500 hover:bg-red-600 px-3 py-2 text-white cursor-pointer rounded" onClick={() => {handleDeleteButtonClick(row)}}>Delete</button>
        </div>
      )
    }
  ];

  React.useEffect(() => {
    fetchCustomers();
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
          <h1 className="text-2xl font-bold text-[#3F4151]">Customer Page</h1>
          <div className="text-end mt-5 mb-3">
            <button className="bg-[#3F4151] hover:bg-[#2e3240] px-3 py-2 rounded-lg cursor-pointer text-sm" onClick={() => {setModalMode('create'); setIsModalOpen(true)}}>Add Customer</button>
          </div>
          <DataTable
            columns={columns}
            data={customers}
            pagination
          />
        </div>
      )}

      <CustomerModal
        isOpen={isModalOpen}
        onClose={() => { setIsModalOpen(false); setSelectedCustomer(null); }}
        onSubmit={modalMode === 'edit' ? handleEditCustomer : handleAddCustomer}
        mode={modalMode}
        customerData={selectedCustomer}
      />
    </Layout>
  );
}
