import { useContext, useState } from "react"
import { UserContext } from "../../../Context/UserContext"

const Welcome = () => {
    const { user } = useContext(UserContext) || {}
    const [student] = useState("student")
    return (
        <>
            <section className='flex flex-col-reverse gap-6 md:flex md:justify-between md:flex-row'>
                <div>
                    <h1 className='font-semibold md:text-2xl font-display capitalize'>{user?.role || student} Dashboard</h1>
                    <p className='font-semibold text-1xl  pt-2 text-violet font-sans'>Welcome back,{user?.name || ''}!</p>
                    <p className='text-ink-soft '>Here's what's happening across your subjects and classes.</p>
                </div>
                <div>
                    <input className=' border border-gray-300 rounded-full px-2 py-2 text-sm bg-white focus:outline-none' type="text" placeholder='Search Your Notes..' />
                </div>
            </section>
        </>
    )
}

export default Welcome