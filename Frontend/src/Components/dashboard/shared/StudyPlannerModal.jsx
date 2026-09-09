import React, { useState } from 'react'
import api from '../../../api/axios'
import { X } from 'lucide-react'

const StudyPlannerModal = ({ onClose, onTaskAdded }) => {
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const [task, setTask] = useState({
        title: '',
        subject: '',
        note: '',
        date: '',
        month: ''
    })

    const handleChange = (e) => {
        const { name, value } = e.target
        let updatedTask = { ...task, [name]: value }

        // Auto-fill month tag when date is selected
        if (name === 'date' && value) {
            const selectedDate = new Date(value)
            if (!isNaN(selectedDate.getTime())) {
                const monthName = selectedDate.toLocaleString('default', { month: 'short' })
                updatedTask.month = monthName
            }
        }

        setTask(updatedTask)
        if (error) setError('')
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        const { title, subject, note, date, month } = task
        if (!title.trim() || !subject.trim() || !note.trim() || !date || !month.trim()) {
            setError('All fields (Title, Subject, Note, Date, Month Tag) are required.')
            return
        }

        setLoading(true)
        setError('')

        try {
            const res = await api.post('/api/task/create', task)
            if (res.data) {
                if (onTaskAdded) {
                    onTaskAdded(res.data.task)
                }
                onClose()
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Something went wrong while creating the task.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Dark background overlay */}
            <div 
                className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity" 
                onClick={onClose}
            ></div>

            {/* Modal box */}
            <div className="relative bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl border border-gray-100 z-10 transition-all">
                <div className="flex items-center justify-between mb-5 pb-3 border-b border-gray-100">
                    <div>
                        <h2 className="font-display text-xl font-bold text-ink">Add New Task</h2>
                        <p className="text-xs text-ink-soft mt-0.5">Schedule a study session or chapter revision.</p>
                    </div>
                    <button 
                        onClick={onClose}
                        type="button"
                        className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
                    >
                        <X size={18} />
                    </button>
                </div>

                {error && (
                    <div className="mb-4 p-3 bg-red-50 border border-red-200 text-coral text-xs rounded-xl flex items-center gap-2">
                        <span>{error}</span>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-xs font-semibold text-ink mb-1">Task Title *</label>
                        <input
                            type="text"
                            name="title"
                            value={task.title}
                            onChange={handleChange}
                            placeholder="e.g. Chapter 3 Revision - Thermodynamics"
                            className="w-full px-3.5 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet/20 focus:border-violet transition-all"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-ink mb-1">Subject *</label>
                        <input
                            type="text"
                            name="subject"
                            value={task.subject}
                            onChange={handleChange}
                            placeholder="e.g. Physics"
                            className="w-full px-3.5 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet/20 focus:border-violet transition-all"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-ink mb-1">Note / Details *</label>
                        <textarea
                            name="note"
                            rows={3}
                            value={task.note}
                            onChange={handleChange}
                            placeholder="e.g. Solve end of chapter questions and review formulas."
                            className="w-full px-3.5 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet/20 focus:border-violet transition-all resize-none"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-xs font-semibold text-ink mb-1">Target Date *</label>
                            <input
                                type="date"
                                name="date"
                                value={task.date}
                                onChange={handleChange}
                                className="w-full px-3.5 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet/20 focus:border-violet transition-all text-gray-700"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-ink mb-1">Month Tag *</label>
                            <input
                                type="text"
                                name="month"
                                value={task.month}
                                onChange={handleChange}
                                placeholder="e.g. Sep"
                                className="w-full px-3.5 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet/20 focus:border-violet transition-all"
                            />
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 pt-3 mt-4 border-t border-gray-100">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-xl transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-5 py-2 text-sm font-semibold text-white bg-violet hover:bg-violet/90 rounded-xl transition-colors shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                        >
                            {loading ? (
                                <>
                                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                                    Saving...
                                </>
                            ) : (
                                'Add Task'
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default StudyPlannerModal