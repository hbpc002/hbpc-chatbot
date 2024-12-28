import { useState } from 'react';
import { Cog6ToothIcon } from '@heroicons/react/24/outline';
import { SettingsDialog } from './SettingsDialog';

export function SettingsButton() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        title="设置"
      >
        <Cog6ToothIcon className="w-6 h-6 text-gray-600" />
      </button>

      <SettingsDialog 
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
      />
    </>
  );
} 