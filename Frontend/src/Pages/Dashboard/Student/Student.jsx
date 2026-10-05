import Welcome from "../../../Components/dashboard/student/Welcome";
import StatsCard from "../../../Components/dashboard/student/StatsCard";
import { useState, useEffect } from "react";
import MainBento from "../../../Components/dashboard/student/MainBento";
import api from "../../../api/axios";
const Student = () => {
  const [stats, setStats] = useState({
    subjects: 0,
    joinedClasses: 0,
    filesUploaded: 0,
    quizzesTaken: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const subjectRes = await api.get("/api/subject/getSubject", {
          withCredentials: true,
        });
        const joinedRes = await api.get("/api/class/getJoinedClass", {
          withCredentials: true,
        });
        const materialRes = await api.get("/api/material/materials", {
          withCredentials: true,
        });
        const quizRes = await api.get("/api/quiz/history", {
          withCredentials: true,
        });

        setStats({
          subjects: subjectRes.data.subject?.length || 0,
          joinedClasses: joinedRes.data.data?.length || joinedRes.data.count || 0,
          filesUploaded: materialRes.data?.length || 0,
          quizzesTaken: quizRes.data.quizzes?.length || quizRes.data.count || 0,
        });
      } catch (err) {
        console.log("Stats fetch error:", err);
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
          <StatsCard number={stats.joinedClasses} label="Joined Classes" />
          <StatsCard number={stats.filesUploaded} label="File Uploaded" />
          <StatsCard number={stats.quizzesTaken} label="Quiz Taken" />
        </div>
        <MainBento />
      </main>
    </>
  );
};

export default Student;
