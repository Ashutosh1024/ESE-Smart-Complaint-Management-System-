import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';

function RegisterComplaint() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    title: '',
    description: '',
    category: 'Water Supply',
    location: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      await api.post('/complaints', formData);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to register complaint');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white p-8 rounded shadow">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Register New Complaint</h2>
      {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</div>}
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-700 font-medium mb-1">Name</label>
            <input type="text" name="name" value={formData.name} onChange={handleChange} required className="w-full p-2 border rounded focus:ring-blue-500 focus:border-blue-500" />
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-1">Email</label>
            <input type="email" name="email" value={formData.email} onChange={handleChange} required className="w-full p-2 border rounded focus:ring-blue-500 focus:border-blue-500" />
          </div>
        </div>

        <div>
          <label className="block text-gray-700 font-medium mb-1">Complaint Title</label>
          <input type="text" name="title" value={formData.title} onChange={handleChange} required className="w-full p-2 border rounded focus:ring-blue-500 focus:border-blue-500" placeholder="e.g., Water Leakage Issue" />
        </div>

        <div>
          <label className="block text-gray-700 font-medium mb-1">Description</label>
          <textarea name="description" value={formData.description} onChange={handleChange} required rows="4" className="w-full p-2 border rounded focus:ring-blue-500 focus:border-blue-500" placeholder="Describe the issue in detail..."></textarea>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-700 font-medium mb-1">Category</label>
            <select name="category" value={formData.category} onChange={handleChange} className="w-full p-2 border rounded focus:ring-blue-500 focus:border-blue-500">
              <option value="Water Supply">Water Supply</option>
              <option value="Electricity">Electricity</option>
              <option value="Sanitation">Sanitation</option>
              <option value="Roads">Roads</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-1">Location</label>
            <input type="text" name="location" value={formData.location} onChange={handleChange} required className="w-full p-2 border rounded focus:ring-blue-500 focus:border-blue-500" placeholder="e.g., Ghaziabad" />
          </div>
        </div>

        <div className="pt-4 flex justify-end">
          <button 
            type="button" 
            onClick={() => navigate('/dashboard')}
            className="mr-4 px-4 py-2 text-gray-600 hover:text-gray-800"
          >
            Cancel
          </button>
          <button 
            type="submit" 
            disabled={loading}
            className={`px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {loading ? 'Submitting...' : 'Submit Complaint'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default RegisterComplaint;
