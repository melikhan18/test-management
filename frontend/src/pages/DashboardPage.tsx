import { BarChart3, Users, Building2, TrendingUp, Activity } from 'lucide-react';
import { DashboardLayout } from '../components/layout';
import { useAuth } from '../contexts';

export const DashboardPage = () => {
  const { user } = useAuth();

  const stats = [
    {
      name: 'Total Companies',
      value: '12',
      change: '+2.1%',
      changeType: 'positive',
      icon: Building2,
    },
    {
      name: 'Active Projects',
      value: '24',
      change: '+4.3%',
      changeType: 'positive',
      icon: BarChart3,
    },
    {
      name: 'Team Members',
      value: '156',
      change: '+8.2%',
      changeType: 'positive',
      icon: Users,
    },
    {
      name: 'Tests Completed',
      value: '1,247',
      change: '+12.5%',
      changeType: 'positive',
      icon: Activity,
    },
  ];

  const recentActivities = [
    {
      id: 1,
      type: 'project_created',
      title: 'New project "Mobile App Testing" created',
      description: 'By John Doe in TechCorp',
      time: '2 hours ago',
      avatar: 'JD',
    },
    {
      id: 2,
      type: 'member_joined',
      title: 'Sarah Wilson joined your team',
      description: 'Added to Frontend Development team',
      time: '4 hours ago',
      avatar: 'SW',
    },
    {
      id: 3,
      type: 'test_completed',
      title: 'Integration tests completed',
      description: '24/24 tests passed for API v2.1',
      time: '6 hours ago',
      avatar: 'API',
    },
  ];

  return (
    <DashboardLayout>
      <div className="px-4 sm:px-6 lg:px-8">
        {/* Page header */}
        <div className="md:flex md:items-center md:justify-between mb-8">
          <div className="flex-1 min-w-0">
            <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
              Welcome back, {user?.username}!
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Here's what's happening with your projects today.
            </p>
          </div>
          <div className="mt-4 md:mt-0 md:ml-4">
            <button
              type="button"
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <TrendingUp className="-ml-1 mr-2 h-5 w-5" />
              View Analytics
            </button>
          </div>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
          {stats.map((stat) => (
            <div
              key={stat.name}
              className="relative bg-white pt-5 px-4 pb-12 sm:pt-6 sm:px-6 shadow rounded-lg overflow-hidden"
            >
              <dt>
                <div className="absolute bg-blue-500 rounded-md p-3">
                  <stat.icon className="h-6 w-6 text-white" />
                </div>
                <p className="ml-16 text-sm font-medium text-gray-500 truncate">{stat.name}</p>
              </dt>
              <dd className="ml-16 pb-6 flex items-baseline sm:pb-7">
                <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
                <p className={`ml-2 flex items-baseline text-sm font-semibold ${
                  stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {stat.change}
                </p>
                <div className="absolute bottom-0 inset-x-0 bg-gray-50 px-4 py-4 sm:px-6">
                  <div className="text-sm">
                    <a href="#" className="font-medium text-blue-600 hover:text-blue-500">
                      View all
                    </a>
                  </div>
                </div>
              </dd>
            </div>
          ))}
        </div>

        {/* Content grid */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Recent Activity */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                Recent Activity
              </h3>
              <div className="flow-root">
                <ul className="-my-5 divide-y divide-gray-200">
                  {recentActivities.map((activity) => (
                    <li key={activity.id} className="py-4">
                      <div className="flex items-center space-x-4">
                        <div className="flex-shrink-0">
                          <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center">
                            <span className="text-xs font-medium text-white">
                              {activity.avatar}
                            </span>
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {activity.title}
                          </p>
                          <p className="text-sm text-gray-500 truncate">
                            {activity.description}
                          </p>
                        </div>
                        <div className="flex-shrink-0 text-sm text-gray-500">
                          {activity.time}
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="mt-6">
                <a
                  href="#"
                  className="w-full flex justify-center items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                >
                  View all activity
                </a>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                Quick Actions
              </h3>
              <div className="grid grid-cols-1 gap-4">
                <button className="relative group bg-white p-6 focus-within:ring-2 focus-within:ring-inset focus-within:ring-blue-500 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors">
                  <div>
                    <span className="rounded-lg inline-flex p-3 bg-blue-50 text-blue-700 group-hover:bg-blue-100">
                      <Building2 className="h-6 w-6" />
                    </span>
                  </div>
                  <div className="mt-4">
                    <h3 className="text-lg font-medium text-gray-900">
                      Create New Company
                    </h3>
                    <p className="mt-2 text-sm text-gray-500">
                      Set up a new company workspace for your team
                    </p>
                  </div>
                </button>
                
                <button className="relative group bg-white p-6 focus-within:ring-2 focus-within:ring-inset focus-within:ring-blue-500 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors">
                  <div>
                    <span className="rounded-lg inline-flex p-3 bg-green-50 text-green-700 group-hover:bg-green-100">
                      <BarChart3 className="h-6 w-6" />
                    </span>
                  </div>
                  <div className="mt-4">
                    <h3 className="text-lg font-medium text-gray-900">
                      Start New Project
                    </h3>
                    <p className="mt-2 text-sm text-gray-500">
                      Create a new testing project with your team
                    </p>
                  </div>
                </button>
                
                <button className="relative group bg-white p-6 focus-within:ring-2 focus-within:ring-inset focus-within:ring-blue-500 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors">
                  <div>
                    <span className="rounded-lg inline-flex p-3 bg-purple-50 text-purple-700 group-hover:bg-purple-100">
                      <Users className="h-6 w-6" />
                    </span>
                  </div>
                  <div className="mt-4">
                    <h3 className="text-lg font-medium text-gray-900">
                      Invite Team Members
                    </h3>
                    <p className="mt-2 text-sm text-gray-500">
                      Add new members to your workspace
                    </p>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};
