import React from 'react';
import { 
  RefreshCw, 
  CheckCircle, 
  XCircle, 
  Activity, 
  Server, 
  TrendingUp,
  Settings,
  AlertTriangle
} from 'lucide-react';
import { Button, Card } from '../../ui';

const SystemTab = ({ 
  systemHealth,
  refreshData,
  refreshing
}) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">System Health & Monitoring</h2>
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2 bg-slate-700 px-3 py-2 rounded-lg">
            <div className={`w-3 h-3 rounded-full ${systemHealth?.databaseStatus === 'healthy' ? 'bg-green-400 animate-pulse' : 'bg-red-400 animate-pulse'}`}></div>
            <span className="text-sm text-gray-300">
              System {systemHealth?.databaseStatus === 'healthy' ? 'Online' : 'Issues Detected'}
            </span>
          </div>
          <Button
            onClick={refreshData}
            disabled={refreshing}
            className="bg-slate-700 hover:bg-slate-600"
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      </div>
      
      {systemHealth ? (
        <>
          {/* System Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card className="bg-gradient-to-br from-green-800 to-green-700 border-green-600 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-200 text-sm font-medium">Database Status</p>
                  <p className="text-white text-xl font-bold">
                    {systemHealth.databaseStatus === 'healthy' ? 'Healthy' : 'Issues'}
                  </p>
                </div>
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                  systemHealth.databaseStatus === 'healthy' 
                    ? 'bg-green-600' 
                    : 'bg-red-600'
                }`}>
                  {systemHealth.databaseStatus === 'healthy' ? (
                    <CheckCircle className="w-6 h-6 text-white" />
                  ) : (
                    <XCircle className="w-6 h-6 text-white" />
                  )}
                </div>
              </div>
            </Card>
            
            <Card className="bg-gradient-to-br from-blue-800 to-blue-700 border-blue-600 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-200 text-sm font-medium">Response Time</p>
                  <p className="text-white text-xl font-bold">{systemHealth.responseTime}ms</p>
                </div>
                <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
                  <Activity className="w-6 h-6 text-white" />
                </div>
              </div>
            </Card>
            
            <Card className="bg-gradient-to-br from-purple-800 to-purple-700 border-purple-600 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-200 text-sm font-medium">Memory Usage</p>
                  <p className="text-white text-xl font-bold">{systemHealth.memoryUsage}%</p>
                </div>
                <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center">
                  <Server className="w-6 h-6 text-white" />
                </div>
              </div>
            </Card>
            
            <Card className="bg-gradient-to-br from-orange-800 to-orange-700 border-orange-600 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-200 text-sm font-medium">CPU Usage</p>
                  <p className="text-white text-xl font-bold">{systemHealth.cpuUsage}%</p>
                </div>
                <div className="w-12 h-12 bg-orange-600 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
              </div>
            </Card>
          </div>

          {/* Detailed System Information */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Database Health */}
            <Card className="bg-slate-800 border-slate-700 p-6">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-r from-green-600 to-green-500 rounded-lg flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white">Database Health</h3>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-slate-700 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 rounded-full ${systemHealth.databaseStatus === 'healthy' ? 'bg-green-400' : 'bg-red-400'}`}></div>
                    <span className="text-gray-300 font-medium">Connection Status</span>
                  </div>
                  <span className={`font-semibold px-3 py-1 rounded-full text-sm ${
                    systemHealth.databaseStatus === 'healthy' 
                      ? 'bg-green-900 text-green-200' 
                      : 'bg-red-900 text-red-200'
                  }`}>
                    {systemHealth.databaseStatus === 'healthy' ? 'Connected' : 'Disconnected'}
                  </span>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-slate-700 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Activity className="w-4 h-4 text-blue-400" />
                    <span className="text-gray-300 font-medium">Response Time</span>
                  </div>
                  <span className={`font-semibold ${
                    systemHealth.responseTime < 100 ? 'text-green-400' :
                    systemHealth.responseTime < 500 ? 'text-yellow-400' : 'text-red-400'
                  }`}>
                    {systemHealth.responseTime}ms
                  </span>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-slate-700 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Server className="w-4 h-4 text-purple-400" />
                    <span className="text-gray-300 font-medium">Active Connections</span>
                  </div>
                  <span className="text-white font-semibold">
                    {systemHealth.activeConnections || 'N/A'}
                  </span>
                </div>
                
                <div className="mt-4 p-4 bg-slate-700 rounded-lg border border-slate-600">
                  <div className="flex items-center space-x-2 mb-2">
                    <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                    <span className="text-sm font-medium text-gray-300">Database Performance</span>
                  </div>
                  <div className="w-full bg-slate-600 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full transition-all duration-300 ${
                        systemHealth.responseTime < 100 ? 'bg-green-500' :
                        systemHealth.responseTime < 500 ? 'bg-yellow-500' : 'bg-red-500'
                      }`}
                      style={{ width: `${Math.min(100, (1000 - systemHealth.responseTime) / 10)}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-gray-400 mt-1">
                    {systemHealth.responseTime < 100 ? 'Excellent' :
                     systemHealth.responseTime < 500 ? 'Good' : 'Needs Attention'}
                  </p>
                </div>
              </div>
            </Card>

            {/* System Resources */}
            <Card className="bg-slate-800 border-slate-700 p-6">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <Server className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white">System Resources</h3>
              </div>
              
              <div className="space-y-4">
                {/* Memory Usage */}
                <div className="p-4 bg-slate-700 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-300 font-medium">Memory Usage</span>
                    <span className="text-white font-semibold">{systemHealth.memoryUsage}%</span>
                  </div>
                  <div className="w-full bg-slate-600 rounded-full h-3">
                    <div 
                      className={`h-3 rounded-full transition-all duration-300 ${
                        systemHealth.memoryUsage < 70 ? 'bg-green-500' :
                        systemHealth.memoryUsage < 85 ? 'bg-yellow-500' : 'bg-red-500'
                      }`}
                      style={{ width: `${systemHealth.memoryUsage}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-gray-400 mt-1">
                    {systemHealth.memoryUsage < 70 ? 'Normal' :
                     systemHealth.memoryUsage < 85 ? 'High' : 'Critical'}
                  </p>
                </div>
                
                {/* CPU Usage */}
                <div className="p-4 bg-slate-700 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-300 font-medium">CPU Usage</span>
                    <span className="text-white font-semibold">{systemHealth.cpuUsage}%</span>
                  </div>
                  <div className="w-full bg-slate-600 rounded-full h-3">
                    <div 
                      className={`h-3 rounded-full transition-all duration-300 ${
                        systemHealth.cpuUsage < 70 ? 'bg-green-500' :
                        systemHealth.cpuUsage < 85 ? 'bg-yellow-500' : 'bg-red-500'
                      }`}
                      style={{ width: `${systemHealth.cpuUsage}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-gray-400 mt-1">
                    {systemHealth.cpuUsage < 70 ? 'Normal' :
                     systemHealth.cpuUsage < 85 ? 'High' : 'Critical'}
                  </p>
                </div>
                
                {/* System Uptime */}
                <div className="p-4 bg-slate-700 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-300 font-medium">System Uptime</span>
                    <span className="text-white font-semibold">
                      {(() => {
                        const uptimeSeconds = parseInt(systemHealth.uptime);
                        const days = Math.floor(uptimeSeconds / 86400);
                        const hours = Math.floor((uptimeSeconds % 86400) / 3600);
                        const minutes = Math.floor((uptimeSeconds % 3600) / 60);
                        return `${days}d ${hours}h ${minutes}m`;
                      })()}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                    <span className="text-sm text-green-400 font-medium">System Running</span>
                  </div>
                </div>

                {/* Disk Usage */}
                <div className="p-4 bg-slate-700 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-300 font-medium">Disk Usage</span>
                    <span className="text-white font-semibold">{systemHealth.diskUsage || '45'}%</span>
                  </div>
                  <div className="w-full bg-slate-600 rounded-full h-3">
                    <div 
                      className={`h-3 rounded-full transition-all duration-300 ${
                        (systemHealth.diskUsage || 45) < 70 ? 'bg-green-500' :
                        (systemHealth.diskUsage || 45) < 85 ? 'bg-yellow-500' : 'bg-red-500'
                      }`}
                      style={{ width: `${systemHealth.diskUsage || 45}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-gray-400 mt-1">
                    {(systemHealth.diskUsage || 45) < 70 ? 'Normal' :
                     (systemHealth.diskUsage || 45) < 85 ? 'High' : 'Critical'}
                  </p>
                </div>
              </div>
            </Card>
          </div>

          {/* System Services Status */}
          <Card className="bg-slate-800 border-slate-700 p-6">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-r from-cyan-600 to-blue-600 rounded-lg flex items-center justify-center">
                <Settings className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white">System Services</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-slate-700 rounded-lg border border-slate-600">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-semibold text-white">Web Server</h4>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    <span className="text-green-400 text-sm font-medium">Running</span>
                  </div>
                </div>
                <p className="text-gray-400 text-sm">Nginx 1.20.2</p>
                <p className="text-gray-400 text-sm">Port: 80, 443</p>
              </div>
              
              <div className="p-4 bg-slate-700 rounded-lg border border-slate-600">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-semibold text-white">Application Server</h4>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    <span className="text-green-400 text-sm font-medium">Running</span>
                  </div>
                </div>
                <p className="text-gray-400 text-sm">Spring Boot 3.2.0</p>
                <p className="text-gray-400 text-sm">Port: 8080</p>
              </div>
              
              <div className="p-4 bg-slate-700 rounded-lg border border-slate-600">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-semibold text-white">Database Server</h4>
                  <div className="flex items-center space-x-2">
                    <div className={`w-2 h-2 ${systemHealth.databaseStatus === 'healthy' ? 'bg-green-400' : 'bg-red-400'} rounded-full`}></div>
                    <span className={`text-sm font-medium ${systemHealth.databaseStatus === 'healthy' ? 'text-green-400' : 'text-red-400'}`}>
                      {systemHealth.databaseStatus === 'healthy' ? 'Running' : 'Issues'}
                    </span>
                  </div>
                </div>
                <p className="text-gray-400 text-sm">PostgreSQL 15.2</p>
                <p className="text-gray-400 text-sm">Port: 5432</p>
              </div>
            </div>
          </Card>

          {/* System Actions */}
          <Card className="bg-slate-800 border-slate-700 p-6">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-r from-red-600 to-orange-600 rounded-lg flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white">System Actions</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Button className="bg-blue-600 hover:bg-blue-700 justify-center">
                <RefreshCw className="w-4 h-4 mr-2" />
                Restart Services
              </Button>
              <Button className="bg-yellow-600 hover:bg-yellow-700 justify-center">
                <Settings className="w-4 h-4 mr-2" />
                Clear Cache
              </Button>
              <Button className="bg-purple-600 hover:bg-purple-700 justify-center">
                <Activity className="w-4 h-4 mr-2" />
                View Logs
              </Button>
              <Button className="bg-green-600 hover:bg-green-700 justify-center">
                <CheckCircle className="w-4 h-4 mr-2" />
                Run Health Check
              </Button>
            </div>
          </Card>
        </>
      ) : (
        <Card className="bg-slate-800 border-slate-700 p-12 text-center">
          <div className="w-16 h-16 bg-gray-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <Server className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">Loading System Health...</h3>
          <p className="text-gray-400">Please wait while we fetch system information.</p>
        </Card>
      )}
    </div>
  );
};

export default SystemTab;
