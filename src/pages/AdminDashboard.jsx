import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { FiBox, FiShoppingCart, FiUsers, FiTrendingUp, FiCheckCircle, FiX, FiRefreshCw, FiLogOut, FiEye, FiEdit, FiTrash2, FiSearch, FiPlus, FiPackage, FiUploadCloud, FiImage } from 'react-icons/fi'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'

const PRODUCT_CATEGORIES = ['Rice', 'Chicken', 'Beef', 'Snacks', 'Desserts']
const PRODUCT_TAGS = ['', 'Bestseller', 'Special', 'Chef Pick']

const emptyProductForm = {
    name: '',
    category: 'Rice',
    price: '',
    image: '',
    description: '',
    rating: 0,
    reviews: 0,
    tag: '',
    isAvailable: true,
}

export default function AdminDashboard() {
    const { user, api, logout } = useAuth()
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

    // Products state
    const [products, setProducts] = useState([])
    const [productForm, setProductForm] = useState({ ...emptyProductForm })
    const [editingProduct, setEditingProduct] = useState(null)
    const [showProductModal, setShowProductModal] = useState(false)
    const [productLoading, setProductLoading] = useState(false)
    const [imageFile, setImageFile] = useState(null)
    const [imagePreview, setImagePreview] = useState(null)
    const [uploadingImage, setUploadingImage] = useState(false)

    // Fetch stats on load
    useEffect(() => {
        fetchStats()
    }, [])

    // Fetch orders on load
    useEffect(() => {
        fetchOrders()
    }, [statusFilter, searchTerm])

    // Fetch users on tab switch
    useEffect(() => {
        if (activeTab === 'users') {
            fetchUsers()
        }
    }, [activeTab])

    // Fetch products on tab switch
    useEffect(() => {
        if (activeTab === 'products') {
            fetchProducts()
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

    const fetchProducts = async () => {
        setProductLoading(true)
        try {
            const response = await api.get('/admin/products')
            setProducts(response.data)
        } catch (error) {
            console.error('Error fetching products:', error)
        } finally {
            setProductLoading(false)
        }
    }

    const handleUpdateStatus = async (orderId, newStatus) => {
        try {
            await api.put(`/admin/orders/${orderId}/status`, { status: newStatus })
            addToast({ message: `Order updated to ${newStatus}` })
            fetchOrders()
            fetchStats()
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
                fetchStats()
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
        if (activeTab === 'products') fetchProducts()
        if (activeTab === 'users') fetchUsers()
        addToast({ message: 'Data refreshed' })
    }

    const handleLogout = () => {
        if (window.confirm('Are you sure you want to logout?')) {
            logout()
            navigate('/')
        }
    }

    // ── User management ──
    const handleToggleAdmin = async (userId) => {
        try {
            const response = await api.put(`/admin/users/${userId}/toggle-admin`)
            addToast({ message: `User role updated: ${response.data.isAdmin ? 'Admin' : 'User'}` })
            fetchUsers()
        } catch (error) {
            console.error('Error toggling admin:', error)
            addToast({ message: error.response?.data?.message || 'Failed to update user role' })
        }
    }

    const handleDeleteUser = async (userId, userName) => {
        if (window.confirm(`Are you sure you want to delete user "${userName}"?`)) {
            try {
                await api.delete(`/admin/users/${userId}`)
                addToast({ message: 'User deleted successfully' })
                fetchUsers()
            } catch (error) {
                console.error('Error deleting user:', error)
                addToast({ message: error.response?.data?.message || 'Failed to delete user' })
            }
        }
    }

    // ── Product management ──
    const openAddProduct = () => {
        setEditingProduct(null)
        setProductForm({ ...emptyProductForm })
        setImageFile(null)
        setImagePreview(null)
        setShowProductModal(true)
    }

    const openEditProduct = (product) => {
        setEditingProduct(product)
        setProductForm({
            name: product.name,
            category: product.category,
            price: product.price,
            image: product.image,
            description: product.description,
            rating: product.rating || 0,
            reviews: product.reviews || 0,
            tag: product.tag || '',
            isAvailable: product.isAvailable,
        })
        setImageFile(null)
        setImagePreview(product.image || null)
        setShowProductModal(true)
    }

    const handleProductFormChange = (e) => {
        const { name, value, type, checked } = e.target
        setProductForm(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }))
    }

    const handleImageFileChange = (e) => {
        const file = e.target.files[0]
        if (file) {
            if (file.size > 5 * 1024 * 1024) {
                addToast({ message: 'Image must be under 5MB' })
                return
            }
            setImageFile(file)
            setImagePreview(URL.createObjectURL(file))
        }
    }

    const uploadImage = async () => {
        if (!imageFile) return productForm.image

        setUploadingImage(true)
        try {
            const formData = new FormData()
            formData.append('image', imageFile)

            const response = await api.post('/upload', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            })
            return response.data.url
        } catch (error) {
            console.error('Image upload error:', error)
            throw new Error('Failed to upload image')
        } finally {
            setUploadingImage(false)
        }
    }

    const handleSaveProduct = async (e) => {
        e.preventDefault()
        try {
            // Upload image first if a new file was selected
            let imageUrl = productForm.image
            if (imageFile) {
                imageUrl = await uploadImage()
            }

            if (!imageUrl) {
                addToast({ message: 'Please upload a product image' })
                return
            }

            const payload = {
                ...productForm,
                image: imageUrl,
                price: Number(productForm.price),
                rating: Number(productForm.rating),
                reviews: Number(productForm.reviews),
            }

            if (editingProduct) {
                await api.put(`/admin/products/${editingProduct._id}`, payload)
                addToast({ message: 'Product updated successfully' })
            } else {
                await api.post('/admin/products', payload)
                addToast({ message: 'Product created successfully' })
            }

            setShowProductModal(false)
            setEditingProduct(null)
            setProductForm({ ...emptyProductForm })
            setImageFile(null)
            setImagePreview(null)
            fetchProducts()
            fetchStats()
        } catch (error) {
            console.error('Error saving product:', error)
            addToast({ message: error.response?.data?.message || 'Failed to save product' })
        }
    }

    const handleDeleteProduct = async (productId, productName) => {
        if (window.confirm(`Are you sure you want to delete "${productName}"?`)) {
            try {
                await api.delete(`/admin/products/${productId}`)
                addToast({ message: 'Product deleted successfully' })
                fetchProducts()
                fetchStats()
            } catch (error) {
                console.error('Error deleting product:', error)
                addToast({ message: 'Failed to delete product' })
            }
        }
    }

    const handleToggleAvailability = async (product) => {
        try {
            await api.put(`/admin/products/${product._id}`, { isAvailable: !product.isAvailable })
            addToast({ message: `${product.name} is now ${!product.isAvailable ? 'available' : 'unavailable'}` })
            fetchProducts()
        } catch (error) {
            console.error('Error toggling availability:', error)
            addToast({ message: 'Failed to update product' })
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
        <div className="min-h-screen bg-[#fafaf9] pt-16">
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
                    {[
                        { key: 'orders', label: 'Orders', icon: FiShoppingCart },
                        { key: 'products', label: 'Products', icon: FiPackage },
                        { key: 'users', label: 'Users', icon: FiUsers },
                        { key: 'stats', label: 'Statistics', icon: FiTrendingUp },
                    ].map(tab => (
                        <button
                            key={tab.key}
                            onClick={() => setActiveTab(tab.key)}
                            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all whitespace-nowrap ${
                                activeTab === tab.key
                                    ? 'bg-orange-500 text-white shadow-lg'
                                    : 'bg-white text-stone-700 border border-stone-200 hover:bg-stone-50'
                            }`}
                        >
                            <tab.icon size={20} />
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* ════════════════════════════════════════════════════════════
                    ORDERS TAB
                ════════════════════════════════════════════════════════════ */}
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
                                        placeholder="Search by customer name or phone..."
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
                                                        <div className="text-stone-700">{order.deliveryDetails?.fullName || 'N/A'}</div>
                                                        <div className="text-xs text-stone-500">{order.deliveryDetails?.phone || ''}</div>
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
                                                                title="View Details"
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
                                                            {order.status === 'Preparing' && (
                                                                <button
                                                                    onClick={() => handleUpdateStatus(order._id, 'On Way')}
                                                                    className="p-2 rounded-lg bg-purple-500 text-white hover:bg-purple-600 transition-colors"
                                                                    title="Mark as On Way"
                                                                >
                                                                    <FiCheckCircle size={16} />
                                                                </button>
                                                            )}
                                                            {order.status === 'On Way' && (
                                                                <button
                                                                    onClick={() => handleUpdateStatus(order._id, 'Delivered')}
                                                                    className="p-2 rounded-lg bg-green-500 text-white hover:bg-green-600 transition-colors"
                                                                    title="Mark as Delivered"
                                                                >
                                                                    <FiCheckCircle size={16} />
                                                                </button>
                                                            )}
                                                            {order.status !== 'Delivered' && order.status !== 'Cancelled' && (
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

                {/* ════════════════════════════════════════════════════════════
                    PRODUCTS TAB
                ════════════════════════════════════════════════════════════ */}
                {activeTab === 'products' && (
                    <div className="space-y-6">
                        {/* Header with Add button */}
                        <div className="bg-white rounded-xl p-4 shadow-sm border border-orange-100 flex items-center justify-between">
                            <h2 className="text-lg font-bold text-stone-800">Manage Products</h2>
                            <button
                                onClick={openAddProduct}
                                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-orange-500 text-white font-medium hover:bg-orange-600 transition-colors shadow-md"
                            >
                                <FiPlus size={18} />
                                Add Product
                            </button>
                        </div>

                        {/* Products Table */}
                        <div className="bg-white rounded-xl shadow-sm border border-orange-100 overflow-hidden">
                            {productLoading ? (
                                <div className="flex items-center justify-center py-12">
                                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
                                </div>
                            ) : products.length === 0 ? (
                                <div className="text-center py-12">
                                    <div className="text-6xl mb-4">🍽️</div>
                                    <p className="text-stone-600">No products yet</p>
                                    <button
                                        onClick={openAddProduct}
                                        className="mt-4 px-5 py-2 rounded-full bg-orange-500 text-white text-sm font-semibold hover:bg-orange-600 transition-colors"
                                    >
                                        Add your first product
                                    </button>
                                </div>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead className="bg-stone-50 border-b border-stone-200">
                                            <tr>
                                                <th className="px-6 py-3 text-left text-xs font-bold text-stone-600 uppercase tracking-wider">Product</th>
                                                <th className="px-6 py-3 text-left text-xs font-bold text-stone-600 uppercase tracking-wider">Category</th>
                                                <th className="px-6 py-3 text-left text-xs font-bold text-stone-600 uppercase tracking-wider">Price</th>
                                                <th className="px-6 py-3 text-left text-xs font-bold text-stone-600 uppercase tracking-wider">Tag</th>
                                                <th className="px-6 py-3 text-left text-xs font-bold text-stone-600 uppercase tracking-wider">Status</th>
                                                <th className="px-6 py-3 text-left text-xs font-bold text-stone-600 uppercase tracking-wider">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {products.map((product) => (
                                                <tr key={product._id} className="border-b border-stone-200 hover:bg-orange-50/50 transition-colors">
                                                    <td className="px-6 py-4 text-sm">
                                                        <div className="flex items-center gap-3">
                                                            <img
                                                                src={product.image}
                                                                alt={product.name}
                                                                className="w-10 h-10 rounded-lg object-cover bg-orange-50"
                                                            />
                                                            <div>
                                                                <div className="font-medium text-stone-900">{product.name}</div>
                                                                <div className="text-xs text-stone-500 line-clamp-1 max-w-[200px]">{product.description}</div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 text-sm text-stone-700">{product.category}</td>
                                                    <td className="px-6 py-4 text-sm font-semibold text-stone-900">৳{product.price}</td>
                                                    <td className="px-6 py-4">
                                                        {product.tag ? (
                                                            <span className="px-2 py-1 rounded-full text-xs font-semibold bg-orange-100 text-orange-700">
                                                                {product.tag}
                                                            </span>
                                                        ) : (
                                                            <span className="text-xs text-stone-400">None</span>
                                                        )}
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <button
                                                            onClick={() => handleToggleAvailability(product)}
                                                            className={`px-3 py-1 rounded-full text-xs font-semibold transition-colors ${
                                                                product.isAvailable
                                                                    ? 'bg-green-100 text-green-800 hover:bg-green-200'
                                                                    : 'bg-red-100 text-red-800 hover:bg-red-200'
                                                            }`}
                                                        >
                                                            {product.isAvailable ? 'Available' : 'Unavailable'}
                                                        </button>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <div className="flex gap-2">
                                                            <button
                                                                onClick={() => openEditProduct(product)}
                                                                className="p-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition-colors"
                                                                title="Edit Product"
                                                            >
                                                                <FiEdit size={16} />
                                                            </button>
                                                            <button
                                                                onClick={() => handleDeleteProduct(product._id, product.name)}
                                                                className="p-2 rounded-lg bg-red-500 text-white hover:bg-red-600 transition-colors"
                                                                title="Delete Product"
                                                            >
                                                                <FiTrash2 size={16} />
                                                            </button>
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

                {/* ════════════════════════════════════════════════════════════
                    STATS TAB
                ════════════════════════════════════════════════════════════ */}
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

                        {/* Total Products */}
                        <div className="bg-white rounded-xl p-6 shadow-sm border border-orange-100">
                            <div className="flex items-center gap-4 mb-2">
                                <div className="p-3 rounded-lg bg-amber-100 text-amber-600">
                                    <FiPackage size={32} />
                                </div>
                                <div>
                                    <p className="text-3xl font-bold text-stone-800">{stats.totalProducts}</p>
                                    <p className="text-sm text-stone-600">Total Products</p>
                                </div>
                            </div>
                        </div>

                        {/* Available Products */}
                        <div className="bg-white rounded-xl p-6 shadow-sm border border-orange-100">
                            <div className="flex items-center gap-4 mb-2">
                                <div className="p-3 rounded-lg bg-teal-100 text-teal-600">
                                    <FiCheckCircle size={32} />
                                </div>
                                <div>
                                    <p className="text-3xl font-bold text-stone-800">{stats.availableProducts}</p>
                                    <p className="text-sm text-stone-600">Available Products</p>
                                </div>
                            </div>
                        </div>

                        {/* Cancelled Orders */}
                        <div className="bg-white rounded-xl p-6 shadow-sm border border-orange-100">
                            <div className="flex items-center gap-4 mb-2">
                                <div className="p-3 rounded-lg bg-red-100 text-red-600">
                                    <FiX size={32} />
                                </div>
                                <div>
                                    <p className="text-3xl font-bold text-stone-800">{stats.cancelledOrders}</p>
                                    <p className="text-sm text-stone-600">Cancelled Orders</p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* ════════════════════════════════════════════════════════════
                    USERS TAB
                ════════════════════════════════════════════════════════════ */}
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
                                        {users.map((u) => (
                                            <tr key={u._id} className="border-b border-stone-200 hover:bg-orange-50/50">
                                                <td className="px-6 py-4 text-sm font-medium text-stone-900">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 rounded-full bg-orange-500 text-white flex items-center justify-center font-bold text-sm">
                                                            {u.name?.charAt(0) || 'U'}
                                                        </div>
                                                        {u.name}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-sm text-stone-600">{u.email}</td>
                                                <td className="px-6 py-4">
                                                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${u.isAdmin ? 'bg-purple-100 text-purple-800' : 'bg-stone-100 text-stone-800'}`}>
                                                        {u.isAdmin ? 'Admin' : 'User'}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-sm text-stone-600">
                                                    {new Date(u.createdAt).toLocaleDateString()}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex gap-2">
                                                        <button
                                                            onClick={() => handleToggleAdmin(u._id)}
                                                            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                                                                u.isAdmin
                                                                    ? 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                                                                    : 'bg-purple-100 text-purple-700 hover:bg-purple-200'
                                                            }`}
                                                            title={u.isAdmin ? 'Demote to User' : 'Promote to Admin'}
                                                        >
                                                            {u.isAdmin ? 'Remove Admin' : 'Make Admin'}
                                                        </button>
                                                        {!u.isAdmin && (
                                                            <button
                                                                onClick={() => handleDeleteUser(u._id, u.name)}
                                                                className="p-2 rounded-lg bg-red-500 text-white hover:bg-red-600 transition-colors"
                                                                title="Delete User"
                                                            >
                                                                <FiTrash2 size={14} />
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
                )}
            </div>

            {/* ════════════════════════════════════════════════════════════
                ORDER DETAILS MODAL
            ════════════════════════════════════════════════════════════ */}
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
                                    <p className="text-lg font-bold text-stone-900">{selectedOrder.deliveryDetails?.fullName || 'N/A'}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-stone-600 font-medium">Phone</p>
                                    <p className="text-lg font-bold text-stone-900">{selectedOrder.deliveryDetails?.phone || 'N/A'}</p>
                                </div>
                            </div>

                            <div>
                                <p className="text-sm text-stone-600 font-medium">Address</p>
                                <p className="text-lg font-bold text-stone-900">{selectedOrder.deliveryDetails?.address || 'N/A'}</p>
                            </div>

                            <div>
                                <p className="text-sm text-stone-600 font-medium">Order Note</p>
                                <p className="text-lg font-bold text-stone-900">{selectedOrder.deliveryDetails?.orderNote || 'No note'}</p>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-sm text-stone-600 font-medium">Payment Method</p>
                                    <p className="text-lg font-bold text-stone-900">{selectedOrder.paymentMethod || 'N/A'}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-stone-600 font-medium">Total</p>
                                    <p className="text-lg font-bold text-stone-900">৳{selectedOrder.totalPrice}</p>
                                </div>
                            </div>

                            {/* Price breakdown */}
                            <div className="bg-orange-50 rounded-lg p-4 space-y-1">
                                <div className="flex justify-between text-sm">
                                    <span className="text-stone-600">Items Price</span>
                                    <span className="font-medium text-stone-800">৳{selectedOrder.itemsPrice}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-stone-600">Delivery Fee</span>
                                    <span className="font-medium text-stone-800">৳{selectedOrder.deliveryFee}</span>
                                </div>
                                {selectedOrder.discount > 0 && (
                                    <div className="flex justify-between text-sm">
                                        <span className="text-stone-600">Discount</span>
                                        <span className="font-medium text-green-600">-৳{selectedOrder.discount}</span>
                                    </div>
                                )}
                                <div className="border-t border-orange-200 pt-1 flex justify-between text-sm font-bold">
                                    <span className="text-stone-800">Grand Total</span>
                                    <span className="text-stone-900">৳{selectedOrder.totalPrice}</span>
                                </div>
                            </div>

                            <div className="bg-stone-50 rounded-lg p-4">
                                <h3 className="text-sm font-bold text-stone-800 mb-2">Order Items</h3>
                                {selectedOrder.orderItems?.map((item, index) => (
                                    <div key={index} className="flex justify-between items-center py-2 border-b border-stone-200 last:border-0">
                                        <div className="flex items-center gap-3">
                                            {item.image && (
                                                <img src={item.image} alt={item.name} className="w-8 h-8 rounded object-cover" />
                                            )}
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

            {/* ════════════════════════════════════════════════════════════
                PRODUCT ADD/EDIT MODAL
            ════════════════════════════════════════════════════════════ */}
            {showProductModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto mx-4">
                        <div className="flex justify-between items-center p-6 border-b border-stone-200">
                            <h2 className="text-xl font-bold text-stone-800">
                                {editingProduct ? 'Edit Product' : 'Add New Product'}
                            </h2>
                            <button
                                onClick={() => setShowProductModal(false)}
                                className="p-2 rounded-lg hover:bg-stone-100 transition-colors"
                            >
                                <FiX size={24} />
                            </button>
                        </div>

                        <form onSubmit={handleSaveProduct} className="p-6 space-y-4">
                            {/* Name */}
                            <div>
                                <label className="block text-sm font-medium text-stone-700 mb-1">Product Name *</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={productForm.name}
                                    onChange={handleProductFormChange}
                                    required
                                    className="w-full px-4 py-2 rounded-lg border border-stone-200 focus:outline-none focus:ring-2 focus:ring-orange-400"
                                    placeholder="e.g. Chicken Biryani"
                                />
                            </div>

                            {/* Category + Price row */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-stone-700 mb-1">Category *</label>
                                    <select
                                        name="category"
                                        value={productForm.category}
                                        onChange={handleProductFormChange}
                                        className="w-full px-4 py-2 rounded-lg border border-stone-200 focus:outline-none focus:ring-2 focus:ring-orange-400 bg-white"
                                    >
                                        {PRODUCT_CATEGORIES.map(cat => (
                                            <option key={cat} value={cat}>{cat}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-stone-700 mb-1">Price (BDT) *</label>
                                    <input
                                        type="number"
                                        name="price"
                                        value={productForm.price}
                                        onChange={handleProductFormChange}
                                        required
                                        min="0"
                                        className="w-full px-4 py-2 rounded-lg border border-stone-200 focus:outline-none focus:ring-2 focus:ring-orange-400"
                                        placeholder="e.g. 350"
                                    />
                                </div>
                            </div>

                            {/* Image Upload */}
                            <div>
                                <label className="block text-sm font-medium text-stone-700 mb-1">Product Image *</label>
                                <div className="flex gap-4 items-start">
                                    {/* Preview */}
                                    <div className="w-24 h-24 rounded-xl border-2 border-dashed border-stone-200 bg-stone-50 flex items-center justify-center overflow-hidden flex-shrink-0">
                                        {imagePreview ? (
                                            <img src={imagePreview} alt="Preview" className="w-full h-full object-cover rounded-lg" />
                                        ) : (
                                            <FiImage className="text-stone-300" size={32} />
                                        )}
                                    </div>
                                    {/* Upload area */}
                                    <div className="flex-1">
                                        <label className="flex flex-col items-center justify-center w-full py-4 px-4 rounded-lg border-2 border-dashed border-orange-200 bg-orange-50/50 hover:bg-orange-50 cursor-pointer transition-colors">
                                            <FiUploadCloud className="text-orange-400 mb-1" size={24} />
                                            <span className="text-sm font-medium text-stone-600">
                                                {imageFile ? imageFile.name : 'Click to upload image'}
                                            </span>
                                            <span className="text-xs text-stone-400 mt-0.5">JPEG, PNG, WebP up to 5MB</span>
                                            <input
                                                type="file"
                                                accept="image/jpeg,image/png,image/webp,image/gif"
                                                onChange={handleImageFileChange}
                                                className="hidden"
                                            />
                                        </label>
                                        {/* Or paste URL fallback */}
                                        <div className="mt-2">
                                            <input
                                                type="text"
                                                name="image"
                                                value={productForm.image}
                                                onChange={handleProductFormChange}
                                                className="w-full px-3 py-1.5 rounded-lg border border-stone-200 focus:outline-none focus:ring-2 focus:ring-orange-400 text-xs"
                                                placeholder="Or paste image URL directly..."
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Description */}
                            <div>
                                <label className="block text-sm font-medium text-stone-700 mb-1">Description *</label>
                                <textarea
                                    name="description"
                                    value={productForm.description}
                                    onChange={handleProductFormChange}
                                    required
                                    rows={3}
                                    className="w-full px-4 py-2 rounded-lg border border-stone-200 focus:outline-none focus:ring-2 focus:ring-orange-400 resize-none"
                                    placeholder="Describe this dish..."
                                />
                            </div>

                            {/* Rating + Reviews row */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-stone-700 mb-1">Rating (0-5)</label>
                                    <input
                                        type="number"
                                        name="rating"
                                        value={productForm.rating}
                                        onChange={handleProductFormChange}
                                        min="0"
                                        max="5"
                                        step="0.1"
                                        className="w-full px-4 py-2 rounded-lg border border-stone-200 focus:outline-none focus:ring-2 focus:ring-orange-400"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-stone-700 mb-1">Reviews Count</label>
                                    <input
                                        type="number"
                                        name="reviews"
                                        value={productForm.reviews}
                                        onChange={handleProductFormChange}
                                        min="0"
                                        className="w-full px-4 py-2 rounded-lg border border-stone-200 focus:outline-none focus:ring-2 focus:ring-orange-400"
                                    />
                                </div>
                            </div>

                            {/* Tag + Available row */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-stone-700 mb-1">Tag</label>
                                    <select
                                        name="tag"
                                        value={productForm.tag}
                                        onChange={handleProductFormChange}
                                        className="w-full px-4 py-2 rounded-lg border border-stone-200 focus:outline-none focus:ring-2 focus:ring-orange-400 bg-white"
                                    >
                                        {PRODUCT_TAGS.map(tag => (
                                            <option key={tag} value={tag}>{tag || 'None'}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="flex items-end">
                                    <label className="flex items-center gap-3 cursor-pointer py-2">
                                        <input
                                            type="checkbox"
                                            name="isAvailable"
                                            checked={productForm.isAvailable}
                                            onChange={handleProductFormChange}
                                            className="w-5 h-5 rounded border-stone-300 text-orange-500 focus:ring-orange-400"
                                        />
                                        <span className="text-sm font-medium text-stone-700">Available for order</span>
                                    </label>
                                </div>
                            </div>

                            {/* Submit */}
                            <div className="flex justify-end gap-3 pt-4 border-t border-stone-200">
                                <button
                                    type="button"
                                    onClick={() => setShowProductModal(false)}
                                    className="px-6 py-2.5 rounded-lg border border-stone-200 text-stone-700 hover:bg-stone-50 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={uploadingImage}
                                    className="px-6 py-2.5 rounded-lg bg-orange-500 text-white font-medium hover:bg-orange-600 transition-colors shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                                >
                                    {uploadingImage ? (
                                        <>
                                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                            Uploading...
                                        </>
                                    ) : (
                                        editingProduct ? 'Update Product' : 'Create Product'
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}
