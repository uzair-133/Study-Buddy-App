import React from 'react'
import { Link } from 'react-router-dom'
const YourExamPrep = () => {
  return (
  <>
     <main className='relative overflow-hidden rounded-3xl bg-violet mt-8 '>
                <div className=' absolute  -top-4 -right-4 w-25 h-25 rounded-full  bg-coral opacity-30'></div>
                <section className='p-5'>
                    <div>
                        <h1 className='text-xl text-white font-semibold font-sans'>Exam coming up?</h1>
                        <p className='text-gray-300 font-sans text-sm'>Gather every note, slide and question from your chapters in one view.</p>
                    </div>
                    <div className='mt-2'>
                        <Link className=' font-semibold font-sans  relative z-0 bg-white text-violet px-3 py-1 rounded-full text-sm ' to='/student/smart-prep'><button>Start Smart Prep</button></Link>
                    </div>

                </section>
            </main>
  </>
  )
}

export default YourExamPrep