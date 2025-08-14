import { Shield, Users, BarChart3, CheckCircle } from 'lucide-react';

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle: string;
}

export const AuthLayout = ({ children, title, subtitle }: AuthLayoutProps) => {
  const features = [
    {
      icon: Shield,
      title: "Enterprise Security",
      description: "Advanced JWT authentication with role-based access control for maximum security."
    },
    {
      icon: Users,
      title: "Team Collaboration",
      description: "Seamlessly manage teams and companies with comprehensive member management."
    },
    {
      icon: BarChart3,
      title: "Advanced Analytics",
      description: "Track project progress with detailed analytics and reporting capabilities."
    },
    {
      icon: CheckCircle,
      title: "Quality Assurance",
      description: "Comprehensive test management system for maintaining high quality standards."
    }
  ];

  return (
    <div className="h-screen bg-gradient-to-br from-slate-50 to-blue-50 overflow-hidden">
      <div className="flex h-full">
        {/* Left Panel - Product Introduction */}
        <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 relative overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full -translate-x-1/2 -translate-y-1/2"></div>
            <div className="absolute bottom-0 right-0 w-80 h-80 bg-white rounded-full translate-x-1/3 translate-y-1/3"></div>
          </div>
          
          <div className="relative z-10 flex flex-col justify-center px-8 xl:px-12 py-8 text-white h-full overflow-y-auto">
            {/* Logo and Brand */}
            <div className="mb-8">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center mr-3">
                  <Shield className="w-6 h-6 text-blue-900" />
                </div>
                <div>
                  <h1 className="text-xl font-bold">TestManager Pro</h1>
                  <p className="text-blue-200 text-xs">Enterprise Test Management</p>
                </div>
              </div>
              
              <h2 className="text-3xl lg:text-4xl font-bold mb-3 leading-tight">
                Streamline Your
                <span className="block text-blue-300">Testing Workflow</span>
              </h2>
              
              <p className="text-lg text-blue-100 leading-relaxed">
                Powerful test management platform designed for modern development teams. 
                Organize, track, and manage your testing processes with enterprise-grade security.
              </p>
            </div>

            {/* Features Grid */}
            <div className="grid grid-cols-1 gap-4 mb-8">
              {features.map((feature, index) => (
                <div key={index} className="flex items-start space-x-3 p-3 rounded-lg bg-white/10 backdrop-blur-sm">
                  <div className="flex-shrink-0 w-8 h-8 bg-blue-400/20 rounded-lg flex items-center justify-center">
                    <feature.icon className="w-4 h-4 text-blue-200" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-white mb-1 text-sm">{feature.title}</h4>
                    <p className="text-xs text-blue-200 leading-relaxed">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-white">99.9%</div>
                <div className="text-xs text-blue-200">Uptime</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-white">500+</div>
                <div className="text-xs text-blue-200">Companies</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-white">24/7</div>
                <div className="text-xs text-blue-200">Support</div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Panel - Auth Form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-4 lg:p-8 h-full overflow-y-auto">
          <div className="w-full max-w-md">
            {/* Mobile Logo */}
            <div className="lg:hidden flex items-center justify-center mb-6">
              <div className="w-10 h-10 bg-blue-900 rounded-xl flex items-center justify-center mr-3">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-gray-900">TestManager Pro</h1>
                <p className="text-gray-600 text-xs">Enterprise Test Management</p>
              </div>
            </div>

            {/* Form Header */}
            <div className="text-center mb-6">
              <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">{title}</h2>
              <p className="text-gray-600 text-sm">{subtitle}</p>
            </div>

            {/* Form Content */}
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 lg:p-8">
              {children}
            </div>

            {/* Footer */}
            <div className="mt-6 text-center">
              <p className="text-xs text-gray-500">
                Secure authentication powered by enterprise-grade JWT technology
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
