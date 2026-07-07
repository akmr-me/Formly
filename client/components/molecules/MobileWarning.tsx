export default function MobileWarning() {
  return (
    <div className="md:hidden flex items-center justify-center h-screen bg-gray-100 p-6">
      <div className="text-center">
        <h2 className="text-xl font-semibold mb-4">
          Sorry! The Formly builder is not available on small screens.
        </h2>
        <p className="text-gray-600">
          Please open this on a laptop or desktop for a better experience.
        </p>
      </div>
    </div>
  );
}
