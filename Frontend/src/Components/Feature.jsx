import React from 'react'
import FeatureCard from './FeatureCard'
import { BookOpen, Zap, FilePenLine, CircleQuestionMark } from 'lucide-react'
import { Translate } from '@boxicons/react'
const Feature = () => {
    const Cardarr = [
        {
            icon: BookOpen,
            iconColor: 'text-violet',
            bgColor: 'bg-[#E7E1FA]',
            heading: "Subject & chapter folders",
            para: "Lectures, slides, activities and coursework, filed exactly where you'd look for them."
        },
        {
            icon: Zap,
            iconColor: 'text-coral',
            bgColor: 'bg-[#FFE4DC]',
            heading: "Smart exam prep",
            para: "Pick your chapters — get every related note, slide and question pulled into one view."
        },
        {
            icon: FilePenLine,
            iconColor: 'text-mint',
            bgColor: 'bg-[#DCF3E9]',
            heading: "Handwriting to text",
            para: "Snap a photo of handwritten notes and StudyBuddy converts it to searchable text."
        },
        {
            icon: CircleQuestionMark,
            iconColor: 'text-violet',
            bgColor: 'bg-[#E7E1FA]',
            heading: "Important questions",
            para: "Keep the questions that actually show up on papers, attached to the right chapter."
        }

]   
    return (
        <>
            <main id='features' className='w-[90%] mx-auto pt-10  sm:max-w-150 md:max-w-195 lg:max-w-280 '>
                <section>
                    <h1 className='text-2xl font-semibold font-sans md:text-3xl '>Built around how you actually study</h1>
                    <p className='text-ink-soft'>Four pieces that work together — from the first day of class to the night before the exam.</p>
                </section>
                <section className='grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-8 '>
                    {
                        Cardarr.map((e, index) => {
                            return <FeatureCard key={index} {...e} />
                        })
                    }
                </section>
            </main>


        </>
    )
}

export default Feature