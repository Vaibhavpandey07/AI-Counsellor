const ConfirmModal = ({ open, onConfirm, onCancel, message }) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-999 bg-black/40 flex items-center justify-center z-999 ">
      <div className="bg-gray-300 rounded-lg p-6 w-[90%] max-w-sm shadow-xl ">
        <h3 className="text-lg font-semibold mb-4">{message}</h3>

        <div className="flex justify-end gap-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-400 hover:cursor-pointer"
          >
            Cancel
          </button>

          <button
            onClick={onConfirm}
            className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700 hover:cursor-pointer"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal