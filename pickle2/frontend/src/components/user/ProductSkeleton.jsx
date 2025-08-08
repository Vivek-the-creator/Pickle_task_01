const ProductSkeleton = () => {
  return (
    <div className="card animate-pulse">
      <div className="relative overflow-hidden rounded-t-2xl">
        <div className="w-full h-48 bg-gray-200"></div>
        <div className="absolute top-2 right-2 w-8 h-8 bg-gray-200 rounded-full"></div>
      </div>
      
      <div className="p-4">
        <div className="h-4 bg-gray-200 rounded mb-2"></div>
        <div className="h-3 bg-gray-200 rounded mb-1"></div>
        <div className="h-3 bg-gray-200 rounded mb-3 w-3/4"></div>
        
        <div className="flex items-center justify-between">
          <div className="h-6 bg-gray-200 rounded w-20"></div>
          <div className="h-10 bg-gray-200 rounded-lg w-24"></div>
        </div>
      </div>
    </div>
  );
};

export default ProductSkeleton; 