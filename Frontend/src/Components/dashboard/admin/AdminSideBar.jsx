import React from 'react'
import LogOut from '../../common/LogOut'
import { NavLink } from 'react-router-dom'
const AdminSideBar = () => {
  return (
   <>
    <aside className='bg-white w-64 h-screen flex flex-col p-4  border border-gray-300 rounded-l-lg' >
        <div>Study Buddy</div>
        <NavLink to='/admin' end className={({ isActive }) => isActive ? "bg-black text-white px-2 py-2 rounded-2xl" : "bg-red-500 text-black"}>
          Dashboard
        </NavLink>
        <LogOut />

      </aside>
   </>
  )
}

export default AdminSideBar