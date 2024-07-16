import React from 'react';
import { createPortal } from 'react-dom';

interface ModalProps {
  onClose: () => void;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ onClose, children }) => {
  return createPortal(
    <div className="fixed inset-0 z-50 overflow-auto bg-smoke-light flex">
      <div className="relative p-8 bg-white w-full max-w-md m-auto flex-col flex rounded-lg shadow-lg">
        <span className="absolute top-0 right-0 p-4 cursor-pointer" onClick={onClose}>
          &times;
        </span>
        {children}
      </div>
    </div>,
    document.getElementById('modal-root')!
  );
};

export default Modal;



