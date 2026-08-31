import React from 'react'
import YourSubject from './YourSubject'
import YourStudyPlanner from './YourStudyPlanner'
import YourExamPrep from './YourExamPrep'
import YourQuiz from './YourQuiz'
import { Link } from 'react-router-dom'
const MainBento = () => {
  const Subject = [
    {
      name: "Chemistry",
      Chapter: 5,
      file: 7,
      type: "joined"
    },
    {
      name: "Physics",
      Chapter: 4,
      file: 14,
      type: "joined"
    },
    {
      name: "Math",
      Chapter: 1,
      file: 12,
      type: "My Subject"
    },
    {
      name: "English",
      Chapter: 2,
      file: 3,
      type: "My Subject"
    }
  ]


  return (
    <main className='grid grid-cols-1 lg:grid-cols-[1.6fr_1fr] gap-5 pt-6'>
      <div className='flex flex-col gap-5'>
        <div className='flex justify-between'>
          <h1 className='font-semibold font-display'>Your Subjects</h1>
          <Link to='/student/subjects' className='text-violet text-sm font-sans font-semibold'>View all</Link>
        </div>
      <div className='grid grid-cols-1 gap-2 xs:grid xs:grid-cols-2 sm:grid sm:grid-cols-2  md:grid md:grid-cols-3 md:gap-3 lg:grid lg:grid-cols-2'>
        {Subject.map((e, index) => {
          return (
            <YourSubject key={index} {...e} />
          )
        })}
      </div>
        <YourQuiz />
      </div>
      <div className=''>
        <YourStudyPlanner/>
        <YourExamPrep />
      </div>
    </main>
  )
}

export default MainBento