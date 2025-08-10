export default function NoBlockSelected() {
  return (
    <div className="text-center pt-6 max-w-xs mx-auto">
      <h4 className="text-lg font-semibold">No block selected</h4>

      <p className="mt-4 text-sm text-gray-500">
        Select a block from left to know about it and to use in the form.
      </p>

      <p className="mt-4 text-sm text-gray-500 italic font-semibold">
        Tip: you can double click on the left blocks to add them quickly.
      </p>
    </div>
  );
}
