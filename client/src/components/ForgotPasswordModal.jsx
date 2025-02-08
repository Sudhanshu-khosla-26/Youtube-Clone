import { useState } from "react";
import axios from "axios";

const ForgotPasswordModal = ({ isOpen, onClose }) => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Replace with your actual API endpoint
      await axios.post("http://localhost:8000/api/v1/users/forgot-password", { email });
      setMessage("Password reset link sent to your email.");
    } catch (error) {
      setMessage("An error occurred. Please try again.");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50">
      <div className="bg-zinc-900 p-8 rounded-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4 text-white">Forgot Password</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-white">
              Email address
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="mt-1 block w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-md text-white shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500"
            />
          </div>
          {message && <p className="text-sm text-red-400">{message}</p>}
          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-zinc-700 rounded-md text-white hover:bg-zinc-800"
            >
              Cancel
            </button>
            <button type="submit" className="px-4 py-2 bg-red-600 rounded-md text-white hover:bg-red-500">
              Reset Password
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ForgotPasswordModal;