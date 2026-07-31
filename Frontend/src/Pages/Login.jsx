import React from 'react'
import { use } from 'react';
import { useState } from 'react'
import axios from 'axios';
import Footer from '../Components/common/Footer';
import Forget from './Forget';
import { Link } from 'react-router-dom';
const Login = () => {
  const [form, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: ""
  })
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
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
    if (!form.email || !form.password || !form.confirmPassword) {
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

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match")
      return
    }

    setLoading(true)
    //api call
    try {
      const res = await axios.post("https://jsonplaceholder.typicode.com/users", {
        ...form
      })
      console.log(res.data)
      alert("login successfully")
      setFormData({ email: "", password: "", confirmPassword: "" })
    }
    catch (err) {
      console.log("errror", err)
    }
    finally {
      setLoading(false)
    }

  }
  return (
    <>
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
              <Link className='text-sm text-violet' to='/forget' >Forget Password ?</Link>
            </div>
            <input onChange={handleChange} name='password' value={form.password} className='input-field' type="password" placeholder='Password' />
            <label >Confirm Password</label>
            <input onChange={handleChange} name='confirmPassword' value={form.confirmPassword} className='input-field' type="password" placeholder='Confirm Password' />
            {error && <p style={{ color: "red" }}>{error}</p>}
            <button disabled={loading} className='font-sans  bg-violet px-4 py-3 rounded-full text-white'>{loading ? 'Submitting...' : 'Log In'}</button>
            <div className='flex mx-auto mb-2'>
              <p>Don't have an Account?</p>
              <Link className='text-violet' to='/signup'>Sign up Free</Link>
            </div>

          </form>
        </section>
      </main>
      <Footer />


    </>
  )
}

export default Login