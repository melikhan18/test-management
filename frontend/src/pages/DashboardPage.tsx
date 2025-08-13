import { useAuth } from '../contexts';
import { FiCode, FiSettings, FiUsers, FiFolder } from 'react-icons/fi';

/**
 * Dashboard Page Component
 * Main dashboard with development status
 */
export default function DashboardPage() {
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg p-8 text-white">
        <div className="flex items-center space-x-4">
          <div className="h-16 w-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
            <FiCode className="h-8 w-8" />
          </div>
          <div>
            <h1 className="text-3xl font-bold mb-2">
              Welcome, {user?.username}!
            </h1>
            <p className="text-blue-100 text-lg">
              Test Management System Dashboard
            </p>
          </div>
        </div>
      </div>

      {/* Development Status */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
        <div className="text-center">
          <div className="h-24 w-24 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <FiSettings className="h-12 w-12 text-yellow-600 animate-spin" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            🚧 Development in Progress
          </h2>
          <p className="text-gray-600 text-lg mb-6 max-w-2xl mx-auto">
            We're actively building an amazing test management experience for you. 
            This dashboard will soon include project overviews, task management, 
            team collaboration tools, and comprehensive reporting features.
          </p>
          
          {/* Feature Preview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            <div className="p-6 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
              <FiFolder className="h-10 w-10 text-blue-600 mx-auto mb-4" />
              <h3 className="font-semibold text-gray-900 mb-2">Project Management</h3>
              <p className="text-sm text-gray-600">
                Organize and track your testing projects with ease
              </p>
            </div>
            
            <div className="p-6 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
              <FiUsers className="h-10 w-10 text-green-600 mx-auto mb-4" />
              <h3 className="font-semibold text-gray-900 mb-2">Team Collaboration</h3>
              <p className="text-sm text-gray-600">
                Work seamlessly with your team members
              </p>
            </div>
            
            <div className="p-6 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
              <FiSettings className="h-10 w-10 text-purple-600 mx-auto mb-4" />
              <h3 className="font-semibold text-gray-900 mb-2">Advanced Analytics</h3>
              <p className="text-sm text-gray-600">
                Gain insights with comprehensive reporting
              </p>
            </div>
          </div>

          {/* Coming Soon Badge */}
          <div className="mt-8">
            <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
              ✨ More features coming soon!
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
