export default function InputBlock() {
  return (
    <div className="text-center space-y-6">
      <h1 className="text-2xl font-semibold text-gray-800">
        What&nbps;s your name?
      </h1>
      <input
        type="text"
        className="w-full max-w-md mx-auto block px-4 py-3 border-b-2 border-gray-600 bg-transparent focus:outline-none focus:border-gray-800 text-lg"
        placeholder="Enter your name..."
      />
      <button className="bg-black hover:bg-gray-800 text-white px-6 py-2 rounded font-medium transition-colors duration-200">
        Continue
      </button>
    </div>
  );
}

{
  /* <input
  type="number"
  className="w-full max-w-md mx-auto block px-4 py-3 border-b-2 border-gray-600 bg-transparent focus:outline-none focus:border-gray-800 text-lg"
  placeholder="Enter a number..."
/>; */
}
