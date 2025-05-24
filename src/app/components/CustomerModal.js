'use client';
import { useForm } from "react-hook-form";
import React from "react";

export default function CustomerModal({ isOpen, onClose, onSubmit, mode, customerData }) {
  const form = useForm();
  const { register, handleSubmit, reset, setValue } = form;
  const modalRef = React.useRef(null)

  React.useEffect(() => {
    if (isOpen) {
      reset();
      if (mode === 'edit' || mode === 'show') {
        if (customerData) {
          setValue("name", customerData.name);
          setValue("domicile", customerData.domicile);
          setValue("gender", customerData.gender);
        }
      }
    }
  }, [isOpen, reset, mode, customerData, setValue]);

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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 transition-opacity duration-300">
      <div id="modal" ref={modalRef} className="bg-white rounded-xl w-full max-w-md transform transition-all duration-300">
        <div className="relative p-4 w-full max-w-md max-h-full">
          <div className="relative bg-white rounded-lg">
            <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t border-gray-200">
              <h3 className="text-xl font-semibold text-gray-900">
                {mode === 'edit' ? 'Edit Customer' : mode === 'show' ? 'Customer Details' : 'Create New Customer'}
              </h3>
              <button onClick={onClose} type="button" className="end-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center" data-modal-hide="modal">
                <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                  <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
                </svg>
                <span className="sr-only">Close modal</span>
              </button>
            </div>
            <div className="p-4 md:p-5">
              <form 
                className="space-y-4"
                onSubmit={handleSubmit((data) => {
                  onSubmit({
                    ...data,
                  });
                  onClose();
                })}
              >
                <div>
                  <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-900 ">Customer Name</label>
                  <input {...register("name", { required: true })} type="text" name="name" id="name" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" placeholder="Enter customer name" required  readOnly={mode === 'show'}/>
                </div>

                <div>
                  <label htmlFor="domicile" className="block mb-2 text-sm font-medium text-gray-900 ">Domicile</label>
                  <input {...register("domicile", { required: true })} type="text" name="domicile" id="domicile" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" placeholder="Enter customer domicile" required  readOnly={mode === 'show'}/>
                </div>

                <div>
                  <label htmlFor="gender" className="block mb-2 text-sm font-medium text-gray-900 ">Gender</label>
                  <select id="gender" name="gender" {...register("gender", { required: true })} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" disabled={mode === 'show'}>
                    <option disabled hidden value="">Choose a gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                  </select>
                </div>

                <div className="flex space-x-3 pt-2">
                  <button type="button" onClick={onClose} className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors duration-200 text-sm">Cancel</button>
                  {mode !== 'show' && (
                    <button type="submit" className="flex-1 px-4 py-2 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm text-center">{mode === 'edit' ? 'Update Customer' : 'Add Customer'}</button>
                  )}
                </div>
              </form>
            </div>
          </div>
        </div>
      </div> 
    </div>
  );
}