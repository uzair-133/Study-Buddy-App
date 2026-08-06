import axios from 'axios';
import React from 'react'
import { useState, useEffect } from 'react'
const Student = () => {

  const [dashboard, setDashboard] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await axios.get("http://localhost:3000/api/student/dashboard", {
          withCredentials: true
        })
        setDashboard(res.data);
      }
      catch (err) {
        setError(err.response?.data?.message || "Something went wrong")
      }
      finally {
        setLoading(false)
      }
    }
    fetchDashboard()
  }, [])
  if (loading) return <p>Loading...</p>
  if (error) return <p>{error}</p>
  return (
    <>

      <h1>Welcome, to student dashboard {dashboard?.user?.name}</h1>
      {/* baaki dashboard content yahan */}
  
    </>
  )
}

export default Student