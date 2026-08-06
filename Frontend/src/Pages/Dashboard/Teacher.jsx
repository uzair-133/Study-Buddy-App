import { useState, useEffect } from 'react'
import axios from 'axios'

const Teacher = () => {
  const [dashboardData, setDashboardData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await axios.get("http://localhost:3000/api/teacher/dashboard", {
          withCredentials: true  
        })
        setDashboardData(res.data)
      } catch (err) {
        setError(err.response?.data?.message || "Something went wrong")
      } finally {
        setLoading(false)
      }
    }

    fetchDashboard()
  }, [])

  if (loading) return <p>Loading...</p>
  if (error) return <p>{error}</p>

  return (
    <div>
      <h1>Welcome, to teacher dashboard {dashboardData?.user?.name}</h1>
      {/* baaki dashboard content yahan */}
    </div>
  )
}

export default Teacher