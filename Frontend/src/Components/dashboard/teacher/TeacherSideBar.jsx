import React, { useContext, useState, useEffect } from 'react'
import { NavLink } from 'react-router-dom'
import { LayoutDashboard, BookOpen, Users, Calendar, HelpCircle, Search, Settings, X } from 'lucide-react'
import { UserContext } from '../../../Context/UserContext'
import LogOut from '../../common/LogOut'

const TeacherSideBar = ({ isOpen, setIsOpen }) => {
  const { user } = useContext(UserContext) || {}
  const [imgError, setImgError] = useState(false)

  useEffect(() => {
    setImgError(false)
  }, [user?.profileImage])

  const navItemClass = ({ isActive }) =>
    `flex items-center gap-2.5 px-3 py-2 mt-1 rounded-xl text-sm font-semibold transition-colors ${
      isActive ? 'bg-violet/10 text-violet' : 'text-ink-soft hover:bg-paper hover:text-ink'
    }`

  const navLinks = (
    <nav className='flex flex-col mt-4 flex-1 overflow-y-auto pr-1'>
      <NavLink to='/teacher' end className={navItemClass} onClick={() => setIsOpen(false)}>
        <LayoutDashboard size={18} /> Dashboard
      </NavLink>
      <NavLink to='/teacher/subjects' className={navItemClass} onClick={() => setIsOpen(false)}>
        <BookOpen size={18} /> My Subject
      </NavLink>
      <NavLink to='/teacher/create-classes' className={navItemClass} onClick={() => setIsOpen(false)}>
        <Users size={18} /> My Classes
      </NavLink>
      <NavLink to='/teacher/study-planner' className={navItemClass} onClick={() => setIsOpen(false)}>
        <Calendar size={18} /> Study Planner
      </NavLink>
      <NavLink to='/teacher/quiz-generator' className={navItemClass} onClick={() => setIsOpen(false)}>
        <HelpCircle size={18} /> Quiz Generator
      </NavLink>
      <NavLink to='/teacher/search' className={navItemClass} onClick={() => setIsOpen(false)}>
        <Search size={18} /> Search
      </NavLink>

      <h4 className='font-semibold text-xs text-ink-soft uppercase tracking-wider font-sans pt-4 pb-1 px-3'>
        Account
      </h4>
      <NavLink to='/teacher/setting' className={navItemClass} onClick={() => setIsOpen(false)}>
        <Settings size={18} /> Setting
      </NavLink>
      <div className="mt-1">
        <LogOut />
      </div>
    </nav>
  )

  const userProfile = (
    <div className='pt-3 mt-2 border-t border-gray-200 flex items-center gap-3 shrink-0'>
      <div className='w-9 h-9 rounded-full bg-violet text-white text-sm font-semibold flex items-center justify-center shrink-0 overflow-hidden shadow-xs'>
        {user?.profileImage && !imgError ? (
          <img
            key={user.profileImage}
            src={user.profileImage}
            alt={user?.name || 'User'}
            className='w-full h-full object-cover'
            onError={() => setImgError(true)}
          />
        ) : (
          user?.name ? user.name.charAt(0).toUpperCase() : 'U'
        )}
      </div>
      <div className='min-w-0 flex-1'>
        <h1 className='font-display font-semibold text-sm text-ink truncate capitalize'>
          {user?.name || ''}
        </h1>
        <p className='text-xs text-ink-soft capitalize truncate'>{user?.role || 'Teacher'}</p>
      </div>
    </div>
  )

  return (
    <>
      {/* Mobile Drawer */}
      {isOpen && (
        <div className='fixed inset-0 z-50 lg:hidden'>
          <div className='fixed inset-0 bg-black/40 backdrop-blur-xs' onClick={() => setIsOpen(false)}></div>
          <aside className='fixed left-0 top-0 h-full w-64 bg-white p-4 flex flex-col justify-between shadow-xl z-10'>
            <div className='flex flex-col flex-1 min-h-0'>
              <div className='flex items-center justify-between pb-2 border-b border-gray-100'>
                <h3 className='text-lg font-display font-semibold text-ink'>Study Buddy</h3>
                <button
                  onClick={() => setIsOpen(false)}
                  aria-label='Close menu'
                  className='p-1 text-gray-400 hover:text-gray-700 cursor-pointer'
                >
                  <X size={20} />
                </button>
              </div>
              {navLinks}
            </div>
            {userProfile}
          </aside>
        </div>
      )}

      {/* Desktop Sticky Sidebar */}
      <aside className='hidden lg:flex lg:flex-col justify-between bg-white w-64 h-screen sticky top-0 p-4 border-r border-gray-200 z-30 shrink-0'>
        <div className='flex flex-col flex-1 min-h-0'>
          <h3 className='text-lg font-display font-semibold text-ink px-3 py-1'>Study Buddy</h3>
          {navLinks}
        </div>
        {userProfile}
      </aside>
    </>
  )
}

export default TeacherSideBar