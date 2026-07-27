import Navbar from './Components/common/Navbar'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './Pages/Home'
import Login from './Pages/Login'
import SignUp from './Pages/SignUp'
const App = () => {
  return (
    <>
  
      <div className='bg-paper min-h-screen m-2 pt-6  md:pt-8 md:m-2'>
        <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/login' element={<Login />} />
          <Route path='/signup' element={<SignUp />} />
        </Routes>
      </BrowserRouter>
      </div>


    </>
  )
}

export default App