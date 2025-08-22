'use client'

import React, { useEffect } from 'react';
import Button from '@/components/ui/Button';
import Card from './Card';

interface DialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
}

const Dialog: React.FC<DialogProps> = ({ isOpen, onClose, onConfirm, title, message }) => {

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed h-screen inset-0 bg-black/60 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <Card
        className="bg-black"
        onClick={(e: React.MouseEvent) => e.stopPropagation()}
      >
        <h2 className="text-xl font-bold text-white mb-4">{title}</h2>
        <p className="text-gray-300 mb-6">{message}</p>
        <div className="flex justify-end space-x-4">
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button onClick={onConfirm}>Confirmar</Button>
        </div>
      </Card>
    </div>
  );
};

export default Dialog;
