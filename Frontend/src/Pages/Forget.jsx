// ForgotPassword.jsx
import { useState } from 'react'
import axios from 'axios'

const Forgot = () => {
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setMessage('')
    setLoading(true)

    try {
      const res = await axios.post('http://localhost:3000/api/auth/forgot-password', { email })
      setMessage(res.data.message)
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-paper-raised border border-line rounded-2xl p-8">
        <h1 className="font-display text-2xl font-semibold text-ink mb-2">Forgot Password?</h1>
        <p className="font-sans text-ink-soft text-sm mb-6">
          Enter your email and we'll send you a reset link.
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="input-field"
          />

          {error && <p className="text-coral text-sm">{error}</p>}
          {message && <p className="text-mint text-sm">{message}</p>}

          <button type="submit" disabled={loading} className="btn-primary disabled:opacity-50">
            {loading ? 'Sending...' : 'Send Reset Link'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default Forgot