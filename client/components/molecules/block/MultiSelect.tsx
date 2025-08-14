export default function MultipleSelectBlock() {
  return (
    <div className="text-center space-y-6">
      <h1 className="text-2xl font-semibold text-gray-800">
        Choose your preference
      </h1>
      <div className="space-y-3 max-w-md mx-auto">
        {["Option A", "Option B", "Option C"].map((option, index) => (
          <button
            key={index}
            className="w-full text-left px-4 py-3 border border-gray-600 rounded hover:bg-gray-600 hover:text-white transition-colors duration-200"
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  );
}
