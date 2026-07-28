import React from 'react'
import WorkCard from './WorkCard'
const Work = () => {
    const workArr = [
        {
        no:1,
        iconColor: 'text-white',
        bgColor: 'bg-violet',
        title:"Set up your subjects",
        des:"Create a subject for each course, then chapters underneath — Math, Chapter 2, and so on."
        },
        
        {
        no:2,
        iconColor: 'text-white',
        bgColor: 'bg-violet',
        title:"Upload as you go",
        des:"Drop in lecture notes, slides or a photo of your handwriting right after class."
        },
        {
        no:1,
        iconColor: 'text-white',
        bgColor: 'bg-violet',
        title:"Prep before the exam",
        des:"Select the chapters being tested — StudyBuddy gathers everything relevant, instantly."
        }

    ]
  return (
    <>
    <main className='w-[90%] mx-auto pt-10  sm:max-w-150 md:max-w-195 lg:max-w-280'>
        <section className=''>
           <h1 className='text-2xl font-semibold font-sans md:text-3xl '>Three steps, then you're covered</h1>
        </section>
        <section className='grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-8'>
            {
           workArr.map((e,index)=> {
            return <WorkCard key={index} {...e} />
           })
            }
        </section>
    </main>
    
    
    </>
  )
}

export default Work