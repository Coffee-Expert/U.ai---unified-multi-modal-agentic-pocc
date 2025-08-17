import React, { createContext, useContext, useState } from 'react';

const SidebarContext = createContext();

export function SidebarProvider({ children }) {
  const [currentView, setCurrentView] = useState(null);
  const [patchState, setPatchState] = useState(null);
  const [videoMode, setVideoMode] = useState('chat'); // 'chat' or 'multimodal'

  return (
    <SidebarContext.Provider
      value={{ currentView, setCurrentView, patchState, setPatchState, videoMode, setVideoMode }}
    >
      {children}
    </SidebarContext.Provider>
  );
}

export const useSidebarContext = () => useContext(SidebarContext);
