import { Dialog } from '@headlessui/react';
import { motion } from 'framer-motion';
import { useThemeStore, themes } from '../../lib/store/theme';
import { useModelStore, models } from '../../lib/store/model';

interface SettingsDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SettingsDialog({ isOpen, onClose }: SettingsDialogProps) {
  const { currentTheme, setTheme } = useThemeStore();
  const { currentModel, setModel } = useModelStore();

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      className="relative z-50"
    >
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="mx-auto max-w-sm rounded-2xl bg-white p-6 shadow-xl">
          <Dialog.Title className="text-lg font-medium mb-4">设置</Dialog.Title>
          
          {/* 模型选择 */}
          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-3">选择模型</h3>
              <div className="space-y-2">
                {models.map((model) => (
                  <button
                    key={model.id}
                    onClick={() => setModel(model.id)}
                    className={`w-full text-left px-4 py-3 rounded-lg border transition-all ${
                      currentModel === model.id 
                        ? `${currentTheme.colors.secondary} border-${currentTheme.colors.primary.split(' ')[0].replace('from-', '')}` 
                        : 'border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    {model.name}
                  </button>
                ))}
              </div>
            </div>

            {/* 主题选择 */}
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-3">选择主题</h3>
              <div className="grid grid-cols-4 gap-3">
                {themes.map((theme) => (
                  <button
                    key={theme.id}
                    onClick={() => setTheme(theme.id)}
                    className={`
                      w-12 h-12 rounded-xl overflow-hidden p-0.5
                      ${currentTheme.id === theme.id ? 'ring-2 ring-offset-2 ring-blue-500' : ''}
                    `}
                    title={theme.name}
                  >
                    <div className={`w-full h-full rounded-lg bg-gradient-to-r ${theme.colors.primary}`} />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
} 