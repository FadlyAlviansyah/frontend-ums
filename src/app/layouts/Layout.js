import { Toaster } from "react-hot-toast";
import "flowbite";
import Sidebar from "../components/Sidebar";

export default function Layout({ children }) {
  return (
    <div className="flex min-h-screen">
      <Toaster position="top-right" reverseOrder={false} />
      <div className="w-64">
        <Sidebar />
      </div>

      <div className="flex-1 p-6 bg-gray-100">
        {children}
      </div>
    </div>
  );
}
