import React from 'react';
import { 
  Activity, 
  RefreshCw, 
  FileText, 
  MessageSquare, 
  Users, 
  Heart, 
  Eye,
  Shield
} from 'lucide-react';
import { Button, Card } from '../../ui';

const ActivitiesTab = ({ 
  activities,
  activityPage,
  setActivityPage,
  exportActivities,
  viewActivityDetails,
  refreshData,
  refreshing,
  formatDate
}) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">System Activities</h2>
        <div className="flex items-center space-x-3">
          <span className="text-sm text-gray-400">
            Total: {activities.totalElements} activities
          </span>
          <Button 
            onClick={() => exportActivities()}
            className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-sm font-medium px-4 py-2 shadow-lg transition-all duration-200"
          >
            <Activity className="w-4 h-4 mr-2" />
            Export Activities
          </Button>
          <Button
            onClick={refreshData}
            disabled={refreshing}
            className="bg-slate-700 hover:bg-slate-600"
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      </div>
      
      {/* Activity Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card className="bg-slate-800 border-slate-700 p-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <FileText className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-gray-400 text-sm">Snippet Activities</p>
              <p className="text-white font-semibold">
                {activities.content.filter(a => a.type?.includes('SNIPPET') || a.description?.toLowerCase().includes('snippet')).length}
              </p>
            </div>
          </div>
        </Card>
        
        <Card className="bg-slate-800 border-slate-700 p-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center">
              <MessageSquare className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-gray-400 text-sm">Comment Activities</p>
              <p className="text-white font-semibold">
                {activities.content.filter(a => a.type?.includes('COMMENT') || a.description?.toLowerCase().includes('comment')).length}
              </p>
            </div>
          </div>
        </Card>
        
        <Card className="bg-slate-800 border-slate-700 p-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-red-600 rounded-lg flex items-center justify-center">
              <Users className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-gray-400 text-sm">User Activities</p>
              <p className="text-white font-semibold">
                {activities.content.filter(a => a.type?.includes('USER') || a.description?.toLowerCase().includes('user')).length}
              </p>
            </div>
          </div>
        </Card>
        
        <Card className="bg-slate-800 border-slate-700 p-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center">
              <Heart className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-gray-400 text-sm">Like Activities</p>
              <p className="text-white font-semibold">
                {activities.content.filter(a => a.type?.includes('LIKE') || a.description?.toLowerCase().includes('like')).length}
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Activity List */}
      <div className="space-y-4">
        {activities.content.length > 0 ? (
          activities.content.map((activity, index) => (
            <Card key={activity.id || index} className="bg-gradient-to-r from-slate-800 to-slate-700 border-slate-600 p-6 hover:from-slate-700 hover:to-slate-600 transition-all duration-300 shadow-lg">
              <div className="flex items-start space-x-5">
                <div className="w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg"
                     style={{
                       background: (activity.type?.includes('SNIPPET') || activity.description?.toLowerCase().includes('snippet')) ? 'linear-gradient(135deg, #3b82f6, #1e40af)' :
                                  (activity.type?.includes('COMMENT') || activity.description?.toLowerCase().includes('comment')) ? 'linear-gradient(135deg, #10b981, #047857)' :
                                  (activity.type?.includes('LIKE') || activity.description?.toLowerCase().includes('like')) ? 'linear-gradient(135deg, #ef4444, #b91c1c)' :
                                  (activity.type?.includes('USER') || activity.description?.toLowerCase().includes('user')) ? 'linear-gradient(135deg, #8b5cf6, #6d28d9)' :
                                  'linear-gradient(135deg, #06b6d4, #0891b2)'
                     }}>
                  {(activity.type?.includes('SNIPPET') || activity.description?.toLowerCase().includes('snippet')) && <FileText className="w-7 h-7 text-white" />}
                  {(activity.type?.includes('COMMENT') || activity.description?.toLowerCase().includes('comment')) && <MessageSquare className="w-7 h-7 text-white" />}
                  {(activity.type?.includes('LIKE') || activity.description?.toLowerCase().includes('like')) && <Heart className="w-7 h-7 text-white" />}
                  {(activity.type?.includes('USER') || activity.description?.toLowerCase().includes('user')) && <Users className="w-7 h-7 text-white" />}
                  {!['snippet', 'comment', 'like', 'user'].some(type => 
                    activity.type?.toLowerCase().includes(type) || 
                    activity.description?.toLowerCase().includes(type)
                  ) && <Activity className="w-7 h-7 text-white" />}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="text-white font-semibold text-lg mb-3">{activity.description}</h4>
                      
                      <div className="flex flex-wrap items-center gap-3 text-sm text-gray-300 mb-4">
                        <div className="flex items-center space-x-2 bg-slate-600 px-3 py-1.5 rounded-full">
                          <Activity className="w-4 h-4" />
                          <span className="font-medium">{formatDate(activity.timestamp)}</span>
                        </div>
                        
                        {activity.type && (
                          <div className="flex items-center space-x-2 bg-cyan-600 px-3 py-1.5 rounded-full">
                            <Shield className="w-4 h-4" />
                            <span className="font-semibold">
                              {activity.type.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase())}
                            </span>
                          </div>
                        )}
                        
                        {activity.userUsername && (
                          <div className="flex items-center space-x-2 bg-blue-600 px-3 py-1.5 rounded-full">
                            <Users className="w-4 h-4" />
                            <span className="font-medium">@{activity.userUsername}</span>
                          </div>
                        )}

                        {activity.userEmail && (
                          <div className="flex items-center space-x-2 bg-green-600 px-3 py-1.5 rounded-full">
                            <MessageSquare className="w-4 h-4" />
                            <span className="font-medium">{activity.userEmail}</span>
                          </div>
                        )}
                      </div>
                      
                      {/* Additional Activity Details */}
                      {activity.details && (
                        <div className="bg-slate-700 rounded-xl p-4 border border-slate-600">
                          <div className="flex items-center space-x-2 mb-2">
                            <div className="w-2 h-2 bg-cyan-400 rounded-full"></div>
                            <p className="text-gray-300 font-medium text-sm">Activity Details</p>
                          </div>
                          <pre className="text-gray-400 text-xs overflow-x-auto bg-slate-800 p-3 rounded-lg border border-slate-600">
                            {typeof activity.details === 'object' ? 
                              JSON.stringify(activity.details, null, 2) : 
                              activity.details}
                          </pre>
                        </div>
                      )}

                      {/* IP Address and User Agent */}
                      {(activity.ipAddress || activity.userAgent) && (
                        <div className="bg-slate-700 rounded-xl p-4 border border-slate-600 mt-3">
                          <div className="flex items-center space-x-2 mb-2">
                            <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
                            <p className="text-gray-300 font-medium text-sm">Session Information</p>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                            {activity.ipAddress && (
                              <div className="bg-slate-800 p-2 rounded border border-slate-600">
                                <span className="text-gray-400">IP Address: </span>
                                <span className="text-gray-300 font-mono">{activity.ipAddress}</span>
                              </div>
                            )}
                            {activity.userAgent && (
                              <div className="bg-slate-800 p-2 rounded border border-slate-600">
                                <span className="text-gray-400">User Agent: </span>
                                <span className="text-gray-300 font-mono">{activity.userAgent}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex items-center space-x-3 ml-6">
                      <Button 
                        onClick={() => viewActivityDetails(activity)}
                        className="bg-gradient-to-r from-slate-600 to-slate-500 hover:from-slate-500 hover:to-slate-400 text-sm px-4 py-2 font-medium shadow-md transition-all duration-200"
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        View Details
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          ))
        ) : (
          <Card className="bg-gradient-to-br from-slate-800 to-slate-700 border-slate-600 p-16 text-center shadow-xl">
            <div className="w-20 h-20 bg-gradient-to-br from-gray-400 to-gray-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
              <Activity className="w-10 h-10 text-white" />
            </div>
            <h4 className="text-xl font-bold text-white mb-3">No Activities Found</h4>
            <p className="text-gray-300 mb-6 text-lg">No system activities have been recorded yet.</p>
            <div className="bg-slate-700 rounded-xl p-6 border border-slate-600">
              <p className="text-gray-300 font-medium mb-4">Activities that will be tracked include:</p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div className="flex items-center space-x-2 bg-slate-600 px-3 py-2 rounded-full">
                  <FileText className="w-4 h-4 text-blue-400" />
                  <span className="text-sm text-gray-200">Snippet creation</span>
                </div>
                <div className="flex items-center space-x-2 bg-slate-600 px-3 py-2 rounded-full">
                  <MessageSquare className="w-4 h-4 text-green-400" />
                  <span className="text-sm text-gray-200">Comment posting</span>
                </div>
                <div className="flex items-center space-x-2 bg-slate-600 px-3 py-2 rounded-full">
                  <Users className="w-4 h-4 text-purple-400" />
                  <span className="text-sm text-gray-200">User registration</span>
                </div>
                <div className="flex items-center space-x-2 bg-slate-600 px-3 py-2 rounded-full">
                  <Heart className="w-4 h-4 text-red-400" />
                  <span className="text-sm text-gray-200">Content liking</span>
                </div>
              </div>
            </div>
          </Card>
        )}
      </div>

      {/* Pagination */}
      {activities.totalPages > 1 && (
        <div className="flex justify-center items-center space-x-4 pt-6 border-t border-slate-700">
          <Button
            onClick={() => setActivityPage(Math.max(0, activityPage - 1))}
            disabled={activityPage === 0}
            className="bg-gradient-to-r from-slate-700 to-slate-600 hover:from-slate-600 hover:to-slate-500 px-4 py-2 font-medium"
          >
            Previous
          </Button>
          <div className="flex items-center space-x-2">
            <span className="text-gray-400 text-sm">
              Page {activityPage + 1} of {activities.totalPages}
            </span>
            <span className="text-gray-500 text-xs">
              ({activities.totalElements} total activities)
            </span>
          </div>
          <Button
            onClick={() => setActivityPage(Math.min(activities.totalPages - 1, activityPage + 1))}
            disabled={activityPage === activities.totalPages - 1}
            className="bg-gradient-to-r from-slate-700 to-slate-600 hover:from-slate-600 hover:to-slate-500 px-4 py-2 font-medium"
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
};

export default ActivitiesTab;
