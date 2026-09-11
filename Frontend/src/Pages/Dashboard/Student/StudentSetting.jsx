import React from 'react'
import UpdateDetail from '../../../Components/dashboard/shared/UpdateDetail'
import ProfileAccount from '../../../Components/dashboard/shared/ProfileAccount'
import DeleteAccount from '../../../Components/dashboard/shared/DeleteAccount'
const StudentSetting = () => {
  return (
    <>
      <section className='m-10'>
        <div>
          <h1  className='text-ink font-semibold font-display text-2xl'>Settings</h1>
          <p className='text-ink-soft font-sans text-sm'>Manage your account details and preferences.</p>
        </div>

       <div className=''>
       <UpdateDetail />
      <ProfileAccount />
      <DeleteAccount />

       </div>
      </section>
     


    </>
  )
}

export default StudentSetting