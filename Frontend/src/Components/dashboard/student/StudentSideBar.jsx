import React from 'react'
import { NavLink } from 'react-router-dom'
import { LayoutDashboard, BookOpen, Users, Calendar, HelpCircle, Zap, Search, Settings, X } from 'lucide-react'
import LogOut from '../../common/LogOut'
import { UserContext } from '../../../Context/UserContext'
import { useContext } from 'react'
import { useEffect } from 'react'

const StudentSideBar = ({ isOpen, setIsOpen }) => {

  const { user } = useContext(UserContext) || {};

  const navItemClass = ({ isActive }) =>
    `flex items-center gap-2 px-3 py-2 mt-1 rounded-lg text-sm font-semibold ${isActive ? 'bg-violet/10 text-violet' : 'text-ink-soft hover:bg-paper'
    }`
  const navLinks = (
    <nav className='flex flex-col mt-8'>
      <NavLink to='/student' end className={navItemClass} onClick={() => setIsOpen(false)}>
        <LayoutDashboard size={18} /> Dashboard
      </NavLink>
      <NavLink to='/student/subjects' className={navItemClass} onClick={() => setIsOpen(false)}>
        <BookOpen size={18} /> My Subject
      </NavLink>
      <NavLink to='/student/joined-classes' className={navItemClass} onClick={() => setIsOpen(false)}>
        <Users size={18} /> Joined Classes
      </NavLink>
      <NavLink to='/student/study-planner' className={navItemClass} onClick={() => setIsOpen(false)}>
        <Calendar size={18} /> Study Planner
      </NavLink>
      <NavLink to='/student/quiz-generator' className={navItemClass} onClick={() => setIsOpen(false)}>
        <HelpCircle size={18} /> Quiz Generator
      </NavLink>
      <NavLink to='/student/smart-prep' className={navItemClass} onClick={() => setIsOpen(false)}>
        <Zap size={18} /> Smart Prep
      </NavLink>
      <NavLink to='/student/search' className={navItemClass} onClick={() => setIsOpen(false)}>
        <Search size={18} /> Search
      </NavLink>
      <h4 className='font-semibold text-sm text-ink-soft font-sans pt-2'>Account</h4>
      <NavLink to='/student/setting' className={navItemClass} onClick={() => setIsOpen(false)}>
        <Settings size={18} /> Setting
      </NavLink>
      <LogOut />

      <div className='mt-16 border-t border-gray-300 flex space-x-2' >
        <div>
          <p className='px-2.5 py-1 mt-2 w-fit bg-violet text-white text-sm font-semibold rounded-full'>{user?.name ? user.name.charAt(0).toUpperCase() : 'U'}</p>
        </div>
        <div>
          <h1 className='font-display font-semibold capitalize'>{user?.name || ''}</h1>
          <p className='text-sm text-ink-soft capitalize'>{user?.role || ''}</p>
        </div>
      </div>
    </nav>
  )

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div className='fixed inset-0 z-50 lg:hidden'>
          <div className='fixed inset-0 bg-black/40' onClick={() => setIsOpen(false)}></div>
          <aside className='fixed left-0 top-0 h-full w-64 bg-white p-4 overflow-y-auto'>
            <div className='flex items-center justify-between'>
              <h3 className='text-lg font-display font-semibold'>Study Buddy</h3>
              <button onClick={() => setIsOpen(false)} aria-label='Close menu'>
                <X size={20} />
              </button>
            </div>
            {navLinks}
          </aside>
        </div>
      )}

      {/* Desktop Sidebar */}
      <aside className='hidden lg:flex lg:flex-col bg-white w-64 min-h-screen p-4 border border-gray-300 rounded-l-lg'>
        <h3 className='text-lg font-display font-semibold ml-4'>Study Buddy</h3>
        {navLinks}
      </aside>
    </>
  )
}

export default StudentSideBar