import React from 'react'
import { Link } from 'react-router-dom'
import { Menu } from "@boxicons/react"
const Navbar = () => {

  const ToggleMenuButton = () => {
    const btn = document.getElementById('btn')
    if (btn.classList.contains('hidden')) {
      btn.classList.remove('hidden')
    }
    else {
      btn.classList.add('hidden')
    }
  }
  const ToggleMenuButtonClose = () => {
    const btn = document.getElementById('btn')
    if (btn.classList.contains('hidden')) {
      btn.classList.remove('hidden')
    }
    else {
      btn.classList.add('hidden')
    }
  }
  return (
    <>
      <div className='w-[90%] sm:max-w-[600px] md:max-w-[780px] lg:max-w-[1120px]   rounded-3xl mx-auto h-16  px-8 md:py-10 mt-8  relative bg-paper-raised flex items-center justify-between border-[0.5px] border-gray-300 '>
        <div>
          <Link  className='text-1xl sm:text-2xl font-display text-ink' to='/'>Study Buddy</Link>
        </div>
        <nav className='hidden md:flex items-center md:text-sm md:space-x-3'>
          <a className=' font-sans text-ink-soft hover:text-violet' href='#'>Features</a>
          <a className=' font-sans text-ink-soft hover:text-violet' href='#'>About</a>
          <a className=' font-sans text-ink-soft hover:text-violet' href='#'>How it Works</a>
        </nav>
        <div className='md:block hidden'>
          <Link className='text-ink font-sans hover:text-violet' to='/login'><button>Log in</button></Link>
          <Link className='ml-4 font-sans bg-violet px-4 py-3 rounded-full text-white' to='/signup'><button>Sign Up Free</button></Link>
        </div>

        {/*  Mobile menu  */}
        <button onClick={ToggleMenuButton} className='md:hidden block'>
          <Menu />
        </button>

        <div id='btn' className=' absolute hidden transition-all  duration-300 ease-in-out
              sm:max-w-[600px] h-55 mx-auto top-12 bottom-0 right-0 left-0 p-5 md:hidden  bg-paper-raised border border-line shadow-lg shadow-violet/10 p-5   '>
          <nav className='md:hidden flex flex-col space-y-3'>

            <a onClick={ToggleMenuButtonClose} href='#'>Features</a>
            <a onClick={ToggleMenuButtonClose} href='#'>About</a>
            <a onClick={ToggleMenuButtonClose} href='#'>How it Works</a>
          </nav>
          <div className='md:hidden block flex flex-col space-y-3'>
            <Link onClick={ToggleMenuButtonClose} className='text-ink font-sans hover:text-violet' to='/login'><button>Log in</button></Link>
            <Link onClick={ToggleMenuButtonClose} className=' font-sans bg-violet px-4 py-3 rounded-full text-white w-fit' to='/signup'><button>Sign Up Free</button></Link>
          </div>
        </div>
      </div>

    </>
  )
}

export default Navbar