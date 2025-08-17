export default function Loading() {
  return (
    <div className="flex h-screen w-full items-center justify-center bg-white">
      <div className="flex flex-col items-center gap-4">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-gray-300 border-t-gray-900" />

        <p className="text-gray-700 text-sm font-medium">Loading...</p>
      </div>
    </div>
  );
}
