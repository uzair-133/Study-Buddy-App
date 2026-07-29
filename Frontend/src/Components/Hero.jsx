import React from 'react'
import { Link } from 'react-router-dom'
const Hero = () => {
    return (
        <main className='w-[90%] sm:max-w-150 md:max-w-195 lg:max-w-280   pt-10 md:pt-16 md:flex mx-auto  '>
            <div  id='left' className='w-full   '>
                <p className='text-violet py-1 px-2 rounded-full bg-line w-fit font-semibold'>Built for exam season</p>
                <h1 className='pt-4 text-4xl font-semibold font-display leading-[1.2]  sm:text-4xl md:text-5xl'>Every note, slide
                    and scribble <em className='font-display text-coral'>in one place</em>.</h1>
                <p className='pt-3 text-ink-soft'>StudyBuddy organizes your lectures, slides and handwritten notes by subject and chapter — then pulls it all together the moment you tell it what's on the exam.</p>
                <div className='pt-4  '>
                    <Link className=' font-sans font-semibold bg-violet px-3 py-2  sm:px-4 sm:py-3 rounded-full text-white w-fit' to='/signup'><button>Get Started-its Free</button></Link>
                    <button className='font-sans px-3 py-2 mt-4 ml-1 sm:px-4 sm:py-3 font-semibold rounded-full text-ink border-2  border-ink'> <a href="#">See how its works</a></button>
                </div>
            </div>
            <div  id='right' className='w-full mt-6 '>
                <div id='whitebox' className='w-[96%] h-full mx-auto bg-white rounded-2xl border-[0.5px] border-gray-300'>
                    <div id='p1' className='flex justify-between'>
                        <div>
                            <p className='pt-3 pl-3 font-sans text-sm text-ink'>Chapter 3 · Photo upload</p>
                        </div>
                        <div className='pr-4 '>
                            <p className=' relative bottom-3  text-sm rotate-4  bg-coral rounded-full text-white font-sans font-semibold py-1 px-2 text-[10px] sm:rotate-5 sm:py-1 sm:px-3 sm:text-[14px]'>Handwriting → Text</p>
                            <p className='font-sans text-sm text-ink'>Auto-converted</p>
                        </div>
                    </div>
                    <div id='p2' className='flex flex-col md:flex-row items-center gap-3 p-4'>

                        {/* LEFT — Handwritten (raw) */}
                        <div className='w-full flex-1 min-h-42.5 rounded-xl border border-line bg-[repeating-linear-gradient(#fff,#fff_27px,#EDEAF7_28px)] p-4 flex items-center'>
                            <p className='font-hand text-violet text-lg sm:text-2xl leading-snug -rotate-1'>
                                Newton's 2nd Law:<br />
                                F = m·a — force is<br />
                                proportional to mass<br />
                                and acceleration.
                            </p>
                        </div>

                        {/* ARROW */}
                        <div className='text-violet text-xl sm:text-2xl shrink-0 rotate-90 md:rotate-0'>
                            →
                        </div>

                        {/* RIGHT — Typed (clean) */}
                        <div className='w-full flex-1 min-h-42.5 rounded-xl bg-ink p-4 flex items-center overflow-hidden'>
                            <p className='font-sans text-paper text-xs sm:text-sm leading-relaxed animate-[sbFadeType_4.5s_ease-in-out_infinite]'>
                                Newton's Second Law:<br />
                                F = m × a<br /><br />
                                Force equals mass times<br />
                                acceleration.
                                <span className='inline-block w-1.5 h-3.25 bg-coral ml-1 align-middle animate-[sbBlink_0.9s_steps(1)_infinite]'></span>
                            </p>
                        </div>

                    </div>
                </div>
            </div>
        </main>
    )
}

export default Hero