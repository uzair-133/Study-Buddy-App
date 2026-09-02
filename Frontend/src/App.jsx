import Navbar from './Components/common/Navbar'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './Pages/Home'
import Login from './Pages/Login'
import SignUp from './Pages/SignUp'
import ScrollToHash from './Components/ScrollToHash'
import Forget from './Pages/Forget'
import { useEffect } from 'react'
import 'aos/dist/aos.css';
import VerifyEmail from './Pages/VerifyEmail'
import CheckYourEmail from './Components/CheckYourEmail'
import Forgot from './Pages/Forget'
import ResetPassword from './Pages/ResetPassword'
import ProtectedRoutes from '../src/Routes/ProtectedRoutes'


//Student imports
import StudentLayOut from './Components/dashboard/student/StudentLayOut'
import Student from './Pages/Dashboard/Student/Student'
import StudentJoinedClass from './Pages/Dashboard/Student/StudentJoinedClass'
import StudentStudyPlanner from './Pages/Dashboard/Student/StudentStudyPlanner'
import StudentQuiz from './Pages/Dashboard/Student/StudentQuiz'
import StudentSmartPrep from './Pages/Dashboard/Student/StudentSmartPrep'
import StudentSearch from './Pages/Dashboard/Student/StudentSearch'
import StudentSetting from './Pages/Dashboard/Student/StudentSetting'
import StudentSubjects from './Pages/Dashboard/Student/StudentSubjects'
import StudentSubjectDetail from './Pages/Dashboard/Student/StudentSubjectDetail'
import StudentChapterDetail from './Pages/Dashboard/Student/StudentChapterDetail'

//Teacher  imports
import Teacher from './Pages/Dashboard/Teacher/Teacher'
import TeacherLayout from './Components/dashboard/teacher/TeacherLayout'
import TeacherSubjects from './Pages/Dashboard/Teacher/TeacherSubjects'
import TeacherCreateClass from './Pages/Dashboard/Teacher/TeacherCreateClass'
import TeacherQuiz from './Pages/Dashboard/Teacher/TeacherQuiz'
import TeacherSearch from './Pages/Dashboard/Teacher/TeacherSearch'
import TeacherSetting from './Pages/Dashboard/Teacher/TeacherSetting'


//Admin imports
import Admin from './Pages/Dashboard/Admin/Admin'
import AdminLayOut from './Components/dashboard/admin/AdminLayOut'
import AOS from 'aos';

const App = () => {
  useEffect(() => {
    AOS.init({
      duration: 1500,
      once: true,
    })
  })
  return (
    <>

      <BrowserRouter>
        <ScrollToHash />
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/login' element={<Login />} />
          <Route path='/signup' element={<SignUp />} />
          <Route path='/forget' element={<Forget />} />
          <Route path="/verify-email/:token" element={<VerifyEmail />} />
          <Route path="/check-your-email" element={<CheckYourEmail />} />
          <Route path="/forgot-password" element={<Forgot />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />

          {/* Student DashBoard Routes */}
          <Route path='/student' element={
            <ProtectedRoutes allowedRole="student">
              <StudentLayOut />
            </ProtectedRoutes>
          }
          >
            <Route index element={<Student />} />
            <Route path='subjects' element={<StudentSubjects />} />
            <Route path='subjects/:subjectId' element={<StudentSubjectDetail />} />
            <Route path='subjects/:subjectId/chapters/:chapterId' element={<StudentChapterDetail />} />
            <Route path='joined-classes' element={<StudentJoinedClass />} />
            <Route path='study-planner' element={<StudentStudyPlanner />} />
            <Route path='quiz-generator' element={<StudentQuiz />} />
            <Route path='smart-prep' element={<StudentSmartPrep />} />
            <Route path='search' element={<StudentSearch />} />
            <Route path='setting' element={<StudentSetting />} />
          </Route>

          {/* Teacher DashBoard Routes */}
          {
            <Route path='/teacher' element={<ProtectedRoutes allowedRole='teacher'> 
              <TeacherLayout />
            </ProtectedRoutes>}>
              <Route index element={<Teacher />} />
              <Route path='subjects' element={<TeacherSubjects />} />
              <Route path='create-classes' element={<TeacherCreateClass />} />
              <Route path='quiz-generator' element={<TeacherQuiz />} />
              <Route path='search' element={<TeacherSearch />} />
              <Route path='setting' element={<TeacherSetting />} />
            </Route>
          }

          {/* Admin DashBoard Routes */}
          <Route path='/admin' element={<ProtectedRoutes allowedRole='admin'>
            <AdminLayOut/>
          </ProtectedRoutes>}>
            <Route index element={<Admin />} />

          </Route>

        </Routes>
      </BrowserRouter>



    </>
  )
}

export default App