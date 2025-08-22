'use client'

import { useState } from 'react'; 
import HeroSection from '@/components/sections/HeroSection'
import SkillsSection from '@/components/sections/SkillsSection'
import Dialog from '@/components/ui/Dialog'; 

export default function HomePage() {
  const [showDialog, setShowDialog] = useState(false);
  const [dialogConfirmAction, setDialogConfirmAction] = useState<(() => void) | null>(null);

  const handleDownloadRequest = (onConfirm: () => void) => {
    setShowDialog(true);
    setDialogConfirmAction(() => onConfirm);
  };

  const handleDialogConfirm = () => {
    if (dialogConfirmAction) {
      dialogConfirmAction();
    }
    setShowDialog(false);
  };

  return (
    <div className="space-y-16">
      <HeroSection onDownloadRequest={handleDownloadRequest} className="relative" />
      <SkillsSection />

      <Dialog
        isOpen={showDialog}
        onClose={() => setShowDialog(false)}
        onConfirm={handleDialogConfirm}
        title="Confirmar Descarga"
        message="¿Quieres descargar el CV de Ramon?"
      />
    </div>
  )
}
