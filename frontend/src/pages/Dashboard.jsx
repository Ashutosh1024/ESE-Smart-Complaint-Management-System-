import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';
import { Search, Filter } from 'lucide-react';

function Dashboard() {
  const [complaints, setComplaints] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');

  useEffect(() => {
    fetchComplaints();
  }, []);

  const fetchComplaints = async () => {
    try {
      const res = await api.get('/complaints');
      setComplaints(res.data);
    } catch (err) {
      console.error('Error fetching complaints', err);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchTerm) {
      fetchComplaints();
      return;
    }
    try {
      const res = await api.get(`/complaints/search?location=${searchTerm}`);
      setComplaints(res.data);
    } catch (err) {
      console.error('Error searching complaints', err);
    }
  };

  const filteredComplaints = categoryFilter
    ? complaints.filter(c => c.category === categoryFilter)
    : complaints;

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-gray-800">Complaints Dashboard</h2>
        <Link to="/register-complaint" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          + New Complaint
        </Link>
      </div>

      <div className="flex flex-col md:flex-row justify-between mb-6 gap-4">
        <form onSubmit={handleSearch} className="flex flex-1">
          <input
            type="text"
            placeholder="Search by location (e.g., Ghaziabad)"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full p-2 border rounded-l focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button type="submit" className="bg-blue-600 text-white p-2 rounded-r hover:bg-blue-700 flex items-center">
            <Search size={20} />
          </button>
        </form>

        <div className="flex items-center gap-2">
          <Filter size={20} className="text-gray-500" />
          <select 
            value={categoryFilter} 
            onChange={e => setCategoryFilter(e.target.value)}
            className="p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Categories</option>
            <option value="Water Supply">Water Supply</option>
            <option value="Electricity">Electricity</option>
            <option value="Sanitation">Sanitation</option>
            <option value="Roads">Roads</option>
            <option value="Other">Other</option>
          </select>
        </div>
      </div>

      <div className="bg-white rounded shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-100 border-b">
            <tr>
              <th className="p-4 text-left font-semibold text-gray-700">Title</th>
              <th className="p-4 text-left font-semibold text-gray-700">Category</th>
              <th className="p-4 text-left font-semibold text-gray-700">Location</th>
              <th className="p-4 text-left font-semibold text-gray-700">Status</th>
              <th className="p-4 text-left font-semibold text-gray-700">Date</th>
              <th className="p-4 text-center font-semibold text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredComplaints.length === 0 ? (
              <tr>
                <td colSpan="6" className="p-4 text-center text-gray-500">No complaints found.</td>
              </tr>
            ) : (
              filteredComplaints.map(complaint => (
                <tr key={complaint._id} className="border-b hover:bg-gray-50">
                  <td className="p-4">{complaint.title}</td>
                  <td className="p-4">{complaint.category}</td>
                  <td className="p-4">{complaint.location}</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded text-xs font-semibold ${
                      complaint.status === 'Resolved' ? 'bg-green-100 text-green-800' :
                      complaint.status === 'In Progress' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {complaint.status}
                    </span>
                  </td>
                  <td className="p-4 text-sm text-gray-500">{new Date(complaint.createdAt).toLocaleDateString()}</td>
                  <td className="p-4 text-center">
                    <Link to={`/complaint/${complaint._id}`} className="text-blue-600 hover:underline">View Details</Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Dashboard;
