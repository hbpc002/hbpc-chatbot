'use client'
import { ThemeProvider } from '@/contexts/ThemeContext';
import React from 'react';
import Chat from '@/components/chat/Chat'

export default function Home() {
  return (
    <ThemeProvider>
      <Chat />
    </ThemeProvider>
  );
} 