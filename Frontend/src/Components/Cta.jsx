
import React from 'react'
import { Link } from 'react-router-dom'
const Cta = () => {
    return (
        <>
            <main className='relative overflow-hidden w-[90%] mx-auto sm:max-w-150 md:max-w-195 lg:max-w-280 rounded-3xl bg-violet mt-12 md:mt-18'>
                <div className=' absolute  -top-16 -right-12 w-56 h-56 rounded-full bg-coral opacity-20'></div>
                <section className='flex flex-col space-y-8 md:flex md:flex-row justify-between p-15'>
                    <div>
                        <h1 className='text-2xl text-white font-semibold font-sans md:text-3xl '>Stop hunting for your notes.</h1>
                        <p className='text-gray-300 font-sans'>Set up your first subject in under a minute — no credit card, no clutter.</p>
                    </div>
                    <div>
                        <Link className=' font-semibold font-sans bg-white text-violet px-4 py-3 rounded-full ' to='/signup'><button>Sign Up Free</button></Link>
                    </div>

                </section>
            </main>
        </>
    )
}

export default Cta