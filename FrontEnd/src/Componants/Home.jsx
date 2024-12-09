/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useCallback } from 'react';
import { Trash2, Edit, PlusCircle } from 'lucide-react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Home() {
    const [expenses, setExpenses] = useState([]);
    const [form, setForm] = useState({ 
        description: "", 
        title: "" 
    });
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [user, setUser] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    const navigate = useNavigate();

    const fetchstory = useCallback(async () => {
        try {
            setIsLoading(true);
            const token = sessionStorage.getItem('token');
            const { data } = await axios.get('http://localhost:3000/api/v1/user/getstory', {
                headers: { Authorization: `Bearer ${token}` }
            });

            setExpenses(data.data);
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to fetch story');
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        const userData = JSON.parse(sessionStorage.getItem('user'));
        setUser(userData);
        fetchstory();
    }, [fetchstory]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setIsLoading(true);
            const token = sessionStorage.getItem('token');
            if (editingId) {
                await axios.put(
                    `http://localhost:3000/api/v1/user/story/${editingId}`,
                    form,
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                toast.success('Story updated successfully');
            } else {
                await axios.post(
                    'http://localhost:3000/api/v1/user/addstory',
                    form,
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                toast.success('Story added successfully');
            }
            setForm({ description: "", title: "" });
            setEditingId(null);
            fetchstory();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to save story');
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async (id) => {
        try {
            setIsLoading(true);
            const token = sessionStorage.getItem('token');
            await axios.delete(
                `http://localhost:3000/api/v1/user/story/${id}`,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            toast.success('Story deleted successfully');
            fetchstory();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to delete story');
        } finally {
            setIsLoading(false);
        }
    };

    const startEdit = (story) => {
        setForm({
            description: story.description,
            title: story.title
        });
        setEditingId(story._id);
    };

    const logoutuser = () => {
        sessionStorage.removeItem('token');
        sessionStorage.removeItem('user');
        navigate('/');
        setUser(null);
    };

    const filteredStories = expenses.filter(story => 
        story.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        story.description.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-gradient-to-r from-indigo-100 via-blue-100 to-indigo-100 p-4">
            <motion.div 
                initial={{ opacity: 0, y: -50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="max-w-6xl mx-auto bg-white rounded-2xl shadow-2xl overflow-hidden"
            >
                <header className="flex justify-between items-center bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-4 shadow-xl">
                    <h1 className="text-2xl font-bold tracking-wide flex items-center">
                        📘 Story Sharing 
                    </h1>
                    <div className="flex items-center space-x-4">
                        <span className="text-sm font-medium">Welcome, {user?.username}</span>
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={logoutuser}
                            className="bg-red-500 px-4 py-2 rounded-lg hover:bg-red-600 transition text-sm font-semibold shadow-lg"
                        >
                            Sign Out
                        </motion.button>
                    </div>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6">
                    <div className="bg-white shadow-lg rounded-xl p-6">
                        <h2 className="text-xl font-bold text-gray-700 mb-4 flex items-center">
                            <PlusCircle className="mr-2 text-blue-500" />
                            {editingId ? 'Edit Story' : 'Add New Story'}
                        </h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <input
                                type="text"
                                value={form.title}
                                onChange={e => setForm({ ...form, title: e.target.value })}
                                placeholder="Title"
                                className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-blue-500 transition"
                                required
                            />
                            <textarea
                                placeholder="Description"
                                value={form.description}
                                onChange={e => setForm({ ...form, description: e.target.value })}
                                className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-blue-500 transition resize-none h-32"
                                required
                            />
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                type="submit"
                                disabled={isLoading}
                                className="w-full bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-600 transition shadow-lg"
                            >
                                {isLoading ? 'Processing...' : editingId ? 'Update Story' : 'Add Story'}
                            </motion.button>
                        </form>
                    </div>

                    <div className="col-span-2 bg-white shadow-lg rounded-xl p-6">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-bold text-gray-700">Your Stories</h2>
                            <input 
                                type="text"
                                placeholder="Search stories..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="border rounded-lg p-2 w-64 focus:ring-2 focus:ring-blue-500 transition"
                            />
                        </div>
                        
                        <AnimatePresence>
                            {filteredStories.length > 0 ? (
                                filteredStories.map((expense) => (
                                    <motion.div 
                                        key={expense._id} 
                                        initial={{ opacity: 0, x: -50 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: 50 }}
                                        className="flex justify-between items-center border-b py-4 hover:bg-gray-100 transition"
                                    >
                                        <div>
                                            <h3 className="text-lg font-semibold text-blue-600">{expense.title}</h3>
                                            <p className="text-gray-600 line-clamp-2">{expense.description}</p>
                                            <span className="text-sm text-gray-500">{expense.date}</span>
                                        </div>
                                        <div className="flex items-center space-x-4">
                                            <motion.button
                                                whileHover={{ scale: 1.1 }}
                                                onClick={() => startEdit(expense)}
                                                className="text-blue-500 hover:text-blue-600 transition flex items-center"
                                            >
                                                <Edit size={18} className="mr-1" /> Edit
                                            </motion.button>
                                            <motion.button
                                                whileHover={{ scale: 1.1 }}
                                                onClick={() => handleDelete(expense._id)}
                                                className="text-red-500 hover:text-red-600 transition flex items-center"
                                            >
                                                <Trash2 size={18} className="mr-1" /> Delete
                                            </motion.button>
                                        </div>
                                    </motion.div>
                                ))
                            ) : (
                                <motion.p 
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="text-gray-500 text-center py-6"
                                >
                                    {searchTerm ? 'No stories match your search' : 'No stories recorded yet.'}
                                </motion.p>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </motion.div>

            <ToastContainer />
        </div>
    );
}

export default Home;