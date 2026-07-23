import React from 'react'
import { Link } from 'react-router-dom'
const Navbar = () => {
  return (
   <>
   <header className='w-full h-16 bg-red-900'>
    <nav>
      <div>
        <Link to='/'>Study Buddy</Link>
        <ul>
          <Link to=''>Features</Link>
          <Link to=''>About</Link>
          <Link to=''>How its Work</Link>
        </ul>
        <div>
          <Link to='/login'><button>Login</button></Link>
          <Link to='/signup'><button>Sign Up</button></Link>
        </div>
      </div>
    </nav>
   </header>
   
   </>
  )
}

export default Navbar