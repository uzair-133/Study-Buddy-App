import React from 'react'

const DeleteAccount = () => {
    return (
        <>
            <section className='bg-white rounded-2xl p-5 max-w-142.5 mt-5'>
                <div>
                    <h1  className='text-ink font-semibold font-display text-lg '>Danger Zone</h1>
                    <p  className='text-ink-soft font-sans text-[12px]'>Irreversible actions — proceed with caution.</p>
                </div>
                  <hr className='my-4 border-gray-300' />
                <div className='md:flex md:justify-between  md:mt-4'>
                    <div >
                        <h1  className='text-coral font-semibold font-display text-sm '>Delete Account</h1>
                        <p  className='text-ink-soft font-sans text-[12px] '>Permanently remove your account and all your data. </p>
                    </div>
                   
                    <div>
                        <button className='mt-3 text-coral px-4 py-2 rounded-full font-semibold font-sans text-[12px] bg-coral/10'>Delete Account</button>
                    </div>
                </div>
            </section>

        </>
    )
}

export default DeleteAccount