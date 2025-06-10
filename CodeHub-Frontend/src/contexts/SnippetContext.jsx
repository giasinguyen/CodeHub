import React, { createContext, useContext, useState, useCallback } from 'react';
import { snippetsAPI } from '../services/api';
import toast from 'react-hot-toast';

const SnippetContext = createContext();

export const useSnippet = () => {
  const context = useContext(SnippetContext);
  if (!context) {
    throw new Error('useSnippet must be used within a SnippetProvider');
  }
  return context;
};

export const SnippetProvider = ({ children }) => {
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [lastCreatedSnippet, setLastCreatedSnippet] = useState(null);

  // Trigger a refresh of snippet lists across the app
  const triggerRefresh = useCallback(() => {
    setRefreshTrigger(prev => prev + 1);
  }, []);

  // Set the last created snippet for auto-selection
  const setCreatedSnippet = useCallback((snippet) => {
    setLastCreatedSnippet(snippet);
    triggerRefresh();
  }, [triggerRefresh]);

  // Clear the last created snippet
  const clearCreatedSnippet = useCallback(() => {
    setLastCreatedSnippet(null);
  }, []);

  // Create a new snippet and trigger refresh
  const createSnippet = useCallback(async (snippetData) => {
    try {
      const response = await snippetsAPI.createSnippet(snippetData);
      const newSnippet = response.data;
      
      // Store the created snippet for potential auto-selection
      setCreatedSnippet(newSnippet);
      
      toast.success('Snippet created successfully!');
      return { success: true, data: newSnippet };
    } catch (error) {
      console.error('Error creating snippet:', error);
      const message = error.response?.data?.message || 'Failed to create snippet';
      toast.error(message);
      return { success: false, error: message };
    }
  }, [setCreatedSnippet]);

  // Update a snippet and trigger refresh
  const updateSnippet = useCallback(async (snippetId, snippetData) => {
    try {
      const response = await snippetsAPI.updateSnippet(snippetId, snippetData);
      triggerRefresh();
      toast.success('Snippet updated successfully!');
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Error updating snippet:', error);
      const message = error.response?.data?.message || 'Failed to update snippet';
      toast.error(message);
      return { success: false, error: message };
    }
  }, [triggerRefresh]);

  // Delete a snippet and trigger refresh
  const deleteSnippet = useCallback(async (snippetId) => {
    try {
      await snippetsAPI.deleteSnippet(snippetId);
      triggerRefresh();
      toast.success('Snippet deleted successfully!');
      return { success: true };
    } catch (error) {
      console.error('Error deleting snippet:', error);
      const message = error.response?.data?.message || 'Failed to delete snippet';
      toast.error(message);
      return { success: false, error: message };
    }
  }, [triggerRefresh]);

  const value = {
    refreshTrigger,
    lastCreatedSnippet,
    triggerRefresh,
    setCreatedSnippet,
    clearCreatedSnippet,
    createSnippet,
    updateSnippet,
    deleteSnippet
  };

  return (
    <SnippetContext.Provider value={value}>
      {children}
    </SnippetContext.Provider>
  );
};

export default SnippetProvider;
