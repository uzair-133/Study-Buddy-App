import Navbar from './Components/common/Navbar'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './Pages/Home'
import Login from './Pages/Login'
import SignUp from './Pages/SignUp'
import ScrollToHash from './Components/ScrollToHash'
import Forget from './Pages/Forget'
import { useEffect } from 'react'
import 'aos/dist/aos.css';
import VerifyEmail from './Pages/VerifyEmail'
import CheckYourEmail from './Components/CheckYourEmail'
import Forgot from './Pages/Forget'
import ResetPassword from './Pages/ResetPassword'
import AOS from 'aos';
const App = () => {
  useEffect(() => {
    AOS.init({
      duration: 1500,
      once: true,
    })
  })
  return (
    <>

      <div className='bg-paper min-h-screen m-2 pt-6   md:pt-8 md:m-2'>
        <BrowserRouter>
          <ScrollToHash />
          <Navbar />
          <Routes>
            <Route path='/' element={<Home />} />
            <Route path='/login' element={<Login />} />
            <Route path='/signup' element={<SignUp />} />
            <Route path='/forget' element={<Forget />} />
            <Route path="/verify-email/:token" element={<VerifyEmail />} />
            <Route path="/check-your-email" element={<CheckYourEmail />} />
            <Route path="/forgot-password" element={<Forgot/>} />
            <Route path="/reset-password/:token" element={<ResetPassword />} />
          </Routes>
        </BrowserRouter>
      </div>


    </>
  )
}

export default App