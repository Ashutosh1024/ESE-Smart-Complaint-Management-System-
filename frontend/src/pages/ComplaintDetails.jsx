import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api';
import { Bot, AlertTriangle, Building, FileText, MessageSquare } from 'lucide-react';

function ComplaintDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [complaint, setComplaint] = useState(null);
  const [aiAnalysis, setAiAnalysis] = useState(null);
  const [loadingAI, setLoadingAI] = useState(false);
  const [statusUpdating, setStatusUpdating] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchComplaint = async () => {
      try {
        // Since we don't have a get by ID route, we can fetch all and filter or add the route in backend.
        // Actually, the requirements didn't explicitly ask for GET /id, so let's fetch all and filter.
        const res = await api.get('/complaints');
        const found = res.data.find(c => c._id === id);
        if (found) {
          setComplaint(found);
        } else {
          setError('Complaint not found');
        }
      } catch (err) {
        setError('Error fetching complaint details');
      }
    };
    fetchComplaint();
  }, [id]);

  const handleStatusUpdate = async (newStatus) => {
    setStatusUpdating(true);
    try {
      await api.put(`/complaints/${id}`, { status: newStatus });
      setComplaint({ ...complaint, status: newStatus });
    } catch (err) {
      setError('Failed to update status');
    } finally {
      setStatusUpdating(false);
    }
  };

  const handleAnalyzeAI = async () => {
    setLoadingAI(true);
    try {
      const res = await api.post('/ai/analyze', {
        title: complaint.title,
        description: complaint.description,
        category: complaint.category,
        location: complaint.location
      });
      setAiAnalysis(res.data);
    } catch (err) {
      setError('AI Analysis failed. Check API key and quota.');
    } finally {
      setLoadingAI(false);
    }
  };

  if (error) return <div className="text-red-500 p-4">{error}</div>;
  if (!complaint) return <div className="p-4">Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
      
      {/* Complaint Details Column */}
      <div className="lg:col-span-2 space-y-6">
        <div className="bg-white p-6 rounded shadow">
          <div className="flex justify-between items-start mb-4">
            <h2 className="text-2xl font-bold text-gray-800">{complaint.title}</h2>
            <span className={`px-3 py-1 rounded-full text-sm font-bold ${
              complaint.status === 'Resolved' ? 'bg-green-100 text-green-800' :
              complaint.status === 'In Progress' ? 'bg-yellow-100 text-yellow-800' :
              'bg-red-100 text-red-800'
            }`}>
              {complaint.status}
            </span>
          </div>
          
          <div className="grid grid-cols-2 gap-4 text-sm mb-6 border-b pb-4">
            <div>
              <p className="text-gray-500">Reported By</p>
              <p className="font-medium">{complaint.name} ({complaint.email})</p>
            </div>
            <div>
              <p className="text-gray-500">Date</p>
              <p className="font-medium">{new Date(complaint.createdAt).toLocaleString()}</p>
            </div>
            <div>
              <p className="text-gray-500">Category</p>
              <p className="font-medium">{complaint.category}</p>
            </div>
            <div>
              <p className="text-gray-500">Location</p>
              <p className="font-medium">{complaint.location}</p>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2">Description</h3>
            <p className="text-gray-700 whitespace-pre-wrap">{complaint.description}</p>
          </div>
        </div>

        {/* Status Update Panel */}
        <div className="bg-white p-6 rounded shadow">
          <h3 className="text-lg font-semibold mb-4">Update Status</h3>
          <div className="flex gap-4">
            <button 
              onClick={() => handleStatusUpdate('Pending')}
              disabled={statusUpdating}
              className={`px-4 py-2 rounded border ${complaint.status === 'Pending' ? 'bg-red-50 border-red-200 text-red-700' : 'hover:bg-gray-50'}`}
            >
              Pending
            </button>
            <button 
              onClick={() => handleStatusUpdate('In Progress')}
              disabled={statusUpdating}
              className={`px-4 py-2 rounded border ${complaint.status === 'In Progress' ? 'bg-yellow-50 border-yellow-200 text-yellow-700' : 'hover:bg-gray-50'}`}
            >
              In Progress
            </button>
            <button 
              onClick={() => handleStatusUpdate('Resolved')}
              disabled={statusUpdating}
              className={`px-4 py-2 rounded border ${complaint.status === 'Resolved' ? 'bg-green-50 border-green-200 text-green-700' : 'hover:bg-gray-50'}`}
            >
              Resolved
            </button>
          </div>
        </div>
      </div>

      {/* AI Analysis Column */}
      <div className="space-y-6">
        <div className="bg-gradient-to-br from-indigo-50 to-purple-50 p-6 rounded shadow border border-indigo-100">
          <div className="flex items-center gap-2 mb-4">
            <Bot className="text-indigo-600" />
            <h3 className="text-xl font-bold text-indigo-900">AI Analyzer</h3>
          </div>
          
          <p className="text-sm text-indigo-700 mb-4">
            Use AI to categorize priority, suggest department, and generate an auto-response.
          </p>

          {!aiAnalysis ? (
            <button 
              onClick={handleAnalyzeAI}
              disabled={loadingAI}
              className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700 transition flex justify-center items-center"
            >
              {loadingAI ? 'Analyzing...' : 'Run AI Analysis'}
            </button>
          ) : (
            <div className="space-y-4">
              <div className="bg-white p-3 rounded shadow-sm border-l-4 border-red-500">
                <div className="flex items-center gap-2 text-sm text-gray-500 mb-1"><AlertTriangle size={16}/> Priority</div>
                <p className="font-bold text-gray-800">{aiAnalysis.priority}</p>
              </div>
              
              <div className="bg-white p-3 rounded shadow-sm border-l-4 border-blue-500">
                <div className="flex items-center gap-2 text-sm text-gray-500 mb-1"><Building size={16}/> Suggested Department</div>
                <p className="font-bold text-gray-800">{aiAnalysis.department}</p>
              </div>

              <div className="bg-white p-3 rounded shadow-sm border-l-4 border-yellow-500">
                <div className="flex items-center gap-2 text-sm text-gray-500 mb-1"><FileText size={16}/> Summary</div>
                <p className="text-gray-800 text-sm">{aiAnalysis.summary}</p>
              </div>

              <div className="bg-white p-3 rounded shadow-sm border-l-4 border-green-500">
                <div className="flex items-center gap-2 text-sm text-gray-500 mb-1"><MessageSquare size={16}/> Auto-Response Draft</div>
                <p className="text-gray-800 text-sm italic">"{aiAnalysis.autoResponse}"</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ComplaintDetails;
