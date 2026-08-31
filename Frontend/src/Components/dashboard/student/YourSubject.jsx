import React from 'react'
import { Link } from 'react-router-dom'
const YourSubject = ({ name, Chapter, file, type }) => {
  return (
    <>
      <section>
        <div className='bg-white border border-gray-300 rounded-2xl text-center hover:-translate-y-1 transition ease-in'>
          <h1 className='font-semibold font-sans pt-2'>{name}</h1>
          <div className='flex justify-center space-x-2 text-ink-soft text-sm'>
            <p>Chapter:{Chapter}</p>
            <p>Files:{file}</p>
          </div>
          <p className={`inline-block mt-2 mb-2 px-3 py-1 text-sm rounded-2xl w-fit font-semibold font-sans ${
            type === "joined" ? "bg-coral/10 text-coral": "bg-violet/10 text-violet"
          }`}>{type === "joined" ? " Joined Class" : "My Subject"}</p>
        </div>
      </section>
    </>
  )
}

export default YourSubject