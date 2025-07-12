import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Edit } from 'lucide-react';
import { Button, Card } from '../../ui';

const UsersTab = ({ 
  users, 
  searchTerm, 
  setSearchTerm, 
  userPage, 
  setUserPage, 
  handleUserStatusUpdate,
  formatDate 
}) => {
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">User Management</h2>
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
          </div>
        </div>
      </div>

      <Card className="bg-slate-800 border-slate-700">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-700">
                <th className="text-left p-4 text-gray-400">User</th>
                <th className="text-left p-4 text-gray-400">Email</th>
                <th className="text-left p-4 text-gray-400">Joined</th>
                <th className="text-left p-4 text-gray-400">Status</th>
                <th className="text-left p-4 text-gray-400">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.content.map(user => (
                <tr key={user.id} className="border-b border-slate-700">
                  <td className="p-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full flex items-center justify-center">
                        <span className="text-white font-semibold">
                          {user.username?.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <div className="text-white font-medium">{user.username}</div>
                        <div className="text-gray-400 text-sm">{user.firstName} {user.lastName}</div>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-gray-300">{user.email}</td>
                  <td className="p-4 text-gray-300">{formatDate(user.createdAt)}</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      user.enabled 
                        ? 'bg-green-900 text-green-300' 
                        : 'bg-red-900 text-red-300'
                    }`}>
                      {user.enabled ? 'Active' : 'Disabled'}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center space-x-2">
                      <Button
                        onClick={() => navigate(`/admin/users/${user.id}`)}
                        className="text-xs bg-cyan-600 hover:bg-cyan-700"
                      >
                        View Details
                      </Button>
                      <Button
                        onClick={() => handleUserStatusUpdate(user.id, !user.enabled)}
                        className={`text-xs ${
                          user.enabled 
                            ? 'bg-red-600 hover:bg-red-700' 
                            : 'bg-green-600 hover:bg-green-700'
                        }`}
                      >
                        {user.enabled ? 'Disable' : 'Enable'}
                      </Button>
                      <Button className="text-xs bg-blue-600 hover:bg-blue-700">
                        <Edit className="w-3 h-3" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {users.totalPages > 1 && (
          <div className="flex justify-center items-center space-x-4 p-4 border-t border-slate-700">
            <Button
              onClick={() => setUserPage(Math.max(0, userPage - 1))}
              disabled={userPage === 0}
              className="bg-slate-700 hover:bg-slate-600"
            >
              Previous
            </Button>
            <span className="text-gray-400">
              Page {userPage + 1} of {users.totalPages}
            </span>
            <Button
              onClick={() => setUserPage(Math.min(users.totalPages - 1, userPage + 1))}
              disabled={userPage === users.totalPages - 1}
              className="bg-slate-700 hover:bg-slate-600"
            >
              Next
            </Button>
          </div>
        )}
      </Card>
    </div>
  );
};

export default UsersTab;
