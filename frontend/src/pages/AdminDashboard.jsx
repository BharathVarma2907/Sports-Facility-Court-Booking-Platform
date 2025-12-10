import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  courtsAPI,
  coachesAPI,
  equipmentAPI,
  pricingRulesAPI,
  bookingsAPI,
} from '../services/api';
import toast from 'react-hot-toast';
import Loader from '../components/Loader';
import Modal from '../components/Modal';
import {
  Calendar,
  Users,
  DollarSign,
  MapPin,
  Plus,
  Edit,
  Trash,
  Package,
  TrendingUp,
} from 'lucide-react';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalBookings: 0,
    totalRevenue: 0,
    activeCourts: 0,
    todayBookings: 0,
  });

  // Data states
  const [courts, setCourts] = useState([]);
  const [coaches, setCoaches] = useState([]);
  const [equipment, setEquipment] = useState([]);
  const [pricingRules, setPricingRules] = useState([]);
  const [bookings, setBookings] = useState([]);

  // Modal states
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('');
  const [editItem, setEditItem] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [courtsRes, coachesRes, equipmentRes, rulesRes, bookingsRes] =
        await Promise.all([
          courtsAPI.getAll({}),
          coachesAPI.getAll({}),
          equipmentAPI.getAll({}),
          pricingRulesAPI.getAll({}),
          bookingsAPI.getAll({}),
        ]);

      setCourts(courtsRes.data.courts);
      setCoaches(coachesRes.data.coaches);
      setEquipment(equipmentRes.data.equipment);
      setPricingRules(rulesRes.data.rules);
      setBookings(bookingsRes.data.bookings);

      // Calculate stats
      const totalRevenue = bookingsRes.data.bookings
        .filter((b) => b.status !== 'cancelled')
        .reduce((sum, b) => sum + b.pricingBreakdown.total, 0);

      const today = new Date().toDateString();
      const todayBookings = bookingsRes.data.bookings.filter(
        (b) => new Date(b.bookingDate).toDateString() === today
      ).length;

      setStats({
        totalBookings: bookingsRes.data.bookings.length,
        totalRevenue,
        activeCourts: courtsRes.data.courts.filter((c) => c.isActive).length,
        todayBookings,
      });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (type, id) => {
    if (!window.confirm('Are you sure you want to delete this item?')) {
      return;
    }

    try {
      switch (type) {
        case 'court':
          await courtsAPI.delete(id);
          break;
        case 'coach':
          await coachesAPI.delete(id);
          break;
        case 'equipment':
          await equipmentAPI.delete(id);
          break;
        case 'pricing-rule':
          await pricingRulesAPI.delete(id);
          break;
      }
      toast.success('Deleted successfully');
      fetchDashboardData();
    } catch (error) {
      console.error('Delete error:', error);
      toast.error('Failed to delete');
    }
  };

  const openModal = (type, item = null) => {
    setModalType(type);
    setEditItem(item);
    setShowModal(true);
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600 mt-2">
            Welcome back, {user?.name}
          </p>
        </div>

        {/* Stats Cards */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="card">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Bookings</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {stats.totalBookings}
                  </p>
                </div>
                <Calendar className="h-10 w-10 text-primary-600" />
              </div>
            </div>

            <div className="card">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Revenue</p>
                  <p className="text-2xl font-bold text-gray-900">
                    ${stats.totalRevenue.toFixed(2)}
                  </p>
                </div>
                <DollarSign className="h-10 w-10 text-green-600" />
              </div>
            </div>

            <div className="card">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Active Courts</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {stats.activeCourts}
                  </p>
                </div>
                <MapPin className="h-10 w-10 text-blue-600" />
              </div>
            </div>

            <div className="card">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Today's Bookings</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {stats.todayBookings}
                  </p>
                </div>
                <TrendingUp className="h-10 w-10 text-orange-600" />
              </div>
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="border-b border-gray-200 mb-6">
          <nav className="-mb-px flex space-x-8">
            {[
              { id: 'overview', name: 'Overview' },
              { id: 'bookings', name: 'Bookings' },
              { id: 'courts', name: 'Courts' },
              { id: 'coaches', name: 'Coaches' },
              { id: 'equipment', name: 'Equipment' },
              { id: 'pricing', name: 'Pricing Rules' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`pb-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-primary-600 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.name}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <div className="card">
            <h2 className="text-xl font-bold mb-4">Recent Bookings</h2>
            <BookingsTable bookings={bookings.slice(0, 10)} />
          </div>
        )}

        {activeTab === 'bookings' && (
          <div>
            <div className="card">
              <h2 className="text-xl font-bold mb-4">All Bookings</h2>
              <BookingsTable bookings={bookings} />
            </div>
          </div>
        )}

        {activeTab === 'courts' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Courts Management</h2>
              <button
                onClick={() => openModal('court')}
                className="btn-primary flex items-center space-x-2"
              >
                <Plus className="h-4 w-4" />
                <span>Add Court</span>
              </button>
            </div>
            <CourtsTable
              courts={courts}
              onEdit={(court) => openModal('court', court)}
              onDelete={(id) => handleDelete('court', id)}
            />
          </div>
        )}

        {activeTab === 'coaches' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Coaches Management</h2>
              <button
                onClick={() => openModal('coach')}
                className="btn-primary flex items-center space-x-2"
              >
                <Plus className="h-4 w-4" />
                <span>Add Coach</span>
              </button>
            </div>
            <CoachesTable
              coaches={coaches}
              onEdit={(coach) => openModal('coach', coach)}
              onDelete={(id) => handleDelete('coach', id)}
            />
          </div>
        )}

        {activeTab === 'equipment' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Equipment Management</h2>
              <button
                onClick={() => openModal('equipment')}
                className="btn-primary flex items-center space-x-2"
              >
                <Plus className="h-4 w-4" />
                <span>Add Equipment</span>
              </button>
            </div>
            <EquipmentTable
              equipment={equipment}
              onEdit={(item) => openModal('equipment', item)}
              onDelete={(id) => handleDelete('equipment', id)}
            />
          </div>
        )}

        {activeTab === 'pricing' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Pricing Rules</h2>
              <button
                onClick={() => openModal('pricing-rule')}
                className="btn-primary flex items-center space-x-2"
              >
                <Plus className="h-4 w-4" />
                <span>Add Rule</span>
              </button>
            </div>
            <PricingRulesTable
              rules={pricingRules}
              onEdit={(rule) => openModal('pricing-rule', rule)}
              onDelete={(id) => handleDelete('pricing-rule', id)}
            />
          </div>
        )}
      </div>

      {/* Modal for Add/Edit */}
      <AdminModal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          setEditItem(null);
        }}
        type={modalType}
        item={editItem}
        onSuccess={() => {
          setShowModal(false);
          setEditItem(null);
          fetchDashboardData();
        }}
      />
    </div>
  );
};

// Component tables and forms
const BookingsTable = ({ bookings }) => (
  <div className="overflow-x-auto">
    <table className="min-w-full divide-y divide-gray-200">
      <thead className="bg-gray-50">
        <tr>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
            User
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
            Court
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
            Date
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
            Time
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
            Amount
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
            Status
          </th>
        </tr>
      </thead>
      <tbody className="bg-white divide-y divide-gray-200">
        {bookings.map((booking) => (
          <tr key={booking._id}>
            <td className="px-6 py-4 whitespace-nowrap text-sm">
              {booking.user?.name || 'N/A'}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm">
              {booking.court.name}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm">
              {new Date(booking.bookingDate).toLocaleDateString()}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm">
              {booking.startTime} - {booking.endTime}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-green-600">
              ${booking.pricingBreakdown.total.toFixed(2)}
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
              <span
                className={`px-2 py-1 rounded-full text-xs ${
                  booking.status === 'confirmed'
                    ? 'bg-green-100 text-green-800'
                    : booking.status === 'cancelled'
                    ? 'bg-red-100 text-red-800'
                    : 'bg-yellow-100 text-yellow-800'
                }`}
              >
                {booking.status}
              </span>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

const CourtsTable = ({ courts, onEdit, onDelete }) => (
  <div className="card overflow-x-auto">
    <table className="min-w-full divide-y divide-gray-200">
      <thead className="bg-gray-50">
        <tr>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
            Name
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
            Type
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
            Sport
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
            Base Price
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
            Status
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
            Actions
          </th>
        </tr>
      </thead>
      <tbody className="bg-white divide-y divide-gray-200">
        {courts.map((court) => (
          <tr key={court._id}>
            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
              {court.name}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm capitalize">
              {court.type}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm">{court.sport}</td>
            <td className="px-6 py-4 whitespace-nowrap text-sm">
              ${court.basePrice}/hr
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
              <span
                className={`px-2 py-1 rounded-full text-xs ${
                  court.isActive
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800'
                }`}
              >
                {court.isActive ? 'Active' : 'Inactive'}
              </span>
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm space-x-2">
              <button
                onClick={() => onEdit(court)}
                className="text-primary-600 hover:text-primary-900"
              >
                <Edit className="h-4 w-4" />
              </button>
              <button
                onClick={() => onDelete(court._id)}
                className="text-red-600 hover:text-red-900"
              >
                <Trash className="h-4 w-4" />
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

const CoachesTable = ({ coaches, onEdit, onDelete }) => (
  <div className="card overflow-x-auto">
    <table className="min-w-full divide-y divide-gray-200">
      <thead className="bg-gray-50">
        <tr>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
            Name
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
            Specialization
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
            Experience
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
            Price/hr
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
            Status
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
            Actions
          </th>
        </tr>
      </thead>
      <tbody className="bg-white divide-y divide-gray-200">
        {coaches.map((coach) => (
          <tr key={coach._id}>
            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
              {coach.name}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm">
              {coach.specialization}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm">
              {coach.experience} years
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm">
              ${coach.pricePerHour}
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
              <span
                className={`px-2 py-1 rounded-full text-xs ${
                  coach.isActive
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800'
                }`}
              >
                {coach.isActive ? 'Active' : 'Inactive'}
              </span>
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm space-x-2">
              <button
                onClick={() => onEdit(coach)}
                className="text-primary-600 hover:text-primary-900"
              >
                <Edit className="h-4 w-4" />
              </button>
              <button
                onClick={() => onDelete(coach._id)}
                className="text-red-600 hover:text-red-900"
              >
                <Trash className="h-4 w-4" />
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

const EquipmentTable = ({ equipment, onEdit, onDelete }) => (
  <div className="card overflow-x-auto">
    <table className="min-w-full divide-y divide-gray-200">
      <thead className="bg-gray-50">
        <tr>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
            Name
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
            Category
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
            Stock
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
            Price/hr
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
            Actions
          </th>
        </tr>
      </thead>
      <tbody className="bg-white divide-y divide-gray-200">
        {equipment.map((item) => (
          <tr key={item._id}>
            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
              {item.name}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm">{item.category}</td>
            <td className="px-6 py-4 whitespace-nowrap text-sm">
              {item.availableStock}/{item.totalStock}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm">
              ${item.pricePerHour}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm space-x-2">
              <button
                onClick={() => onEdit(item)}
                className="text-primary-600 hover:text-primary-900"
              >
                <Edit className="h-4 w-4" />
              </button>
              <button
                onClick={() => onDelete(item._id)}
                className="text-red-600 hover:text-red-900"
              >
                <Trash className="h-4 w-4" />
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

const PricingRulesTable = ({ rules, onEdit, onDelete }) => (
  <div className="card overflow-x-auto">
    <table className="min-w-full divide-y divide-gray-200">
      <thead className="bg-gray-50">
        <tr>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
            Name
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
            Type
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
            Multiplier
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
            Status
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
            Actions
          </th>
        </tr>
      </thead>
      <tbody className="bg-white divide-y divide-gray-200">
        {rules.map((rule) => (
          <tr key={rule._id}>
            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
              {rule.name}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm capitalize">
              {rule.type.replace('_', ' ')}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm">
              {rule.multiplier}x
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
              <span
                className={`px-2 py-1 rounded-full text-xs ${
                  rule.isActive
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800'
                }`}
              >
                {rule.isActive ? 'Active' : 'Inactive'}
              </span>
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm space-x-2">
              <button
                onClick={() => onEdit(rule)}
                className="text-primary-600 hover:text-primary-900"
              >
                <Edit className="h-4 w-4" />
              </button>
              <button
                onClick={() => onDelete(rule._id)}
                className="text-red-600 hover:text-red-900"
              >
                <Trash className="h-4 w-4" />
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

// Modal for CRUD operations (simplified version - you can expand this)
const AdminModal = ({ isOpen, onClose, type, item, onSuccess }) => {
  const [formData, setFormData] = useState(item || {});
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (item) {
        // Update
        switch (type) {
          case 'court':
            await courtsAPI.update(item._id, formData);
            break;
          case 'coach':
            await coachesAPI.update(item._id, formData);
            break;
          case 'equipment':
            await equipmentAPI.update(item._id, formData);
            break;
          case 'pricing-rule':
            await pricingRulesAPI.update(item._id, formData);
            break;
        }
        toast.success('Updated successfully');
      } else {
        // Create
        switch (type) {
          case 'court':
            await courtsAPI.create(formData);
            break;
          case 'coach':
            await coachesAPI.create(formData);
            break;
          case 'equipment':
            await equipmentAPI.create(formData);
            break;
          case 'pricing-rule':
            await pricingRulesAPI.create(formData);
            break;
        }
        toast.success('Created successfully');
      }
      onSuccess();
    } catch (error) {
      console.error('Submit error:', error);
      toast.error(error.response?.data?.message || 'Operation failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`${item ? 'Edit' : 'Add'} ${type}`}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Simplified form - expand based on type */}
        <p className="text-sm text-gray-600">
          Form fields for {type} would go here. Implement specific forms for each type.
        </p>
        <div className="flex space-x-2">
          <button type="submit" disabled={loading} className="btn-primary flex-1">
            {loading ? 'Saving...' : 'Save'}
          </button>
          <button type="button" onClick={onClose} className="btn-secondary">
            Cancel
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default AdminDashboard;
