import React from 'react'
import { Link } from 'react-router-dom'
const Footer = () => {
    return (
        <>
            <main className=' sm:flex items-center justify-between w-[90%] mx-auto pt-10  sm:max-w-150 md:max-w-195 lg:max-w-280 pb-10 '>
                <section>
                 <p className='text-ink-soft text-sm font-sans'>&copy; 2026 StudyBuddy. All rights reserved.</p>
                </section>
                <section className='text-ink-soft text-sm font-sans flex space-x-4 pt-3    sm:pt-0'>
                  <Link to='/#features'>Features</Link>
                  <Link to='/#how'>How its Works</Link>
                  <Link to='/login'>Log in</Link>
                </section>
            </main>
        </>
    )
}

export default Footer