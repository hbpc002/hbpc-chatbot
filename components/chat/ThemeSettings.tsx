import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import clsx from 'clsx';
import { useThemeContext } from '../../contexts/ThemeContext';

export const themes = [
  {
    id: 'default',
    name: '清逸蓝',
    primary: '#4F83C2',
    hover: '#3A6A9A',
    bg: 'bg-blue-50',
    text: 'text-gray-800',
    shadow: 'shadow-lg',
    buttonText: 'text-white',
    buttonShadow: 'shadow-lg',
    buttonRounded: 'rounded-lg',
    inputBg: 'bg-white',
    inputBorder: 'border-gray-300',
    inputText: 'text-gray-700',
    messageUserBg: 'bg-blue-100',
    messageAssistantBg: 'bg-gray-100',
    border: 'border-gray-200',
  },
  {
    id: 'green',
    name: '宁静绿',
    primary: '#6BBF8A',
    hover: '#4DAE6D',
    bg: 'bg-green-50',
    text: 'text-gray-800',
    shadow: 'shadow-lg',
    buttonText: 'text-white',
    buttonShadow: 'shadow-lg',
    buttonRounded: 'rounded-lg',
    inputBg: 'bg-white',
    inputBorder: 'border-gray-300',
    inputText: 'text-gray-700',
    messageUserBg: 'bg-green-100',
    messageAssistantBg: 'bg-gray-100',
    border: 'border-gray-200',
  },
  {
    id: 'purple',
    name: '优雅紫',
    primary: '#A77BCA',
    hover: '#8B5BA1',
    bg: 'bg-purple-50',
    text: 'text-gray-800',
    shadow: 'shadow-lg',
    buttonText: 'text-white',
    buttonShadow: 'shadow-lg',
    buttonRounded: 'rounded-lg',
    inputBg: 'bg-white',
    inputBorder: 'border-gray-300',
    inputText: 'text-gray-700',
    messageUserBg: 'bg-purple-100',
    messageAssistantBg: 'bg-gray-100',
    border: 'border-gray-200',
  },
  {
    id: 'dark',
    name: '深邃黑',
    primary: '#1f2937',
    hover: '#4b5563',
    bg: 'bg-gray-900',
    text: 'text-gray-300',
    shadow: 'shadow-lg',
    buttonText: 'text-white',
    buttonShadow: 'shadow-lg',
    buttonRounded: 'rounded-lg',
    inputBg: 'bg-gray-800',
    inputBorder: 'border-gray-700',
    inputText: 'text-gray-100',
    messageUserBg: 'bg-gray-800',
    messageAssistantBg: 'bg-gray-700',
    border: 'border-gray-200',
  },
  {
    id: 'amber',
    name: '温暖琥珀',
    primary: '#fbbf24',
    hover: '#d97706',
    bg: 'bg-amber-50',
    text: 'text-gray-800',
    shadow: 'shadow-lg',
    buttonText: 'text-white',
    buttonShadow: 'shadow-lg',
    buttonRounded: 'rounded-lg',
    inputBg: 'bg-white',
    inputBorder: 'border-gray-300',
    inputText: 'text-gray-700',
    messageUserBg: 'bg-amber-100',
    messageAssistantBg: 'bg-gray-100',
    border: 'border-gray-200',
  },
  {
    id: 'teal',
    name: '静谧青',
    primary: '#2dd4bf',
    hover: '#14b8a6',
    bg: 'bg-teal-50',
    text: 'text-gray-800',
    shadow: 'shadow-lg',
    buttonText: 'text-white',
    buttonShadow: 'shadow-lg',
    buttonRounded: 'rounded-lg',
    inputBg: 'bg-white',
    inputBorder: 'border-gray-300',
    inputText: 'text-gray-700',
    messageUserBg: 'bg-teal-100',
    messageAssistantBg: 'bg-gray-100',
    border: 'border-gray-200',
  },
  {
    id: 'neutral',
    name: '素雅灰',
    primary: '#9ca3af',
    hover: '#6b7280',
    bg: 'bg-gray-100',
    text: 'text-gray-800',
    shadow: 'shadow-lg',
    buttonText: 'text-white',
    buttonShadow: 'shadow-lg',
    buttonRounded: 'rounded-lg',
    inputBg: 'bg-white',
    inputBorder: 'border-gray-300',
    inputText: 'text-gray-700',
    messageUserBg: 'bg-gray-200',
    messageAssistantBg: 'bg-gray-50',
    border: 'border-gray-200',
  },
  {
    id: 'pastel',
    name: '柔和粉彩',
    primary: '#fbcfe8',
    hover: '#f472b6',
    bg: 'bg-purple-50',
    text: 'text-gray-800',
    shadow: 'shadow-lg',
    buttonText: 'text-white',
    buttonShadow: 'shadow-lg',
    buttonRounded: 'rounded-lg',
    inputBg: 'bg-white',
    inputBorder: 'border-gray-300',
    inputText: 'text-gray-700',
    messageUserBg: 'bg-pink-100',
    messageAssistantBg: 'bg-purple-100',
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