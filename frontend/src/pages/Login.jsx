import { useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLogin, setIsLogin] = useState(true) // Toggle between login/signup
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (isLogin) {
        // LOGIN
        const res = await axios.post('http://localhost:8000/auth/login', {
          email,
          password,
        })
        alert('✅ Login successful!')
        localStorage.setItem('token', res.data.token)
        navigate('/dashboard')
      } else {
        // SIGNUP
        await axios.post('http://localhost:8000/auth/register', {
          email,
          password,
        })
        alert('✅ Signup successful! Now you can log in.')
        setIsLogin(true) // Switch to login mode
        setEmail('')
        setPassword('')
      }
    } catch (err) {
      alert(
        isLogin
          ? '❌ Invalid credentials'
          : '❌ Signup failed (maybe email already exists)'
      )
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded shadow-md w-96 space-y-4"
      >
        <h2 className="text-2xl font-bold text-center mb-4">
          {isLogin ? 'Login' : 'Signup'}
        </h2>

        <input
          type="email"
          placeholder="Email"
          className="w-full p-2 border border-gray-300 rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full p-2 border border-gray-300 rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button
          type="submit"
          className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
        >
          {isLogin ? 'Login' : 'Signup'}
        </button>

        <p className="text-center text-sm text-gray-600">
          {isLogin ? 'Don\'t have an account?' : 'Already have an account?'}{' '}
          <span
            onClick={() => setIsLogin(!isLogin)}
            className="text-blue-600 cursor-pointer hover:underline"
          >
            {isLogin ? 'Signup here' : 'Login here'}
          </span>
        </p>
      </form>
    </div>
  )
}
