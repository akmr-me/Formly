type PreviewLayoutProps = {
  children: React.ReactNode;
  label?: string;
  description?: string;
};

export default function PreviewLayout({
  children,
  label,
  description,
}: PreviewLayoutProps) {
  return (
    <div className="flex flex-col items-center justify-center m-4 py-6 pt-6 mb-0">
      <h3 className="text-xl font-semibold text-gray-900 mb-2">
        {label} Block
      </h3>
      <p className="text-gray-600 pt-6 text-center">{description}</p>
      <div className="w-full my-8 bg-gray-300 p-0.5 rounded-md">{children}</div>
    </div>
  );
}
