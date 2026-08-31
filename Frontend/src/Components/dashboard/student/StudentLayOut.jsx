import { Outlet } from 'react-router-dom'
import { useState } from 'react'
import StudentSideBar from './StudentSideBar'
import { Menu } from 'lucide-react'

const StudentLayOut = () => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="flex flex-col min-h-screen">
      
   
      <div className="lg:hidden flex items-center justify-between p-4 bg-white  border-gray-300">
        <h3 className="text-lg font-display font-semibold">Study Buddy</h3>
        <button onClick={() => setIsOpen(true)} aria-label="Open menu">
          <Menu size={22} />
        </button>
      </div>

      {/* Neeche wala hissa: Sidebar + Content, side by side */}
      <div className="flex flex-1">
        <StudentSideBar isOpen={isOpen} setIsOpen={setIsOpen} />
        <main className="flex-1 bg-paper">
          <Outlet />
        </main>
      </div>

    </div>
  )
}

export default StudentLayOut