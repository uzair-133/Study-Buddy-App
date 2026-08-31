import Welcome from "../../../Components/dashboard/student/Welcome"
import StatsCard from "../../../Components/dashboard/student/StatsCard"
import { useState, useEffect } from "react"
import MainBento from "../../../Components/dashboard/student/MainBento"
const Student = () => {

  const [stats, setStats] = useState({
    subjects: 0,
    joinedClasses: 0,
    filesUploaded: 0,
    quizzesTaken: 0
  })
  return (
    <>
    <main className="p-10">
        <Welcome />
      <div className="grid grid-cols-1 gap-2 xs:grid xs:grid-cols-2 xs:gap-2 sm:grid sm:grid-cols-2 sm:gap-2 md:grid md:grid-cols-3 md:gap-3 lg:grid lg:grid-cols-4 lg:gap-4 pt-8">
        <StatsCard number={stats.subjects} label="My Subject" />
        <StatsCard number={stats.joinedClasses} label="Joined Classes" />
        <StatsCard number={stats.filesUploaded} label="File Uploaded" />
        <StatsCard number={stats.quizzesTaken} label="Quiz Taken" />
      </div>
      <MainBento />
    </main>
    </>
  )
}

export default Student