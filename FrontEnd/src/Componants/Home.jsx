/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { Trash2 } from 'lucide-react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Home() {
    const [expenses, setExpenses] = useState([]);
    const [form, setForm] = useState({ 
        amount: "", 
        description: "", 
        category: "" 
    });
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [user, setUser] = useState(null);

    const navigate = useNavigate();

    useEffect(() => {
        const userData = JSON.parse(sessionStorage.getItem('user'));
        setUser(userData);
        fetchExpenses();
    }, []);

    const fetchExpenses = async () => {
        try {
            setIsLoading(true);
            const token = sessionStorage.getItem('token');
            console.log("Token sent in request:", token);

            const { data } = await axios.get('http://localhost:3000/api/v1/user/getexpenses', {
                headers: { Authorization: `Bearer ${token}` }
            });

            setExpenses(data.data);
        } catch (error) {
            setError(error.response?.data?.message || 'Failed to fetch expenses');
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setIsLoading(true);
            const token = sessionStorage.getItem('token');
            if (editingId) {
                await axios.put(
                    `http://localhost:3000/api/v1/user/expenses/${editingId}`,
                    form,
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                toast.success('Update Expense successfully', {
                    position: 'top-right',
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                  }); 
            } else {
                await axios.post(
                    'http://localhost:3000/api/v1/user/addexpense',
                    form,
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                toast.success('Expense Added successfully', {
                    position: 'top-right',
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                  }); 
            }
            setForm({ amount: "", description: "", category: "" });
            setEditingId(null);
            fetchExpenses();
        } catch (error) {
            setError(error.response?.data?.message || 'Failed to save expense');
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async (id) => {
        try {
            setIsLoading(true);
            const token = sessionStorage.getItem('token');
            await axios.delete(
                `http://localhost:3000/api/v1/user/expenses/${id}`,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            toast.success('Delete Expense successfully', {
                position: 'top-right',
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
              });          
            fetchExpenses();
        } catch (error) {
            setError(error.response?.data?.message || 'Failed to delete expense');
        } finally {
            setIsLoading(false);
        }
    };

    const startEdit = (expense) => {
        setForm({
            amount: expense.amount,
            description: expense.description,
            category: expense.category
        });
        setEditingId(expense._id);
    };

    const logoutuser = () => {
        sessionStorage.removeItem('token');
        sessionStorage.removeItem('user');
        navigate('/');
        setUser(null);
    }

    const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);
    const averageExpense = expenses.length ? (totalExpenses / expenses.length).toFixed(2) : 0;
    const highestExpense = expenses.length ? Math.max(...expenses.map(exp => exp.amount)).toFixed(2) : 0;

    return (
        <div className="min-h-screen bg-gradient-to-r from-blue-50 via-gray-100 to-blue-50">
        
            <header className="flex flex-wrap justify-between items-center bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-4 shadow-lg">
                <h1 className="text-lg sm:text-xl lg:text-2xl font-bold flex items-center space-x-2">
                    <span role="img" aria-label="Logo">📘</span>
                    <span>Expense Tracker</span>
                </h1>
                <div className="flex items-center space-x-4 mt-2 sm:mt-0">
                    <span className="text-sm truncate">Welcome, {user?.username}</span>
                    <button onClick={logoutuser} className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 shadow text-sm sm:text-base">
                        Sign Out
                    </button>
                </div>
            </header>

            <ToastContainer />

            <div className="p-6 max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white shadow-lg rounded-xl p-6">
                    <h2 className="text-lg font-bold text-gray-700 mb-4">
                        {editingId ? 'Edit Expense' : 'Add New Expense'}
                    </h2>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <input
                            type="number"
                            placeholder="Amount ($)"
                            value={form.amount}
                            onChange={e => setForm({ ...form, amount: e.target.value })}
                            className="w-full border-2 rounded-lg p-2 focus:outline-blue-400 focus:ring"
                            required
                        />
                        <input
                            type="text"
                            placeholder="Description"
                            value={form.description}
                            onChange={e => setForm({ ...form, description: e.target.value })}
                            className="w-full border-2 rounded-lg p-2 focus:outline-blue-400 focus:ring"
                            required
                        />
                            <input
                            type="text"
                            value={form.category}
                            onChange={e => setForm({ ...form, category: e.target.value })}
                            placeholder="Category Name"
                            className="w-full border-2 rounded-lg p-2 focus:outline-blue-400 focus:ring"
                            required
                        />
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 shadow-lg text-sm sm:text-base"
                        >
                            {isLoading ? 'Processing...' : editingId ? 'Update Expense' : 'Add Expense'}
                        </button>
                    </form>
                </div>

                <div className="col-span-2 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div className="bg-white shadow-lg rounded-lg p-4 text-center">
                        <h3 className="text-gray-500">Total Expenses</h3>
                        <p className="text-3xl font-bold text-blue-600">${totalExpenses.toFixed(2)}</p>
                    </div>
                    <div className="bg-white shadow-lg rounded-lg p-4 text-center">
                        <h3 className="text-gray-500">Average Expense</h3>
                        <p className="text-3xl font-bold text-green-600">${averageExpense}</p>
                    </div>
                    <div className="bg-white shadow-lg rounded-lg p-4 text-center">
                        <h3 className="text-gray-500">Highest Expense</h3>
                        <p className="text-3xl font-bold text-red-600">${highestExpense}</p>
                    </div>
                </div>

                <div className="col-span-3 bg-white shadow-lg rounded-lg p-6">
                    <h2 className="text-lg font-bold mb-4 text-gray-700">Recent Expenses</h2>
                    {expenses.length > 0 ? (
                        expenses.map(expense => (
                            <div key={expense._id} className="flex justify-between items-center border-b py-3 hover:bg-gray-100">
                              <div className="flex flex-col">
                                <span className="bg-blue-100 text-blue-500 px-2 py-1 rounded-full text-sm font-semibold">
                                    {expense.category}
                                </span>
                                <span className="text-gray-600 mt-1">{expense.description}</span>
                                <span className="text-sm text-gray-500 mt-1">{expense.date}</span>
                              </div>
                                <div className="flex items-center space-x-4">
                                    <span className="font-bold text-blue-500">${expense.amount.toFixed(2)}</span>
                                    <button
                                        onClick={() => startEdit(expense)}
                                        className="text-blue-500 hover:text-blue-600"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => handleDelete(expense._id)}
                                        className="text-red-500 hover:text-red-600"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="text-gray-500">No expenses recorded yet.</p>
                    )}
                </div>

            </div>
        </div>
    );
}

export default Home;
