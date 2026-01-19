export default function CartSkeleton() {
  return (
    <div className="min-h-screen py-8 animate-pulse">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="h-8 w-48 bg-gray-200 rounded mb-8" />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          <div className="lg:col-span-2 space-y-6">

            <div className="bg-gray-200 rounded-xl h-32" />

            {[1, 2].map((i) => (
              <div key={i} className="bg-gray-200 rounded-xl p-6 space-y-4">
                <div className="h-5 w-40 bg-gray-300 rounded" />
                <div className="space-y-3">
                  {[1, 2].map((j) => (
                    <div key={j} className="flex gap-4">
                      <div className="w-20 h-20 bg-gray-300 rounded-lg" />
                      <div className="flex-1 space-y-2">
                        <div className="h-4 w-3/4 bg-gray-300 rounded" />
                        <div className="h-4 w-1/3 bg-gray-300 rounded" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}

            <div>
              <div className="h-6 w-32 bg-gray-200 rounded mb-4" />
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="h-40 bg-gray-200 rounded-xl"
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-1 sticky top-24">
            <div className="bg-gray-200 rounded-xl h-72" />
          </div>

        </div>
      </div>
    </div>
  );
}
