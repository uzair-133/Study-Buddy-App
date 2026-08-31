// ResetPassword.jsx
import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'
import Navbar from '../Components/common/Navbar'
import api from '../api/axios'
const ResetPassword = () => {
  const { token } = useParams()
  const navigate = useNavigate()
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (password !== confirmPassword) {
      setError("Passwords do not match")
      return
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters")
      return
    }

    setLoading(true)
    try {
      const res = await api.post(`/api/auth/reset-password/${token}`, {
        newPassword: password
      })
      alert(res.data.message)
      navigate('/login')
    } catch (err) {
      console.log(err)
      setError(err.response?.data?.message || "Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  return (

    <>
      <div className='bg-paper min-h-screen m-2 pt-6   md:pt-8 md:m-2'>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center px-4">
          <div className="w-full max-w-md bg-paper-raised border border-line rounded-2xl p-8">
            <h1 className="font-display text-2xl font-semibold text-ink mb-2">Reset Password</h1>
            <p className="font-sans text-ink-soft text-sm mb-6">Enter your new password below.</p>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="New password"
                className="input-field"
              />
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm new password"
                className="input-field"
              />

              {error && <p className="text-coral text-sm">{error}</p>}

              <button type="submit" disabled={loading} className="btn-primary disabled:opacity-50">
                {loading ? 'Resetting...' : 'Reset Password'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  )
}

export default ResetPassword