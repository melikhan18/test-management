
function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-2xl p-8 max-w-md w-full mx-4">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            🎨 Tailwind CSS
          </h1>
          <p className="text-gray-600">Successfully integrated!</p>
        </div>

        {/* Test Cards */}
        <div className="space-y-4">
          {/* Color Test */}
          <div className="bg-green-100 border-l-4 border-green-500 p-4 rounded">
            <div className="flex items-center">
              <div className="ml-3">
                <p className="text-sm text-green-700 font-medium">
                  ✅ Colors working
                </p>
              </div>
            </div>
          </div>

          {/* Flexbox Test */}
          <div className="flex justify-between items-center bg-gray-100 p-3 rounded">
            <span className="text-gray-700">Flexbox:</span>
            <div className="flex space-x-2">
              <div className="w-4 h-4 bg-red-500 rounded-full"></div>
              <div className="w-4 h-4 bg-yellow-500 rounded-full"></div>
              <div className="w-4 h-4 bg-green-500 rounded-full"></div>
            </div>
          </div>

          {/* Button Test */}
          <button className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-4 rounded-lg transition duration-200 transform hover:scale-105">
            Interactive Button
          </button>

          {/* Grid Test */}
          <div className="grid grid-cols-3 gap-2">
            <div className="bg-purple-200 h-16 rounded flex items-center justify-center text-purple-800 font-semibold">1</div>
            <div className="bg-pink-200 h-16 rounded flex items-center justify-center text-pink-800 font-semibold">2</div>
            <div className="bg-indigo-200 h-16 rounded flex items-center justify-center text-indigo-800 font-semibold">3</div>
          </div>

          {/* Responsive Test */}
          <div className="bg-yellow-100 p-4 rounded">
            <p className="text-sm text-yellow-800">
              📱 <span className="sm:hidden">Mobile view</span>
              <span className="hidden sm:inline md:hidden">Tablet view</span>
              <span className="hidden md:inline">Desktop view</span>
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 text-center">
          <p className="text-xs text-gray-500">
            Test Management System - Frontend Ready
          </p>
        </div>
      </div>
    </div>
  )
}

export default App