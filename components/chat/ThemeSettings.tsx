import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import clsx from 'clsx';
import { useThemeContext } from '../../contexts/ThemeContext';

export const themes = [
  {
    id: 'default',
    name: '清逸蓝',
    primary: '#3B82F6',
    hover: '#2563EB',
    bg: 'bg-blue-25',
    text: 'text-gray-800',
    shadow: 'shadow-lg',
    buttonText: 'text-white',
    buttonShadow: 'shadow-lg',
    buttonRounded: 'rounded-lg',
    inputBg: 'bg-white',
    inputBorder: 'border-gray-300',
    inputText: 'text-gray-700',
    messageUserBg: 'bg-blue-100',
    messageAssistantBg: 'bg-blue-50',
    border: 'border-gray-200',
  },
  {
    id: 'green',
    name: '宁静绿',
    primary: '#10B981',
    hover: '#059669',
    bg: 'bg-green-25',
    text: 'text-gray-800',
    shadow: 'shadow-lg',
    buttonText: 'text-white',
    buttonShadow: 'shadow-lg',
    buttonRounded: 'rounded-lg',
    inputBg: 'bg-white',
    inputBorder: 'border-gray-300',
    inputText: 'text-gray-700',
    messageUserBg: 'bg-green-100',
    messageAssistantBg: 'bg-green-50',
    border: 'border-gray-200',
  },
  {
    id: 'purple',
    name: '优雅紫',
    primary: '#8B5CF6',
    hover: '#7C3AED',
    bg: 'bg-purple-25',
    text: 'text-gray-800',
    shadow: 'shadow-lg',
    buttonText: 'text-white',
    buttonShadow: 'shadow-lg',
    buttonRounded: 'rounded-lg',
    inputBg: 'bg-white',
    inputBorder: 'border-gray-300',
    inputText: 'text-gray-700',
    messageUserBg: 'bg-purple-100',
    messageAssistantBg: 'bg-purple-50',
    border: 'border-gray-200',
  },
  {
    id: 'dark',
    name: '深邃黑',
    primary: '#111827',
    hover: '#374151',
    bg: 'bg-gray-950',
    text: 'text-gray-400',
    shadow: 'shadow-lg',
    buttonText: 'text-gray-300',
    buttonShadow: 'shadow-lg',
    buttonRounded: 'rounded-lg',
    inputBg: 'bg-gray-900',
    inputBorder: 'border-gray-600',
    inputText: 'text-gray-300',
    messageUserBg: 'bg-gray-800',
    messageAssistantBg: 'bg-gray-900',
    border: 'border-gray-700',
  },
  {
    id: 'amber',
    name: '温暖琥珀',
    primary: '#F59E0B',
    hover: '#D97706',
    bg: 'bg-amber-25',
    text: 'text-gray-800',
    shadow: 'shadow-lg',
    buttonText: 'text-white',
    buttonShadow: 'shadow-lg',
    buttonRounded: 'rounded-lg',
    inputBg: 'bg-white',
    inputBorder: 'border-gray-300',
    inputText: 'text-gray-700',
    messageUserBg: 'bg-amber-100',
    messageAssistantBg: 'bg-amber-50',
    border: 'border-gray-200',
  },
  {
    id: 'teal',
    name: '静谧青',
    primary: '#14B8A6',
    hover: '#0D9488',
    bg: 'bg-teal-25',
    text: 'text-gray-800',
    shadow: 'shadow-lg',
    buttonText: 'text-white',
    buttonShadow: 'shadow-lg',
    buttonRounded: 'rounded-lg',
    inputBg: 'bg-white',
    inputBorder: 'border-gray-300',
    inputText: 'text-gray-700',
    messageUserBg: 'bg-teal-100',
    messageAssistantBg: 'bg-teal-50',
    border: 'border-gray-200',
  },
  {
    id: 'neutral',
    name: '素雅灰',
    primary: '#6B7280',
    hover: '#4B5563',
    bg: 'bg-gray-25',
    text: 'text-gray-800',
    shadow: 'shadow-lg',
    buttonText: 'text-white',
    buttonShadow: 'shadow-lg',
    buttonRounded: 'rounded-lg',
    inputBg: 'bg-white',
    inputBorder: 'border-gray-300',
    inputText: 'text-gray-700',
    messageUserBg: 'bg-gray-200',
    messageAssistantBg: 'bg-gray-100',
    border: 'border-gray-200',
  },
  {
    id: 'pastel',
    name: '柔和粉彩',
    primary: '#EC4899',
    hover: '#DB2777',
    bg: 'bg-pink-25',
    text: 'text-gray-800',
    shadow: 'shadow-lg',
    buttonText: 'text-white',
    buttonShadow: 'shadow-lg',
    buttonRounded: 'rounded-lg',
    inputBg: 'bg-white',
    inputBorder: 'border-gray-300',
    inputText: 'text-gray-700',
    messageUserBg: 'bg-pink-100',
    messageAssistantBg: 'bg-pink-50',
    border: 'border-gray-200',
  },
];

interface ThemeSettingsProps {
  onClose: () => void;
}

const models = [
  { id: 'gpt-3.5-turbo', name: 'GPT-3.5 Turbo' },
  { id: 'gpt-4', name: 'GPT-4' },
  { id: 'claude-2', name: 'Claude 2' },
];

export const ThemeSettings: React.FC<ThemeSettingsProps> = ({ onClose }) => {
  const { updateTheme, theme: currentTheme } = useThemeContext();
  const [selectedModel, setSelectedModel] = useState({ id: 'gpt-3.5-turbo', name: 'GPT-3.5 Turbo' });
  const modalRef = useRef<HTMLDivElement>(null);

  const handleModelChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = models.find(model => model.id === e.target.value);
    if (selected) {
      setSelectedModel(selected);
    }
  };

  const handleThemeChange = (themeOption: typeof themes[0]) => {
    console.log('Updating theme to:', themeOption);
    updateTheme(themeOption);
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose();
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);

  return (
    <motion.div
      ref={modalRef}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      className="bg-white rounded-lg shadow-lg p-4 w-80 border border-gray-200"
      onClick={(e) => e.stopPropagation()}
    >
      <h3 className="text-sm font-medium text-gray-900 mb-3">模型选择</h3>
      <div className="mb-4">
        <select
          value={selectedModel.id}
          onChange={handleModelChange}
          className="w-full p-2 border border-gray-300 rounded-md text-sm"
        >
          {models.map((model) => (
            <option key={model.id} value={model.id}>
              {model.name}
            </option>
          ))}
        </select>
      </div>
      <h3 className="text-sm font-medium text-gray-900 mb-3">主题选择</h3>
      <div className="flex space-x-2">
        {themes.map((themeOption) => (
          <motion.div
            key={themeOption.id}
            onClick={() => handleThemeChange(themeOption)}
            className={clsx(
              'w-8 h-8 rounded-md cursor-pointer transition-shadow',
              { 'shadow-md': currentTheme.id === themeOption.id }
            )}
            style={{ backgroundColor: themeOption.primary }}
          />
        ))}
      </div>
    </motion.div>
  );
}; 