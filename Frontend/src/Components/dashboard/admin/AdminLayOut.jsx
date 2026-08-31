import React from 'react'
import AdminSideBar from './AdminSideBar'
import { Outlet } from 'react-router-dom'
const AdminLayOut = () => {
  return (
    <>
      <div className='bg-paper min-h-screen m-2 rounded-2xl border border-gray-300   md:m-2'>
                <main className='flex'>
                    <aside>
                        <AdminSideBar />
                    </aside>
                    <section className='flex-1'>
                        <Outlet />
                    </section>

                </main>

            </div>
    </>
  )
}

export default AdminLayOut