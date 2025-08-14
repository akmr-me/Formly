export default function MobileWarning() {
  return (
    <div className="md:hidden flex items-center justify-center h-screen bg-gray-100 p-6">
      <div className="text-center">
        <h2 className="text-xl font-semibold mb-4">
          Sorry! Youform builder is not available in small screen.
        </h2>
        <p className="text-gray-600">
          Please open this in laptop or desktop for better experience.
        </p>
      </div>
    </div>
  );
}
