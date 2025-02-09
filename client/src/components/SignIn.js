import { useEffect, useState } from "react"
import axios from "axios"
import { useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import ForgotPassword from "./ForgotPasswordModal"
import api from "../services/api.service";

const SignIn = () => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isOpen, setIsOpen] = useState(false)
  const navigate = useNavigate()

  const login = async (event) => {
    event.preventDefault()

    try {
      const response = await api.post("/users/login", {
        email,
        password,
      })
      console.log(response)
      localStorage.setItem("USER", JSON.stringify(response.data.data))
      navigate("/")
    } catch (err) {
      console.log(err)
    }
  }

  useEffect(() => {
    const user = localStorage.getItem("USER")
    if (user) {
      navigate("/")
    }
  }, [navigate])

  return (
    <div className="fixed inset-0 bg-[#0f0f0f] flex items-center justify-center z-[100000]">
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-[#222727] w-[90%] max-w-md rounded-lg shadow-xl p-8"
      >
        <div className="flex flex-col items-center mb-6">
          <motion.img
            whileHover={{ scale: 1.1 }}
            src="/favicon.svg"
            alt="Your Company"
            className="h-16 w-auto mb-4"
          />
          <h2 className="text-2xl font-bold text-red-500">Sign in to your account</h2>
        </div>

        <form onSubmit={login} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">
              Email address
            </label>
            <input
              onChange={(e) => setEmail(e.target.value)}
              id="email"
              name="email"
              type="email"
              required
              className="w-full px-3 py-2 bg-[#333] text-white rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label htmlFor="password" className="block text-sm font-medium text-gray-300">
                Password
              </label>
              <button
                type="button"
                onClick={() => setIsOpen(true)}
                className="text-sm text-red-400 hover:text-red-300"
              >
                Forgot password?
              </button>
            </div>
            <input
              onChange={(e) => setPassword(e.target.value)}
              id="password"
              name="password"
              type="password"
              required
              className="w-full px-3 py-2 bg-[#333] text-white rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            className="w-full bg-red-600 text-white py-2 rounded-md font-semibold hover:bg-red-700 transition duration-300"
          >
            Sign in
          </motion.button>
        </form>

        <p className="mt-8 text-center text-sm text-gray-400">
          Not a member?{" "}
          <a href="/v3/signup" className="font-semibold text-red-400 hover:text-red-300">
            Sign up
          </a>
        </p>
      </motion.div>
      {isOpen && <ForgotPassword isOpen={isOpen} onClose={() => setIsOpen(false)} />}
    </div>
  )
}

export default SignIn
