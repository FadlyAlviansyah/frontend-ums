"use client"
import React from "react";
import 'flowbite';
import axios from "axios";
import Layout from "../layouts/Layout";
import DataTable from "react-data-table-component";
import LoadingBar from "../components/LoadingBar";
import TransactionModal from "../components/TransactionModal";
import { toast, Toaster } from "react-hot-toast";

export default function TransactionPage() {
  const [transactions, setTransactions] = React.useState([]);
  const [customers, setCustomers] = React.useState([]);
  const [products, setProducts] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [modalMode, setModalMode] = React.useState('create');
  const [selectedTransaction, setSelectedTransaction] = React.useState(null);

  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  const fetchTransactions = async () => {
    try {
      const response = await fetch(`${API_URL}/api/transaction`);
      const data = await response.json();
      setTransactions(data.data);
    } catch (error) {
      toast.error("This didn't work.")
      console.log("Gagal mengambil data transaction.");
    } finally {
      setLoading(false);
    }
  };

  const fetchCustomers = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/customer`);
      setCustomers(response.data.data);
    } catch (error) {
      toast.error("This didn't work.");
      console.log("Gagal mengambil data customer");
    } finally {
      setLoading(false);
    }
  }

  const fetchProducts = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/product`);
      setProducts(response.data.data);
    } catch (error) {
      toast.error("This didn't work.");
      console.log("Gagal mengambil data produk");
    } finally {
      setLoading(false);
    }
  }

  const addTransaction = async (newTransaction) => {
    try {
      const response = await axios.post(`${API_URL}/api/transaction`, newTransaction);
      return response.status === 201;
    } catch (error) {
      toast.error("This didn't work.")
      return false;
    }
  };

  const handleAddTransaction = async (newTransaction) => {
    const success = await addTransaction(newTransaction);
    if (success) {
      setIsModalOpen(false);
      await fetchTransactions(setTransactions, setLoading);
      toast.success("Transaction successfully added!");
    } else {
      console.log("Gagal menambahkan transaksi");
      toast.error("This didn't work.")
    }
  };

  const handleEditTransaction = async (updatedTransaction) => {
    try {
      const response = await axios.put(`${API_URL}/api/transaction/${selectedTransaction.id}`, updatedTransaction);
      if (response.status === 200) {
        setIsModalOpen(false);
        await fetchTransactions();
        toast.success("Transaction updated successfully!");
      }
    } catch (error) {
      toast.error("This didn't work.");
      console.error("Gagal memperbarui transaction:", error);
    }
  };

  const handleShowTransaction = (transaction) => {
    setSelectedTransaction(transaction);
    setModalMode('show');
    setIsModalOpen(true);
  };

  const handleEditButtonClick = (transaction) => {
    setSelectedTransaction(transaction);
    setModalMode('edit');
    setIsModalOpen(true);
  };

  const deleteTransaction= async (id) => {
    try {
      const response = await axios.delete(`${API_URL}/api/transaction/${id}`);
      if (response.status === 200) {
        await fetchTransactions();
        toast.success("Transaction successfully deleted!");
      }
    } catch (error) {
      toast.error("This didn't work.");
      console.error("Gagal menghapus transaksi:", error);
    }
  };

  const handleDeleteButtonClick = (transaction) => {
    if (window.confirm(`Apakah anda yakin ingin menghapus transaksi ${transaction.name}?`)) {
      deleteTransaction(transaction.id);
    }
  };

  const formatRupiah = (value) => {
    if (!value) return "Rp 0";
    const numeric = value.toString().replace(/[^0-9]/g, "");
    return "Rp " + numeric.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  const formatDate = (value) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(value).toLocaleDateString('id-ID', options);
  };

  const columns = [
    {
      name: '#',
      cell: (row, index) => index + 1,
      width: '70px'
    },
    {
      name: 'Customer Name',
      selector: row => row.customer.name,
    },
    {
      name: 'Total',
      selector: row => formatRupiah(row.total),
    },
    {
      name: 'Amount Paid',
      selector: row => formatRupiah(row.amount_paid),
    },
    {
      name: 'Amount Change',
      selector: row => formatRupiah(row.amount_change),
    },
    {
      name: 'Date',
      selector: row => formatDate(row.date),
    },
    {
      name: `Actions`,
      grow: 1,
      cell: (row) => (
        <div className="flex gap-2">
          <button className="bg-blue-400 hover:bg-blue-500 px-3 py-2 cursor-pointer rounded" onClick={() => handleShowTransaction(row)}>Detail</button>
          <button className="bg-yellow-300 hover:bg-yellow-400 px-3 py-2 cursor-pointer rounded" onClick={() => handleEditButtonClick(row)}>Edit</button>
          <button className="bg-red-500 hover:bg-red-600 px-3 py-2 text-white cursor-pointer rounded" onClick={() => {handleDeleteButtonClick(row)}}>Delete</button>
        </div>
      )
    }
  ];

  const ExpandableComponent = ({ data }) => {
    return (
      <table className="min-w-full text-sm">
        <thead>
          <tr className="border-b-1 text-start">
            <th className="px-4 py-2 text-start">Product Name</th>
            <th className="px-4 py-2 text-start">Quantity</th>
            <th className="px-4 py-2 text-start">Subtotal</th>
          </tr>
        </thead>
        <tbody>
          {data.transaction_details.map((item, index) => (
            <tr key={index} className="border-b-1">
              <td className="px-4 py-2">{item.product.name}</td>
              <td className="px-4 py-2">{item.quantity}</td>
              <td className="px-4 py-2">{formatRupiah(item.product.price * item.quantity)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

  React.useEffect(() => {
    fetchTransactions();
    fetchCustomers();
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
          <h1 className="text-2xl font-bold text-[#3F4151]">Transaction Page</h1>
          <div className="text-end mt-5 mb-3">
            <button className="bg-[#3F4151] hover:bg-[#2e3240] px-3 py-2 rounded-lg cursor-pointer text-sm" onClick={() => {setModalMode('create'); setIsModalOpen(true)}}>Add Transaction</button>
          </div>
          <DataTable
            columns={columns}
            data={transactions}
            pagination
            expandableRows
            expandableRowsComponent={ExpandableComponent}
          />
        </div>
      )}

      <TransactionModal
        isOpen={isModalOpen}
        onClose={() => { setIsModalOpen(false); setSelectedTransaction(null); }}
        onSubmit={modalMode === 'edit' ? handleEditTransaction : handleAddTransaction}
        mode={modalMode}
        transactionData={selectedTransaction}
        customers={customers}
        products={products}
      />
    </Layout>
  );
}
