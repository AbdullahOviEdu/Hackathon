import React, { useState, useEffect } from 'react';
import { FiCheck, FiX, FiLoader } from 'react-icons/fi';
import { toast } from 'react-toastify';
import { getPendingRequests, handleConnectionRequest, ConnectionRequest } from '../../services/connectionService';

const TeacherConnections: React.FC = () => {
  const [requests, setRequests] = useState<ConnectionRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingIds, setProcessingIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const data = await getPendingRequests();
      setRequests(data);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to fetch connection requests');
    } finally {
      setLoading(false);
    }
  };

  const handleRequest = async (connectionId: string, status: 'accepted' | 'rejected') => {
    try {
      setProcessingIds(prev => new Set(prev).add(connectionId));
      await handleConnectionRequest(connectionId, status);
      setRequests(prev => prev.filter(request => request._id !== connectionId));
      toast.success(`Connection request ${status}`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to handle connection request');
    } finally {
      setProcessingIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(connectionId);
        return newSet;
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-ninja-black p-8 flex items-center justify-center">
        <FiLoader className="w-8 h-8 text-ninja-green animate-spin" />
        <span className="ml-2 text-ninja-white">Loading connection requests...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-ninja-black p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-monument text-ninja-white mb-2">Connection Requests</h1>
        <p className="text-ninja-white/60">Manage student connection requests</p>
      </div>

      {/* Requests List */}
      <div className="space-y-4">
        {requests.length === 0 ? (
          <div className="text-center text-ninja-white/60 py-8">
            No pending connection requests
          </div>
        ) : (
          requests.map((request) => (
            <div
              key={request._id}
              className="bg-ninja-black/95 border border-ninja-white/10 rounded-lg p-6 hover:border-ninja-green/50 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 rounded-full bg-ninja-green/20 border border-ninja-green/30 flex items-center justify-center text-xl text-ninja-green font-monument">
                    {request.student.fullName.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-monument text-ninja-white">{request.student.fullName}</h3>
                    <p className="text-sm text-ninja-white/60">{request.student.grade} • {request.student.school}</p>
                    <p className="text-xs text-ninja-white/40">
                      Requested {new Date(request.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleRequest(request._id, 'rejected')}
                    disabled={processingIds.has(request._id)}
                    className="p-2 hover:bg-red-500/10 rounded-full text-red-500 hover:text-red-400 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <FiX className="w-6 h-6" />
                  </button>
                  <button
                    onClick={() => handleRequest(request._id, 'accepted')}
                    disabled={processingIds.has(request._id)}
                    className="p-2 hover:bg-ninja-green/10 rounded-full text-ninja-green hover:text-ninja-green/80 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <FiCheck className="w-6 h-6" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default TeacherConnections; 