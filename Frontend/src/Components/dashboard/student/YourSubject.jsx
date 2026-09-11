import React from 'react'
import api from '../../../api/axios'
import { useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
const YourSubject = ({ title, type, _id }) => {

  const [chapter, setChapter] = useState(0);
  const [error, setError] = useState('')
  const [file, setFileCount] = useState(0);
  const navigate = useNavigate();

  const data = async () => {
    try {
      const chapterCount = await api.get(`/api/chapter/getchapter/${_id}`,
        { withCredentials: true },
      );
      setChapter(chapterCount.data?.chapter?.length || 0)
      setError('')

      const materialRes = await api.get("/api/material/materials", {  
params: { subjectId: _id },
        withCredentials: true,
      });
      setFileCount(materialRes.data?.length || 0);      
    }
    catch(err) {
      setError(err.response?.data?.message || "something went Wrong")
    }
  }
  useEffect(() => {
    if (_id) {
      data()
    }
  }, [_id])

  const handleClick = () => {
    navigate(`/student/subjects/${_id}`);
  }
  return (
    <>
      <section onClick={handleClick}>
        <div className='bg-white border border-gray-300 rounded-2xl pl-6 hover:-translate-y-1 transition ease-in'>
          <h1 className='font-semibold font-display pt-3'>{title}</h1>
          <div className='flex text-ink-soft text-sm pt-1 space-x-1'>
            <p>Chapter:{chapter}</p>
            <p>Files:{file}</p>
          </div>
          <p className={`inline-block mt-2 mb-2 px-3 py-1 text-sm rounded-2xl w-fit font-semibold font-sans ${type === "joined" ? "bg-coral/10 text-coral" : "bg-violet/10 text-violet"
            }`}>{type === "joined" ? " Joined Class" : "My Subject"}</p>
        </div>
      </section>
    </>
  )
}

export default YourSubject