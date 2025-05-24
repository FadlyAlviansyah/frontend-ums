'use client';
import React from "react";
import Layout from "./layouts/Layout";
import axios from "axios";
import 'flowbite'
import LoadingBar from "./components/LoadingBar";
import toast from "react-hot-toast";

export default function Home() {
  const [transactions, setTransactions] = React.useState([]);
  const [customers, setCustomers] = React.useState([]);
  const [products, setProducts] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  const fetchTransactions = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/transaction`);
      setTransactions(response.data.data);
    } catch (error) {
      toast.error("This didn't work.")
      console.log("Gagal mengambil data transaction:", error);
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
      console.log("Gagal mengambil data customer:", error);
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
      console.log("Gagal mengambil data produk:", error);
    } finally {
      setLoading(false);
    }
  }

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
          <h1 className="text-2xl font-bold text-[#3F4151]">Dashboard Page</h1>
          <div className="grid grid-cols-12 gap-14 mt-5">
            <div className="col-span-4">
              <a className="block p-6 bg-white border border-gray-200 rounded-lg shadow-sm hover:bg-gray-100">
                <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900">Total Products</h5>
                <p className="font-semibold text-4xl text-gray-700">{products.length}</p>
              </a>
            </div>
            <div className="col-span-4">
              <a className="block p-6 bg-white border border-gray-200 rounded-lg shadow-sm hover:bg-gray-100">
                <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900">Total Customers</h5>
                <p className="font-semibold text-4xl text-gray-700">{customers.length}</p>
              </a>
            </div>
            <div className="col-span-4">
              <a className="block p-6 bg-white border border-gray-200 rounded-lg shadow-sm hover:bg-gray-100">
                <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900">Total Transactions</h5>
                <p className="font-semibold text-4xl text-gray-700">{transactions.length}</p>
              </a>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}
