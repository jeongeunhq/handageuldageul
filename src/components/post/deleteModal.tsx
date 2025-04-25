import React from "react";

interface deleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const deleteModal: React.FC<deleteModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-96">
        <h2 className="text-center text-lg font-bold mb-10">
          게시글을 삭제하시겠습니까?
        </h2>
        <div className="flex justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md"
          >
            취소
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-red-600 text-white rounded-md"
          >
            삭제
          </button>
        </div>
      </div>
    </div>
  );
};

export default deleteModal;
