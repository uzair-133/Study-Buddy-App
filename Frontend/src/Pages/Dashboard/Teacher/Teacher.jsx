
import api from '../../../api/axios'
import { UserContext } from '../../../Context/UserContext'
import MainBento from '../../../Components/dashboard/student/MainBento'
import Welcome from '../../../Components/dashboard/student/Welcome'
import { useEffect, useState } from 'react'
import StatsCard from '../../../Components/dashboard/student/StatsCard'
const Teacher = () => {

   const [stats, setStats] = useState({
    subjects: 0,
    createdClasses: 0,
    filesUploaded: 0,
    quizzesTaken: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [subjectRes, materialRes, classRes] = await Promise.allSettled([
          api.get("/api/subject/getSubject", { withCredentials: true }),
          api.get("/api/material/materials", { withCredentials: true }),
          api.get("/api/class/getMyClass", { withCredentials: true }),
        ]);

        const subjectsCount =
          subjectRes.status === "fulfilled"
            ? subjectRes.value.data.subject?.length || 0
            : 0;

        const filesCount =
          materialRes.status === "fulfilled"
            ? materialRes.value.data?.length || 0
            : 0;

        const classesCount =
          classRes.status === "fulfilled"
            ? classRes.value.data.allclass?.length || 0
            : 0;

        setStats((prev) => ({
          ...prev,
          subjects: subjectsCount,
          filesUploaded: filesCount,
          createdClasses: classesCount,
        }));
      } catch (err) {
        console.log(err);
      }
    };
    fetchStats();
  }, []);

  return (
    <>
      <main className="p-10">
        <Welcome />
        <div className="grid grid-cols-1 gap-2 xs:grid xs:grid-cols-2 xs:gap-2 sm:grid sm:grid-cols-2 sm:gap-2 md:grid md:grid-cols-3 md:gap-3 lg:grid lg:grid-cols-4 lg:gap-4 pt-8">
          <StatsCard number={stats.subjects} label="My Subject" />
          <StatsCard number={stats.createdClasses} label="Created Classes" />
          <StatsCard number={stats.filesUploaded} label="File Uploaded" />
          <StatsCard number={stats.quizzesTaken} label="Quiz Taken" />
        </div>
        <MainBento />
      </main>

    </>
  )
}

export default Teacher