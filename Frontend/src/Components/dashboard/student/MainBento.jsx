import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import api from "../../../api/axios";
import YourSubject from "./YourSubject";
import YourStudyPlanner from "./YourStudyPlanner";
import YourExamPrep from "./YourExamPrep";
import YourQuiz from "./YourQuiz";

const MainBento = () => {
  const location = useLocation();
  const basePath = location.pathname.startsWith('/teacher') ? '/teacher' : '/student';
  const [subjects, setSubject] = useState([]);
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)
   const getSubject = async () => {
    try {
      setLoading(true)
      const res = await api.get('/api/subject/getSubject?dashboard=true', { withCredentials: true })
      setSubject(res.data.subject || []);
      setError('')
    }
    catch (err) {
      setError(err.response?.data?.message || "something went wrong");
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    getSubject();
  }, [])

  return (
    <main className="grid grid-cols-1 lg:grid-cols-[1.6fr_1fr] gap-5 pt-6">
      <div className="flex flex-col gap-5">
        <div className="flex justify-between">
          <h1 className="font-semibold font-display">Your Subjects</h1>
          <Link
            to={`${basePath}/subjects`}
            className="text-violet text-sm font-sans font-semibold"
          >
            View all
          </Link>
        </div>

        {loading ? (
          <p className="text-sm text-ink-soft">Loading subjects...</p>
        ) : error ? (
          <p className="text-sm text-coral">{error}</p>
        ) : subjects.length > 0 ? (
          <div className="grid grid-cols-1 gap-2 xs:grid xs:grid-cols-2 sm:grid sm:grid-cols-2 md:grid md:grid-cols-3 md:gap-3 lg:grid lg:grid-cols-2">
            {subjects.map((e, index) => {
              return <YourSubject key={e._id || index} {...e} />;
            })}
          </div>
        ) : (
          <div className="bg-white border border-gray-200 rounded-2xl p-6 text-center text-sm text-ink-soft">
            No subjects added yet. Create your first subject or join a class!
          </div>
        )}

        <YourQuiz />
      </div>
      <div className="">
        <YourStudyPlanner />
        <YourExamPrep />
      </div>
    </main>
  );
};

export default MainBento;
