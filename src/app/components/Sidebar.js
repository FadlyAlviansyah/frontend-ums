"use client";
import Link from "next/link";
import 'flowbite';
import { MdSpaceDashboard } from "react-icons/md";
import { BsFillArchiveFill } from "react-icons/bs";
import { FaUser } from "react-icons/fa";
import { GrTransaction } from "react-icons/gr";

export default function Sidebar() {
  return (
    <aside className='h-screen bg-[#3F4151] text-white w-full'>
      <div className="flex items-center p-4 space-x-2 justify-center">
        <span className="text-3xl font-bold">Kasir<span className="text-blue-500">In</span></span>
      </div>

      <nav className="mt-8 flex flex-col space-y-2">
        <Link
          href="/"
          className="flex items-center px-4 py-2 hover:bg-[#2e3240] transition-colors rounded"
        >
          <MdSpaceDashboard />
          <span className="ml-3">Home</span>
        </Link>
        <Link
          href="/product"
          className="flex items-center px-4 py-2 hover:bg-[#2e3240] transition-colors rounded"
        >
          <BsFillArchiveFill />
          <span className="ml-3">Product</span>
        </Link>
        <Link
          href="/customer"
          className="flex items-center px-4 py-2 hover:bg-[#2e3240] transition-colors rounded"
        >
          <FaUser />
          <span className="ml-3">Customer</span>
        </Link>
        <Link
          href="/transaction"
          className="flex items-center px-4 py-2 hover:bg-[#2e3240] transition-colors rounded"
        >
          <GrTransaction />
          <span className="ml-3">Transaction</span>
        </Link>
      </nav>
    </aside>
  );
}