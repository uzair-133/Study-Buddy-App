import React from 'react'
import { useState } from 'react'
import axios from 'axios';
import Footer from '../Components/common/Footer';
import Forget from './Forget';
import { Link } from 'react-router-dom';
import Navbar from '../Components/common/Navbar';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useContext } from 'react';
import { UserContext } from '../Context/UserContext';
import { toast } from "react-toastify";

const Login = () => {
  const [form, setFormData] = useState({
    email: "",
    password: "",
  })
  const { fetchUser } = useContext(UserContext) 
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate()
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }))
  }
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    //validation
    if (!form.email || !form.password) {
      setError("All Fields is Required")
      return
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(form.email)) {
      setError("Please Enter a valid Email Address")
      return
    }

    if (form.password.length < 6) {
      setError("Password must be at least 6 characters")
      return
    }

    // no confirmPassword required for login

    setLoading(true)
    //api call
    try {
      const res = await api.post("/api/auth/login", {
        email: form.email,
        password: form.password
      }, {
        withCredentials: true,
      })
      await fetchUser(); 

      console.log(res.data)
       toast.success("Login successfully!");
      setFormData({ email: "", password: "" })


      const userRole = res.data.user.role;
      if (userRole === "teacher") {
        navigate('/teacher');
      }
      else if (userRole === "student") {
        navigate('/student');
      }
      else if (userRole === "admin") {
        navigate('/admin');
      }
    }
    catch (err) {
      console.log("errror", err)
      // setError(err.response?.data?.message || "Something went wrong")
      toast.error(
        err.response?.data?.message || "Something went wrong"
    );
    }
    finally {
      setLoading(false)
    }

  }
  return (
    <>
      <div className='bg-paper min-h-screen m-2 pt-6   md:pt-8 md:m-2'>
        <Navbar />
        <main className=' max-w-100 mx-auto mt-8 md:mt-12 '>
          <h1 className='text-center font-display font-semibold text-xl md:text-2xl'>Study Buddy</h1>
          <section className=' w-[90%] mx-auto md:w-full bg-white px-5 rounded-2xl mt-6 md:mt-8'>
            <div>
              <h1 className='text-2xl font-display pt-6'>Welcome back</h1>
              <p className='pt-3 text-sm text-ink-soft'>Log in to pick up right where you left off.</p>
            </div>
            <form onSubmit={handleSubmit} className='flex flex-col pt-3 space-y-3' >
              <label>Email</label>
              <input onChange={handleChange} name='email' value={form.email} className='input-field' type="email" placeholder='Enter Email' />
              <div className='flex justify-between'>
                <label>Password</label>
                <Link className='text-sm text-violet' to='/forgot-password' >Forget Password ?</Link>
              </div>
              <input onChange={handleChange} name='password' value={form.password} className='input-field' type="password" placeholder='Password' />
              {error && <p style={{ color: "red" }}>{error}</p>}
              <button disabled={loading} className='font-sans  bg-violet px-4 py-3 rounded-full text-white'>{loading ? 'Submitting...' : 'Log In'}</button>
              <div className='flex mx-auto mb-2'>
                <p>Don't have an Account?</p>
                <Link className='text-violet' to='/signup'>SignUp</Link>
              </div>

            </form>
          </section>
        </main>
        <Footer />
      </div>
    </>
  )
}

export default Login