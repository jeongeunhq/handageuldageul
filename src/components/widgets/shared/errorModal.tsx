import React from "react";

type ErrorModalProps = {
  show: boolean;
  onClose: () => void;
};

const ErrorModal: React.FC<ErrorModalProps> = ({ show, onClose }) => {
  if (!show) return null; // 모달이 표시될 때만 렌더링

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg text-center w-[300px]">
        <p className="mb-4 text-2xl text-gray-800 font-semibold">
          로그인 실패!
        </p>
        <p className="mb-4 text-gray-800">아이디나 비밀번호를 확인해주세요.</p>
        <button
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          onClick={onClose}
        >
          닫기
        </button>
      </div>
    </div>
  );
};

export default ErrorModal;
