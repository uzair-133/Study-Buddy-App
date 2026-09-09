import React, { useState, useEffect } from 'react'
import api from '../../../api/axios'
import StudyPlannerModal from '../../../Components/dashboard/shared/StudyPlannerModal'
import { CheckCircle2, Circle, Trash2, Calendar, BookOpen, Clock } from 'lucide-react'

const StudentStudyPlanner = () => {
    const [tasks, setTasks] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [isModalOpen, setIsModalOpen] = useState(false)

    const fetchTasks = async () => {
        setLoading(true)
        try {
            const res = await api.get('/api/task/get')
            setTasks(res.data.task || [])
            setError('')
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to fetch tasks')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchTasks()
    }, [])

    const handleToggleComplete = async (taskId) => {
        try {
            const res = await api.patch(`/api/task/update/${taskId}`)
            setTasks(prev => prev.map(t => t._id === taskId ? res.data.task : t))
        } catch (err) {
            console.error("Failed to update task", err)
        }
    }

    const handleDeleteTask = async (taskId) => {
        try {
            await api.delete(`/api/task/delete/${taskId}`)
            setTasks(prev => prev.filter(t => t._id !== taskId))
        } catch (err) {
            console.error("Failed to delete task", err)
        }
    }

    const completedCount = tasks.filter(t => t.isCompleted).length
    const upcomingCount = tasks.filter(t => !t.isCompleted).length
    const nearestTag = tasks.length > 0 ? (tasks[0].month || 'N/A') : 'None'

    return (
        <section className='p-6 md:p-10 max-w-7xl mx-auto font-sans'>
            <div className='space-y-4 md:flex md:justify-between md:space-y-0 md:items-center'>
                <div>
                    <h1 className='font-display text-2xl md:text-3xl font-bold text-ink'>Study Planner</h1>
                    <p className="font-sans text-sm text-ink-soft mt-1">Plan what to revise and when — stay ahead of your exams.</p>
                </div>
                <div>
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="px-4 py-2.5 text-sm rounded-xl bg-violet text-white font-sans font-semibold hover:bg-violet/90 transition-all shadow-sm flex items-center gap-2"
                    >
                        + Add Task
                    </button>
                </div>
            </div>

            {/* Metric Cards */}
            <div className='grid grid-cols-1 mt-6 sm:grid-cols-2 md:grid-cols-3 gap-4 md:mt-8'>
                <div className='bg-white rounded-2xl border border-gray-200 p-5 shadow-xs flex items-center justify-between'>
                    <div>
                        <p className="font-sans text-xs text-ink-soft uppercase tracking-wider font-semibold">Completed</p>
                        <p className="font-display font-bold text-2xl text-ink mt-1">{completedCount}</p>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center">
                        <CheckCircle2 size={20} />
                    </div>
                </div>

                <div className='bg-white rounded-2xl border border-gray-200 p-5 shadow-xs flex items-center justify-between'>
                    <div>
                        <p className="font-sans text-xs text-ink-soft uppercase tracking-wider font-semibold">Upcoming Tasks</p>
                        <p className="font-display font-bold text-2xl text-ink mt-1">{upcomingCount}</p>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center">
                        <Clock size={20} />
                    </div>
                </div>

                <div className='bg-white rounded-2xl border border-gray-200 p-5 shadow-xs flex items-center justify-between'>
                    <div>
                        <p className="font-sans text-xs text-ink-soft uppercase tracking-wider font-semibold">Nearest Month</p>
                        <p className="font-display font-bold text-2xl text-ink mt-1">{nearestTag}</p>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-violet/10 text-violet flex items-center justify-center">
                        <Calendar size={20} />
                    </div>
                </div>
            </div>

            {/* Task List Section */}
            <div className="mt-10">
                <h2 className="text-lg font-bold font-display text-ink mb-4">Your Study Schedule</h2>

                {loading && (
                    <div className="p-8 text-center bg-white rounded-2xl border border-gray-100 text-gray-500">
                        Loading study tasks...
                    </div>
                )}

                {error && (
                    <div className="p-4 bg-red-50 text-coral rounded-2xl border border-red-100 text-sm">
                        {error}
                    </div>
                )}

                {!loading && !error && tasks.length === 0 && (
                    <div className="p-10 text-center bg-white rounded-2xl border border-dashed border-gray-200">
                        <BookOpen size={40} className="mx-auto text-gray-300 mb-3" />
                        <p className="font-medium text-ink">No tasks planned yet</p>
                        <p className="text-sm text-ink-soft mt-1 mb-4">Click "+ Add Task" to schedule your upcoming revisions.</p>
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {tasks.map((t) => (
                        <div 
                            key={t._id} 
                            className={`p-5 rounded-2xl border transition-all bg-white shadow-xs ${
                                t.isCompleted ? 'border-gray-200 opacity-75' : 'border-gray-200 hover:border-violet/40'
                            }`}
                        >
                            <div className="flex items-start justify-between gap-3">
                                <div className="flex items-start gap-3 flex-1">
                                    <button 
                                        onClick={() => handleToggleComplete(t._id)}
                                        className="mt-0.5 text-gray-400 hover:text-violet transition-colors focus:outline-none"
                                    >
                                        {t.isCompleted ? (
                                            <CheckCircle2 className="text-emerald-500" size={20} />
                                        ) : (
                                            <Circle size={20} />
                                        )}
                                    </button>
                                    <div>
                                        <h3 className={`font-semibold text-base ${t.isCompleted ? 'line-through text-gray-400' : 'text-ink'}`}>
                                            {t.title}
                                        </h3>
                                        <p className="text-xs font-medium text-violet mt-0.5">{t.subject}</p>
                                        <p className="text-xs text-ink-soft mt-2">{t.note}</p>
                                    </div>
                                </div>
                                <button 
                                    onClick={() => handleDeleteTask(t._id)}
                                    className="p-1.5 text-gray-400 hover:text-coral hover:bg-red-50 rounded-lg transition-colors"
                                    title="Delete task"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>

                            <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-xs text-ink-soft">
                                <span className="flex items-center gap-1">
                                    <Calendar size={13} />
                                    {new Date(t.date).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' })}
                                </span>
                                <span className="px-2 py-0.5 rounded-md bg-gray-100 text-gray-600 font-medium">
                                    {t.month}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Modal */}
            {isModalOpen && (
                <StudyPlannerModal
                    onClose={() => setIsModalOpen(false)}
                    onTaskAdded={fetchTasks}
                />
            )}
        </section>
    )
}

export default StudentStudyPlanner