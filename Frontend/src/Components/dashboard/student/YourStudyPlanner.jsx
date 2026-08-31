import React from 'react'
import { Link } from 'react-router-dom'
const YourStudyPlanner = () => {
  const StudyPlannerData = [
    {
      date: 14,
      month: "Aug",
      subject: "Physics",
      chapter: "Ch 2 & 5",
      note: "Revised"
    },
    {
      date: 5,
      month: "Sep",
      subject: "Chemistry",
      chapter: "Ch 1",
      note: "New Topic"
    },
    {
      date: 2,
      month: "Sep",
      subject: "Bio",
      chapter: "Ch 3",
      note: "Test Prep"
    }
  ]
  return (
    <>
      <section className='bg-white rounded-2xl p-4 border  border-gray-300 '>
        <div className='flex justify-between'>
          <h1 className='font-semibold font-display text-sm'>Study Planner </h1>
          <p className='text-violet text-sm font-display'>View all</p>
        </div>
        <div>
          {
            StudyPlannerData.map((e, index) => {
              return (
                <>
                  <div key={index} {...e} className='flex space-x-2 space-y-2 mt-3 border-b border-gray-200'>
                    <div className='rounded-md bg-gray-100 leading-4 px-2 py-1  font-semibold font-display text-[13px] '>
                      <p className=''>{e.date}</p>
                      <p className=''>{e.month}</p>
                    </div>
                    <div>
                      <p className='text-sm font-sans font-semibold'>{e.subject} {e.chapter}</p>
                      <p className='text-ink-soft text-sm font-sans'>{e.note}</p>

                    </div>
                  </div>
                </>
              )
            })
          }
        </div>
        <div className='mt-5 flex justify-center'>
          <Link to='/student/study-planner' className=' px-8 py-2 text-sm sm:px-14  rounded-md outline-dashed  outline-2 outline-gray-300 text-center   font-semibold font-sans text-violet'>
            +Add Study Task
          </Link>
        </div>

      </section>
    </>
  )
}

export default YourStudyPlanner


