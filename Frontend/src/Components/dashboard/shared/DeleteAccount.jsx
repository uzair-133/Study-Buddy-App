import { useState, useContext } from "react"
import api from "../../../api/axios"
import { useNavigate } from "react-router-dom"
import { UserContext } from "../../../Context/UserContext"

const DeleteAccount = () => {
    const navigate = useNavigate()
    const { user, setUser } = useContext(UserContext)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    
    const handleDeleteAccount = async () => {
        const userId = user?._id || user?.id;
        if (!userId) {
            setError("User ID missing. Unable to delete account.")
            return
        }

        if (!window.confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
            return
        }

        try {
            setLoading(true)
            setError('')
            const response = await api.delete(`/api/user/delete/${userId}`, {
                withCredentials: true,
            });
            console.log(response.data?.message);
            setUser(null)
            navigate("/login"); // Redirect after deletion
        } catch (err) {
            console.error("Error deleting account:", err.response?.data?.message || err.message);
            setError(err.response?.data?.message || "Failed to delete account.")
        } finally {
            setLoading(false)
        }
    }

    return (
        <section className='bg-white rounded-2xl p-5 sm:p-6 border border-gray-100 shadow-sm'>
            <div>
                <h2 className='text-ink font-semibold font-display text-lg'>Danger Zone</h2>
                <p className='text-ink-soft font-sans text-xs sm:text-sm mt-1'>Irreversible actions — proceed with caution.</p>
            </div>
            <hr className='my-4 border-gray-100' />
            <div className='flex flex-col sm:flex-row sm:items-center justify-between gap-4'>
                <div>
                    <h3 className='text-coral font-semibold font-display text-sm'>Delete Account</h3>
                    <p className='text-ink-soft font-sans text-xs mt-0.5'>Permanently remove your account and all your data.</p>
                </div>
               
                <div>
                    <button 
                        onClick={handleDeleteAccount} 
                        disabled={loading}
                        className='w-full sm:w-auto text-coral px-5 py-2.5 rounded-full font-semibold font-sans text-xs bg-coral/10 hover:bg-coral/20 disabled:opacity-50 transition-colors text-center'
                    >
                        {loading ? "Deleting..." : "Delete Account"}
                    </button>
                </div>
            </div>
            {error && <p className="text-red-500 font-sans text-xs mt-3 bg-red-50 p-2.5 rounded-xl border border-red-200">{error}</p>}
        </section>
    )
}

export default DeleteAccount