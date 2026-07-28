import React from 'react'

const WorkCard = ({ no, iconColor, bgColor, title, des }) => {
    return (
        <>
            <div className=' bg-paper-raised border border-line rounded-2xl p-4'>
                <div className={`w-10 h-10 rounded-full ${bgColor}  flex items-center justify-center mb-4`}>
                    <p className={`${iconColor} font-semibold`}>{no}</p>
                </div>
                <h1 className='text-ink font-display text-[18px] font-semibold pt-2'>{title}</h1>
                <p className='pt-4 pb-2 font-sans text-sm  text-ink-soft'>{des}</p>
            </div>

        </>
    )
}

export default WorkCard