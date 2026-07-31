import Footer from '../Components/common/Footer';
import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import axios from 'axios'
const SignUp = () => {
  const [role, setRole] = useState('student');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false)
  const [form, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: ""
  })

  const handleChange = ((e) => {
    const { name, value } = e.target

    setFormData((prev) => ({
      ...prev,
      [name]: value
    }))

  })

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    //Validation

    if (!form.name || !form.email || !form.password || !form.confirmPassword) {
      setError("All fields are required")
      return
    }


    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(form.email)) {
      setError("Please enter a valid email address")
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
    try {
      const res = await axios.post("https://jsonplaceholder.typicode.com/users", {
        ...form,
        role
      })
      console.log(res.data)
      alert("Account Created Successfully");
      setFormData({name:"",email:"",password:"",confirmPassword:""})

    }
    catch (err) {
      console.log("error", err)
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
            <h1 className='text-2xl font-display pt-6'>Create your account</h1>
            <p className='pt-3 text-sm text-ink-soft'>Get started — it only takes a minute.</p>
          </div>
          <form onSubmit={handleSubmit} className='flex flex-col pt-3 space-y-3' >

            <div className='flex  bg-paper rounded-xl p-1'>
              <button type='button' onClick={() => setRole("student")} className={`flex-1 px-3 py-2 sm:px-4 sm:py-2 text-center rounded-xl font-semibold text-sm transition-colors ${role === 'student' ? 'bg-violet text-white' : 'bg-paper text-ink-soft'}`}>I am Student</button>
              <button type='button' onClick={() => setRole("teacher")} className={`flex-1 px-3 py-2 sm:px-4 sm:py-2 text-center rounded-xl font-semibold text-sm transition-colors ${role === 'teacher' ? 'bg-violet text-white' : 'bg-paper text-ink-soft'}`} >I am Teacher</button>
            </div>

            <label className='font-sans '>Full Name</label>
            <input onChange={handleChange} name='name' value={form.name} className='input-field' type="text" placeholder='Enter Name' />
            <label>Email</label>
            <input onChange={handleChange} name='email' value={form.email} className='input-field' type="email" placeholder='Enter Email' />
            <label>Password</label>
            <input onChange={handleChange} name='password' value={form.password} className='input-field' type="password" placeholder='Password' />
            <label >Confirm Password</label>
            <input onChange={handleChange} name='confirmPassword' value={form.confirmPassword} className='input-field' type="password" placeholder='Confirm Password' />
            {error && <p style={{ color: "red" }}>{error}</p>}
            <button disabled={loading} className='font-sans  bg-violet px-4 py-3 rounded-full text-white'>{loading ? 'Submitting...':'Sign In'}</button>
            <div className='flex mx-auto mb-2'>
              <p>Alreday have an Account?</p>
              <Link className='text-violet' to='/login'>Login</Link>
            </div>

          </form>
        </section>
      </main>
      <Footer />
    </>
  )
}

export default SignUp