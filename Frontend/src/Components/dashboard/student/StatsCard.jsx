import React from 'react'

const StatsCard = ({number, label}) => {
    return (
        <>
            <section >
              <div  className='bg-white border border-gray-200 rounded-2xl pl-4 hover:-translate-y-1/12 transition ease-in'>
                <h1 className='font-semibold font-display text-2xl pt-3'>{number}</h1>
                <p className='font-sans text-ink-soft text-sm pb-4'>{label}</p>
              </div>
            </section>

        </>
    )
}

export default StatsCard