import { useState, useEffect } from 'react'
import axios from 'axios'
import { FiBox, FiShoppingCart, FiUsers, FiTrendingUp, FiCheckCircle, FiX, FiRefreshCw, FiLogOut, FiEye, FiEdit, FiTrash2, FiFilter, FiSearch, FiMenu } from 'react-icons/fi'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
    headers: {
        'Content-Type': 'application/json',
    },
})

export default function AdminDashboard() {
    const { user, api } = useAuth()
    const { addToast } = useToast()
    const navigate = useNavigate()

    const [activeTab, setActiveTab] = useState('orders')
    const [orders, setOrders] = useState([])
    const [stats, setStats] = useState(null)
    const [users, setUsers] = useState([])
    const [searchTerm, setSearchTerm] = useState('')
    const [statusFilter, setStatusFilter] = useState('All')
    const [loading, setLoading] = useState(true)
    const [selectedOrder, setSelectedOrder] = useState(null)

    // Fetch stats on load
    useEffect(() => {
        fetchStats()
    }, [])

    // Fetch orders on load
    useEffect(() => {
        fetchOrders()
    }, [statusFilter, searchTerm])

    // Fetch users on load
    useEffect(() => {
        if (activeTab === 'users') {
            fetchUsers()
        }
    }, [activeTab])

    const fetchStats = async () => {
        try {
            const response = await api.get('/admin/stats')
            setStats(response.data)
            setLoading(false)
        } catch (error) {
            console.error('Error fetching stats:', error)
            setLoading(false)
        }
    }

    const fetchOrders = async () => {
        setLoading(true)
        try {
            let url = '/admin/orders'
            const params = {}

            if (statusFilter && statusFilter !== 'All') {
                params.status = statusFilter
            }

            if (searchTerm) {
                // Note: Backend would need to implement search
                params.search = searchTerm
            }

            const response = await api.get(url, { params })
            setOrders(response.data)
            setLoading(false)
        } catch (error) {
            console.error('Error fetching orders:', error)
            setLoading(false)
        }
    }

    const fetchUsers = async () => {
        setLoading(true)
        try {
            const response = await api.get('/admin/users')
            setUsers(response.data)
            setLoading(false)
        } catch (error) {
            console.error('Error fetching users:', error)
            setLoading(false)
        }
    }

    const handleUpdateStatus = async (orderId, newStatus) => {
        try {
            await api.put(`/admin/orders/${orderId}/status`, { status: newStatus })
            addToast({ message: `Order updated to ${newStatus}` })
            fetchOrders()
        } catch (error) {
            console.error('Error updating status:', error)
            addToast({ message: 'Failed to update order status' })
        }
    }

    const handleCancelOrder = async (orderId) => {
        if (window.confirm('Are you sure you want to cancel this order?')) {
            try {
                await api.delete(`/admin/orders/${orderId}`)
                addToast({ message: 'Order cancelled successfully' })
                fetchOrders()
            } catch (error) {
                console.error('Error cancelling order:', error)
                addToast({ message: 'Failed to cancel order' })
            }
        }
    }

    const handleViewOrder = (order) => {
        setSelectedOrder(order)
    }

    const handleRefresh = () => {
        fetchOrders()
        fetchStats()
        addToast({ message: 'Data refreshed' })
    }

    const handleLogout = () => {
        if (window.confirm('Are you sure you want to logout?')) {
            localStorage.clear()
            window.location.href = '/'
        }
    }

    const getStatusColor = (status) => {
        const colors = {
            'Pending': 'bg-yellow-100 text-yellow-800',
            'Preparing': 'bg-blue-100 text-blue-800',
            'On Way': 'bg-purple-100 text-purple-800',
            'Delivered': 'bg-green-100 text-green-800',
            'Cancelled': 'bg-red-100 text-red-800',
        }
        return colors[status] || 'bg-gray-100 text-gray-800'
    }

    if (!user?.isAdmin) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-orange-50">
                <div className="text-center">
                    <div className="text-6xl mb-4">🔒</div>
                    <h1 className="text-2xl font-bold text-stone-800">Access Denied</h1>
                    <p className="text-stone-600">You don't have permission to access this page.</p>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-[#fafaf9]">
            {/* Header */}
            <div className="bg-white shadow-sm border-b border-orange-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <h1 className="text-2xl font-bold text-stone-800">Admin Dashboard</h1>
                        <div className="flex items-center gap-4">
                            <span className="text-sm text-stone-600">Welcome, {user?.name}</span>
                            <button
                                onClick={handleLogout}
                                className="flex items-center gap-2 px-4 py-2 rounded-lg border border-stone-200 text-stone-700 hover:bg-stone-50 transition-colors"
                            >
                                <FiLogOut size={18} />
                                Logout
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Tabs */}
                <div className="flex gap-2 mb-6 overflow-x-auto">
                    <button
                        onClick={() => setActiveTab('orders')}
                        className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all ${
                            activeTab === 'orders'
                                ? 'bg-orange-500 text-white shadow-lg'
                                : 'bg-white text-stone-700 border border-stone-200 hover:bg-stone-50'
                        }`}
                    >
                        <FiShoppingCart size={20} />
                        Orders
                    </button>
                    <button
                        onClick={() => setActiveTab('users')}
                        className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all ${
                            activeTab === 'users'
                                ? 'bg-orange-500 text-white shadow-lg'
                                : 'bg-white text-stone-700 border border-stone-200 hover:bg-stone-50'
                        }`}
                    >
                        <FiUsers size={20} />
                        Users
                    </button>
                    <button
                        onClick={() => setActiveTab('stats')}
                        className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all ${
                            activeTab === 'stats'
                                ? 'bg-orange-500 text-white shadow-lg'
                                : 'bg-white text-stone-700 border border-stone-200 hover:bg-stone-50'
                        }`}
                    >
                        <FiTrendingUp size={20} />
                        Statistics
                    </button>
                </div>

                {/* Orders Tab */}
                {activeTab === 'orders' && (
                    <div className="space-y-6">
                        {/* Filters */}
                        <div className="bg-white rounded-xl p-4 shadow-sm border border-orange-100">
                            <div className="flex flex-wrap gap-4 mb-4">
                                {/* Search */}
                                <div className="relative flex-1 min-w-[200px]">
                                    <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" size={18} />
                                    <input
                                        type="text"
                                        placeholder="Search orders..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="w-full pl-10 pr-4 py-2 rounded-lg border border-stone-200 focus:outline-none focus:ring-2 focus:ring-orange-400"
                                    />
                                </div>

                                {/* Status Filter */}
                                <select
                                    value={statusFilter}
                                    onChange={(e) => setStatusFilter(e.target.value)}
                                    className="px-4 py-2 rounded-lg border border-stone-200 focus:outline-none focus:ring-2 focus:ring-orange-400 bg-white"
                                >
                                    <option value="All">All Orders</option>
                                    <option value="Pending">Pending</option>
                                    <option value="Preparing">Preparing</option>
                                    <option value="On Way">On Way</option>
                                    <option value="Delivered">Delivered</option>
                                    <option value="Cancelled">Cancelled</option>
                                </select>

                                {/* Refresh Button */}
                                <button
                                    onClick={handleRefresh}
                                    className="flex items-center gap-2 px-4 py-2 rounded-lg border border-stone-200 hover:bg-stone-50 transition-colors"
                                >
                                    <FiRefreshCw size={18} />
                                </button>
                            </div>
                        </div>

                        {/* Orders Table */}
                        <div className="bg-white rounded-xl shadow-sm border border-orange-100 overflow-hidden">
                            {loading ? (
                                <div className="flex items-center justify-center py-12">
                                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
                                </div>
                            ) : orders.length === 0 ? (
                                <div className="text-center py-12">
                                    <div className="text-6xl mb-4">📦</div>
                                    <p className="text-stone-600">No orders found</p>
                                </div>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead className="bg-stone-50 border-b border-stone-200">
                                            <tr>
                                                <th className="px-6 py-3 text-left text-xs font-bold text-stone-600 uppercase tracking-wider">Order ID</th>
                                                <th className="px-6 py-3 text-left text-xs font-bold text-stone-600 uppercase tracking-wider">Customer</th>
                                                <th className="px-6 py-3 text-left text-xs font-bold text-stone-600 uppercase tracking-wider">Status</th>
                                                <th className="px-6 py-3 text-left text-xs font-bold text-stone-600 uppercase tracking-wider">Total</th>
                                                <th className="px-6 py-3 text-left text-xs font-bold text-stone-600 uppercase tracking-wider">Date</th>
                                                <th className="px-6 py-3 text-left text-xs font-bold text-stone-600 uppercase tracking-wider">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {orders.map((order) => (
                                                <tr key={order._id} className="border-b border-stone-200 hover:bg-orange-50/50 transition-colors">
                                                    <td className="px-6 py-4 text-sm font-medium text-stone-900">{order._id.slice(-8)}</td>
                                                    <td className="px-6 py-4 text-sm">
                                                        <div className="text-stone-700">{order.name}</div>
                                                        <div className="text-xs text-stone-500">{order.phone}</div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(order.status)}`}>
                                                            {order.status}
                                                        </span>
                                                    </td>
                                                     <td className="px-6 py-4 text-sm font-semibold text-stone-900">৳{order.totalPrice || 0}</td>
                                                    <td className="px-6 py-4 text-sm text-stone-600">
                                                        {new Date(order.createdAt).toLocaleDateString()}
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <div className="flex gap-2">
                                                            <button
                                                                onClick={() => handleViewOrder(order)}
                                                                className="p-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition-colors"
                                                            >
                                                                <FiEye size={16} />
                                                            </button>
                                                            {order.status === 'Pending' && (
                                                                <button
                                                                    onClick={() => handleUpdateStatus(order._id, 'Preparing')}
                                                                    className="p-2 rounded-lg bg-yellow-500 text-white hover:bg-yellow-600 transition-colors"
                                                                    title="Mark as Preparing"
                                                                >
                                                                    <FiCheckCircle size={16} />
                                                                </button>
                                                            )}
                                                            {(order.status === 'Preparing' || order.status === 'On Way') && (
                                                                <button
                                                                    onClick={() => handleUpdateStatus(order._id, 'Delivered')}
                                                                    className="p-2 rounded-lg bg-green-500 text-white hover:bg-green-600 transition-colors"
                                                                    title="Mark as Delivered"
                                                                >
                                                                    <FiCheckCircle size={16} />
                                                                </button>
                                                            )}
                                                            {!order.isDelivered && (
                                                                <button
                                                                    onClick={() => handleCancelOrder(order._id)}
                                                                    className="p-2 rounded-lg bg-red-500 text-white hover:bg-red-600 transition-colors"
                                                                    title="Cancel Order"
                                                                >
                                                                    <FiX size={16} />
                                                                </button>
                                                            )}
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Stats Tab */}
                {activeTab === 'stats' && stats && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {/* Total Orders */}
                        <div className="bg-white rounded-xl p-6 shadow-sm border border-orange-100">
                            <div className="flex items-center gap-4 mb-2">
                                <div className="p-3 rounded-lg bg-orange-100 text-orange-600">
                                    <FiBox size={32} />
                                </div>
                                <div>
                                    <p className="text-3xl font-bold text-stone-800">{stats.totalOrders}</p>
                                    <p className="text-sm text-stone-600">Total Orders</p>
                                </div>
                            </div>
                        </div>

                        {/* Revenue */}
                        <div className="bg-white rounded-xl p-6 shadow-sm border border-orange-100">
                            <div className="flex items-center gap-4 mb-2">
                                <div className="p-3 rounded-lg bg-green-100 text-green-600">
                                    <FiTrendingUp size={32} />
                                </div>
                                <div>
                                    <p className="text-3xl font-bold text-stone-800">৳{stats.totalRevenue?.toLocaleString()}</p>
                                    <p className="text-sm text-stone-600">Total Revenue</p>
                                </div>
                            </div>
                        </div>

                        {/* Pending */}
                        <div className="bg-white rounded-xl p-6 shadow-sm border border-orange-100">
                            <div className="flex items-center gap-4 mb-2">
                                <div className="p-3 rounded-lg bg-yellow-100 text-yellow-700">
                                    <FiShoppingCart size={32} />
                                </div>
                                <div>
                                    <p className="text-3xl font-bold text-stone-800">{stats.pendingOrders}</p>
                                    <p className="text-sm text-stone-600">Pending Orders</p>
                                </div>
                            </div>
                        </div>

                        {/* Delivered */}
                        <div className="bg-white rounded-xl p-6 shadow-sm border border-orange-100">
                            <div className="flex items-center gap-4 mb-2">
                                <div className="p-3 rounded-lg bg-blue-100 text-blue-600">
                                    <FiCheckCircle size={32} />
                                </div>
                                <div>
                                    <p className="text-3xl font-bold text-stone-800">{stats.deliveredOrders}</p>
                                    <p className="text-sm text-stone-600">Delivered Orders</p>
                                </div>
                            </div>
                        </div>

                        {/* Customers */}
                        <div className="bg-white rounded-xl p-6 shadow-sm border border-orange-100">
                            <div className="flex items-center gap-4 mb-2">
                                <div className="p-3 rounded-lg bg-purple-100 text-purple-600">
                                    <FiUsers size={32} />
                                </div>
                                <div>
                                    <p className="text-3xl font-bold text-stone-800">{stats.customers}</p>
                                    <p className="text-sm text-stone-600">Total Customers</p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Users Tab */}
                {activeTab === 'users' && (
                    <div className="bg-white rounded-xl p-6 shadow-sm border border-orange-100 overflow-hidden">
                        {loading ? (
                            <div className="flex items-center justify-center py-12">
                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
                            </div>
                        ) : users.length === 0 ? (
                            <div className="text-center py-12">
                                <div className="text-6xl mb-4">👥</div>
                                <p className="text-stone-600">No users found</p>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-stone-50 border-b border-stone-200">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-bold text-stone-600 uppercase tracking-wider">User</th>
                                            <th className="px-6 py-3 text-left text-xs font-bold text-stone-600 uppercase tracking-wider">Email</th>
                                            <th className="px-6 py-3 text-left text-xs font-bold text-stone-600 uppercase tracking-wider">Role</th>
                                            <th className="px-6 py-3 text-left text-xs font-bold text-stone-600 uppercase tracking-wider">Joined</th>
                                            <th className="px-6 py-3 text-left text-xs font-bold text-stone-600 uppercase tracking-wider">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {users.map((user) => (
                                            <tr key={user._id} className="border-b border-stone-200 hover:bg-orange-50/50">
                                                <td className="px-6 py-4 text-sm font-medium text-stone-900">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 rounded-full bg-orange-500 text-white flex items-center justify-center font-bold text-sm">
                                                            {user.name?.charAt(0) || 'U'}
                                                        </div>
                                                        {user.name}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-sm text-stone-600">{user.email}</td>
                                                <td className="px-6 py-4">
                                                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${user.isAdmin ? 'bg-purple-100 text-purple-800' : 'bg-stone-100 text-stone-800'}`}>
                                                        {user.isAdmin ? 'Admin' : 'User'}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-sm text-stone-600">
                                                    {new Date(user.createdAt).toLocaleDateString()}
                                                </td>
                                                <td className="px-6 py-4">
                                                    {user.isAdmin ? (
                                                        <span className="text-xs text-stone-500 italic">Cannot edit</span>
                                                    ) : (
                                                        <button className="p-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition-colors">
                                                            <FiEdit size={16} />
                                                        </button>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Order Details Modal */}
            {selectedOrder && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto mx-4">
                        <div className="flex justify-between items-center p-6 border-b border-stone-200">
                            <h2 className="text-xl font-bold text-stone-800">Order Details</h2>
                            <button
                                onClick={() => setSelectedOrder(null)}
                                className="p-2 rounded-lg hover:bg-stone-100 transition-colors"
                            >
                                <FiX size={24} />
                            </button>
                        </div>

                        <div className="p-6 space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-sm text-stone-600 font-medium">Order ID</p>
                                    <p className="text-lg font-bold text-stone-900">{selectedOrder._id}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-stone-600 font-medium">Status</p>
                                    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(selectedOrder.status)}`}>
                                        {selectedOrder.status}
                                    </span>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-sm text-stone-600 font-medium">Customer Name</p>
                                    <p className="text-lg font-bold text-stone-900">{selectedOrder.name}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-stone-600 font-medium">Phone</p>
                                    <p className="text-lg font-bold text-stone-900">{selectedOrder.phone}</p>
                                </div>
                            </div>

                            <div>
                                <p className="text-sm text-stone-600 font-medium">Address</p>
                                <p className="text-lg font-bold text-stone-900">{selectedOrder.address}</p>
                            </div>

                            <div>
                                <p className="text-sm text-stone-600 font-medium">Order Note</p>
                                <p className="text-lg font-bold text-stone-900">{selectedOrder.note || 'No note'}</p>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-sm text-stone-600 font-medium">Order Items</p>
                                </div>
                                <div>
                                    <p className="text-sm text-stone-600 font-medium">Total</p>
                                    <p className="text-lg font-bold text-stone-900">৳{selectedOrder.grandTotal}</p>
                                </div>
                            </div>

                            <div className="bg-stone-50 rounded-lg p-4">
                                <h3 className="text-sm font-bold text-stone-800 mb-2">Order Items</h3>
                                {selectedOrder.items?.map((item, index) => (
                                    <div key={index} className="flex justify-between items-center py-2 border-b border-stone-200 last:border-0">
                                        <div className="flex items-center gap-3">
                                            <span className="text-stone-700 font-medium">{item.name}</span>
                                            <span className="text-stone-500">x {item.qty}</span>
                                        </div>
                                        <p className="font-semibold text-stone-900">৳{item.price * item.qty}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="border-t border-stone-200 p-6 bg-stone-50">
                            <div className="flex justify-end gap-3">
                                <button
                                    onClick={() => setSelectedOrder(null)}
                                    className="px-6 py-3 rounded-lg border border-stone-200 text-stone-700 hover:bg-stone-50 transition-colors"
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
