
import { useState, useEffect, useContext } from 'react'
import api from '../../../api/axios'
import { UserContext } from '../../../Context/UserContext'

const ProfileAccount = () => {
  const context = useContext(UserContext)
  const [user, setUser] = useState(context?.user || null)

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await api.get('/api/auth/me', { withCredentials: true })
        if (response.data?.user) {
          setUser(response.data.user)
        }
      } catch (error) {
        console.error('Error fetching user data:', error)
      }
    }

    fetchUser()
  }, [])

  const currentUser = user || context?.user

  if (!currentUser) {
    return <div className='p-5 text-gray-500 font-sans'>Loading profile...</div>
  }

  const avatarInitial = currentUser.name ? currentUser.name.charAt(0).toUpperCase() : 'U'

  return (
    <>
     <section className='bg-white rounded-2xl p-5 max-w-142.5 mt-5 flex flex-col items-center space-y-4'>
      <h1 className='bg-violet text-white font-bold font-display rounded-full px-8 py-6 w-fit'>{avatarInitial}</h1>
      <h1 className='text-xl font-sans text-black '>{currentUser.name}</h1>
      <p className='text-violet font-sans font-semibold text-[11px] px-2 py-1 rounded-2xl bg-violet/10 w-fit'>{currentUser.role}</p>
      <p className='text-gray-500 font-sans text-sm '>{currentUser.email}</p>
      <button className=' text-violet px-40 py-1 rounded-full font-semibold font-display text-sm border-[1.5px] border-violet'>Change Photo</button>
     </section>
    </>
  )
}

export default ProfileAccount