type ModalProps = {
  children: React.ReactNode;
  onClose: () => void;
};

const Modal = ({ children, onClose }: ModalProps) => {
  const handleOverlayClick = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50"
      onClick={handleOverlayClick}
    >
      <div className="bg-white rounded-lg p-6 w-full max-w-md relative">
        <button
          className="absolute top-2 right-2 text-gray-700 hover:text-gray-900"
          onClick={onClose}
        >
          &times;
        </button>
        {children}
      </div>
    </div>
  );
};

export default Modal;
