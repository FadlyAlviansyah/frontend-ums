  'use client';
  import { useForm } from "react-hook-form";
  import React, { useState } from "react";
  import Select from "react-select";
  import { IoCloseCircleOutline } from "react-icons/io5";

  export default function TransactionModal({ isOpen, onClose, onSubmit, mode, transactionData, customers, products }) {
    const form = useForm();
    const { register, handleSubmit, reset, setValue, watch } = form;
    const modalRef = React.useRef(null);
    const [addedProducts, setAddedProducts] = useState([]);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const [quantity, setQuantity] = useState(1); 
    const [total, setTotal] = useState(0); 

    const amountPaid = watch("amount_paid") || "";

    React.useEffect(() => {
      if (isOpen) {
        reset();
        if (mode === 'edit' || mode === 'show') {
          if (transactionData) {
            const customer = customers.find(customer => customer.id === transactionData.customer_id);
            if (customer) {
              setSelectedCustomer({
                value: customer.id,
                label: customer.name
              });
            }

            const productsWithQuantity = transactionData.transaction_details.map(detail => {
              const product = products.find(product => product.id === detail.product_id);
              return {
                value: product.id,
                label: product.name,
                price: product.price,
                quantity: detail.quantity
              };
            });
            setAddedProducts(productsWithQuantity || []);

            setValue("amount_paid", transactionData.amount_paid.toString());
            setValue("total", transactionData.total.toString());

            setValue("amount_change", transactionData.amount_change.toString());
          }
        }
      }
    }, [isOpen, reset, mode, transactionData, setValue, customers]);

    React.useEffect(() => {
      const handleClickOutside = (event) => {
        if (modalRef.current && !modalRef.current.contains(event.target)) {
          onClose();
        }
      };
      if (isOpen) {
        document.addEventListener("mousedown", handleClickOutside);
      }
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, [isOpen, onClose]);

    React.useEffect(() => {
      const newTotal = addedProducts.reduce((acc, product) => acc + (product.quantity * product.price), 0);
      setTotal(newTotal);
    }, [addedProducts]);

    if (!isOpen) return null;

    const customerOptions = customers.map(customer => ({
      value: customer.id,
      label: customer.name
    }));

    const productOptions = products.map(product => ({
      value: product.id,
      label: product.name,
      price: product.price
    }));

    const customStyles = {
      control: (provided) => ({
        ...provided,
        backgroundColor: 'rgb(249, 250, 251)',
        borderColor: 'rgb(209, 213, 219)',
        boxShadow: 'none',
        '&:hover': {
          borderColor: 'rgb(59, 130, 246)'
        },
        borderRadius: '0.375rem',
        padding: '0.1rem',
      }),
      singleValue: (provided) => ({
        ...provided,
        color: 'rgb(17, 24, 39)',
        fontSize: '0.875rem',
      }),
      option: (provided, state) => ({
        ...provided,
        color: state.isSelected ? 'white' : 'rgb(17, 24, 39)', 
        backgroundColor: state.isSelected ? 'rgb(59, 130, 246)' : 'white', '&:hover': {
          backgroundColor: 'rgb(229, 231, 235)', 
        },
      }),
    };

    const handleAddProduct = () => {
      if (selectedProduct && quantity > 0) {
        const existingProduct = addedProducts.find(product => product.value === selectedProduct.value);
        if (existingProduct) {
          setAddedProducts(addedProducts.map(product => 
            product.value === selectedProduct.value 
              ? { ...product, quantity: product.quantity + parseInt(quantity) } 
              : product
          ));
        } else {
          const productWithQuantity = {
            ...selectedProduct,
            quantity: parseInt(quantity) 
          };
          setAddedProducts([...addedProducts, productWithQuantity]);
        }
        setSelectedProduct(null);
        setQuantity(1);
      }
    };

    const handleRemoveProduct = (productToRemove) => {
      setAddedProducts(addedProducts.filter(product => product.value !== productToRemove.value));
    };

    const handleSubmitTransaction = () => {
      if (!selectedCustomer) {
        console.error("Customer must be selected");
        return;
      }

      const transactionData = {
        customer_id: selectedCustomer.value,
        total: total,
        amount_paid: amountPaid,
        items: addedProducts.map(product => ({
          product_id: product.value,
          quantity: product.quantity
        }))
      };
      
      onSubmit({
        ...transactionData,
        amount_paid: parseInt((transactionData.amount_paid || "0").toString().replace(/\./g, "")),
      });
      setAddedProducts([]);
      reset();
    };
    

    const formatRupiah = (angka) => {
      if (!angka) return "";
      const numeric = angka.toString().replace(/[^0-9]/g, "");
      return numeric.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    };

    const handleAmountPaidChange = (e) => {
      const value = e.target.value.replace(/[^0-9]/g, "");
      setValue("amount_paid", value);
    };

    const isAddTransactionDisabled = parseInt(amountPaid) < total;

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 transition-opacity duration-300">
        <div id="modal" ref={modalRef} className="bg-white rounded-xl w-full max-w-5xl transform transition-all duration-300">
          <div className="relative p-4 w-full max-h-full">
            <div className="relative bg-white w-full rounded-lg">
              <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t border-gray-200">
                <h3 className="text-xl font-semibold text-gray-900">
                  {mode === 'edit' ? 'Edit Transaction' : mode === 'show' ? 'Transaction Details' : 'Create New Transaction'}
                </h3>
                <button onClick={onClose} type="button" className="end-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center" data-modal-hide="modal">
                  <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
                  </svg>
                  <span className="sr-only">Close modal</span>
                </button>
              </div>
              <form 
                className="grid grid-cols-12 gap-2"
                onSubmit={handleSubmit((data) => {
                  handleSubmitTransaction();
                  onClose();
                })}
              >
                <div className={`p-4 md:p-5 ${mode === 'show' ? 'col-span-12' : 'col-span-5'} space-y-4`}>
                  <div>
                    <label className="block mb-2 text-sm font-medium text-gray-900 ">Customer Name</label>
                    <Select
                      id="name"
                      name="name"
                      options={customerOptions}
                      value={selectedCustomer} 
                      onChange={(selectedOption) => {
                        setValue("name", selectedOption.label);
                        setSelectedCustomer(selectedOption);
                      }}
                      isDisabled={mode === 'show'}
                      placeholder="Choose the customer"
                      styles={customStyles}
                    />
                  </div>

                  <div className="mt-4">
                    <h4 className="text-sm text-black">Added Products:</h4>
                    <ul className="space-y-2">
                      {addedProducts.map((product) => (
                        <li key={product.value} className="flex justify-between items-center text-black py-1 text-sm border-b-1">
                          <span>{product.label} (Qty: {product.quantity}) (Subtotal: Rp {formatRupiah(product.quantity * product.price)})</span>
                          {mode !== 'show' && (
                            <button onClick={() => handleRemoveProduct(product)} className="text-red-500 hover:text-red-700 text-xl"><IoCloseCircleOutline /></button>
                          )}
                        </li>
                      ))}
                    </ul>
                  </div>  

                  {mode === 'show' && (
                    <div>
                      <label className="block mb-2 text-sm font-medium text-gray-900 ">Total</label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-900 text-sm">Rp</span>
                        <input type="text" name="total" value={formatRupiah(total)} className="mt-1 block w-full pl-8 pr-4 py-2 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500" readOnly/>
                      </div>
                    </div>
                  )}

                  <div>
                    <label className="block mb-2 text-sm font-medium text-gray-900 ">Amount Paid {mode !== 'show' && (`(Total: Rp. ${formatRupiah(total)})`)}</label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-900 text-sm">Rp</span>
                      <input type="text" name="amount_paid" value={formatRupiah(amountPaid)} onChange={handleAmountPaidChange} className="mt-1 block w-full pl-8 pr-4 py-2 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500" placeholder="0" required readOnly={mode === 'show'} />
                    </div>
                  </div>

                  {mode === 'show' && (
                    <div>
                      <label className="block mb-2 text-sm font-medium text-gray-900 ">Amount Change</label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-900 text-sm">Rp</span>
                        <input type="text" name="amount_change" value={formatRupiah(watch("amount_change"))} className="mt-1 block w-full pl-8 pr-4 py-2 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500" readOnly/>
                      </div>
                    </div>
                  )}

                  <div className="flex space-x-3 pt-2">
                    <button type="button" onClick={onClose} className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors duration-200 text-sm">Cancel</button>
                    {mode !== 'show' && (
                      <button 
                        type="submit" 
                        className={`flex-1 px-4 py-2 text-white ${isAddTransactionDisabled ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-700 hover:bg-blue-800'} focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm text-center`}
                        disabled={isAddTransactionDisabled} 
                      >
                        {mode === 'edit' ? 'Update Transaction' : 'Add Transaction'}
                      </button>
                    )}
                  </div>
                </div>

                {mode !== 'show' && (
                  <div className="p-4 md:p-5 col-span-7 space-y-4">
                    <div>
                      <label className="block mb-2 text-sm font-medium text-gray-900 ">Product</label>
                      <Select
                        id="product"
                        name="product"
                        options={productOptions}
                        value={selectedProduct}
                        onChange={setSelectedProduct}
                        isDisabled={mode === 'show'}
                        placeholder="Choose the product"
                        styles={customStyles}
                      />
                    </div>

                    <div>
                      <label className="block mb-2 text-sm font-medium text-gray-900 ">Quantity</label>
                      <input 
                        type="number" 
                        id="quantity" 
                        name="quantity" 
                        value={quantity} 
                        onChange={(e) => setQuantity(e.target.value)}
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                        min="1"
                      />
                    </div>

                    <div className="flex space-x-3 pt-2">
                      {mode !== 'show' && (
                        <button type="button" onClick={handleAddProduct} className="flex-1 px-4 py-2 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm text-center">Add Product</button>
                      )}
                    </div>
                  </div>
                )}
              </form>
            </div>
          </div>
        </div> 
      </div>
    );
  }
