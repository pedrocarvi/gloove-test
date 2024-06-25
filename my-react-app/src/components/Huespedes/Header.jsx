import { useState } from "react";
import { BellIcon, UserCircleIcon } from "@heroicons/react/24/outline";
import { motion } from "framer-motion";

const Header = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  return (
    <header className="bg-white shadow-md py-4 px-6 flex items-center justify-between">
      <div className="text-2xl font-bold text-gray-700">Dashboard</div>
      <div className="flex items-center space-x-4">
        <button className="text-gray-600 hover:text-gray-800">
          <BellIcon className="h-6 w-6" />
        </button>
        <button
          className="text-gray-600 hover:text-gray-800"
          onClick={toggleModal}
        >
          <UserCircleIcon className="h-8 w-8" />
        </button>
      </div>

      {isModalOpen && (
        <motion.div
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <motion.div
            className="bg-white rounded-lg p-6 shadow-lg max-w-md w-full"
            initial={{ y: "-100vh" }}
            animate={{ y: 0 }}
            transition={{ duration: 0.5, type: "spring", stiffness: 120 }}
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-gray-700">Edit Profile</h2>
              <button
                onClick={toggleModal}
                className="text-gray-600 hover:text-gray-800"
              >
                <span className="text-2xl">&times;</span>
              </button>
            </div>
            <form>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Name
                </label>
                <input
                  type="text"
                  placeholder="Your Name"
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:border-teal-500"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Email
                </label>
                <input
                  type="email"
                  placeholder="Your Email"
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:border-teal-500"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Password
                </label>
                <input
                  type="password"
                  placeholder="New Password"
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:border-teal-500"
                />
              </div>
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={toggleModal}
                  className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md mr-2"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-teal-600 text-white px-4 py-2 rounded-md hover:bg-teal-700"
                >
                  Save
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </header>
  );
};

export default Header;
