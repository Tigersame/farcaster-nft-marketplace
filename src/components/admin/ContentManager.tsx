'use client';

import React, { useState } from 'react';
import { useAdmin } from '@/contexts/AdminContext';
import type { OwnedContent } from '@/contexts/AdminContext';

export default function ContentManager() {
  const { 
    currentAdmin, 
    ownedContent, 
    createContent, 
    updateContent, 
    deleteContent, 
    getContentByType,
    canModifyContent,
    createBackup,
    restoreBackup 
  } = useAdmin();
  
  const [activeContentType, setActiveContentType] = useState<OwnedContent['type']>('nft');
  const [isCreating, setIsCreating] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showBackup, setShowBackup] = useState(false);

  const contentTypes: { type: OwnedContent['type']; label: string; icon: string }[] = [
    { type: 'nft', label: 'NFTs', icon: '🖼️' },
    { type: 'collection', label: 'Collections', icon: '📂' },
    { type: 'theme', label: 'Themes', icon: '🎨' },
    { type: 'setting', label: 'Settings', icon: '⚙️' },
    { type: 'feed_item', label: 'Feed Items', icon: '📡' },
  ];

  const filteredContent = getContentByType(activeContentType);

  const handleCreate = async (formData: any) => {
    try {
      await createContent(activeContentType, formData.title, formData);
      setIsCreating(false);
    } catch (error) {
      console.error('Error creating content:', error);
    }
  };

  const handleUpdate = async (id: string, formData: any) => {
    try {
      await updateContent(id, formData);
      setEditingId(null);
    } catch (error) {
      console.error('Error updating content:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this content?')) {
      try {
        await deleteContent(id);
      } catch (error) {
        console.error('Error deleting content:', error);
      }
    }
  };

  const handleBackup = () => {
    const backupData = createBackup();
    const blob = new Blob([backupData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `admin-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleRestore = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const text = await file.text();
      await restoreBackup(text);
      alert('Backup restored successfully!');
    } catch (error) {
      console.error('Error restoring backup:', error);
      alert('Failed to restore backup. Please check the file format.');
    }
  };

  if (!currentAdmin) {
    return (
      <div className="p-6 text-center">
        <p className="text-gray-600 dark:text-gray-400">Please log in to manage content.</p>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Content Management</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage your created content and track ownership
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={handleBackup}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            📥 Backup Data
          </button>
          <label className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors cursor-pointer">
            📤 Restore Backup
            <input
              type="file"
              accept=".json"
              onChange={handleRestore}
              className="hidden"
            />
          </label>
        </div>
      </div>

      {/* Content Type Tabs */}
      <div className="flex space-x-1 bg-gray-100 dark:bg-gray-800 p-1 rounded-lg">
        {contentTypes.map((type) => (
          <button
            key={type.type}
            onClick={() => setActiveContentType(type.type)}
            className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeContentType === type.type
                ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            {type.icon} {type.label}
          </button>
        ))}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="text-2xl font-bold text-gray-900 dark:text-white">
            {ownedContent.length}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Total Content</div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="text-2xl font-bold text-green-600">
            {ownedContent.filter(c => c.isActive).length}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Active Items</div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="text-2xl font-bold text-blue-600">
            {filteredContent.length}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            {contentTypes.find(t => t.type === activeContentType)?.label}
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="text-2xl font-bold text-purple-600">
            {new Set(ownedContent.map(c => c.ownership.createdBy)).size}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Contributors</div>
        </div>
      </div>

      {/* Create New Button */}
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
          {contentTypes.find(t => t.type === activeContentType)?.label} ({filteredContent.length})
        </h2>
        <button
          onClick={() => setIsCreating(true)}
          className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
        >
          ➕ Create New {contentTypes.find(t => t.type === activeContentType)?.label.slice(0, -1)}
        </button>
      </div>

      {/* Content List */}
      <div className="space-y-4">
        {filteredContent.length === 0 ? (
          <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
            <div className="text-4xl mb-4">📝</div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No {contentTypes.find(t => t.type === activeContentType)?.label} Yet
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Create your first {contentTypes.find(t => t.type === activeContentType)?.label.toLowerCase()} to get started.
            </p>
            <button
              onClick={() => setIsCreating(true)}
              className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              Create {contentTypes.find(t => t.type === activeContentType)?.label.slice(0, -1)}
            </button>
          </div>
        ) : (
          filteredContent.map((content) => (
            <div
              key={content.id}
              className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700"
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    {content.title}
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600 dark:text-gray-400">
                    <div>
                      <strong>Created:</strong> {new Date(content.ownership.createdAt).toLocaleDateString()}
                    </div>
                    <div>
                      <strong>Updated:</strong> {new Date(content.ownership.updatedAt).toLocaleDateString()}
                    </div>
                    <div>
                      <strong>Version:</strong> {content.ownership.version}
                    </div>
                    <div>
                      <strong>Owner:</strong> {content.ownership.createdBy === currentAdmin.id ? 'You' : content.ownership.createdBy}
                    </div>
                  </div>
                  
                  {/* Content Preview */}
                  <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-md">
                    <pre className="text-xs text-gray-600 dark:text-gray-400 overflow-x-auto">
                      {JSON.stringify(content.data, null, 2).slice(0, 200)}
                      {JSON.stringify(content.data, null, 2).length > 200 ? '...' : ''}
                    </pre>
                  </div>
                </div>
                
                <div className="ml-4 flex gap-2">
                  {canModifyContent(content.id) && (
                    <>
                      <button
                        onClick={() => setEditingId(content.id)}
                        className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors"
                      >
                        ✏️ Edit
                      </button>
                      <button
                        onClick={() => handleDelete(content.id)}
                        className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700 transition-colors"
                      >
                        🗑️ Delete
                      </button>
                    </>
                  )}
                  <span className={`px-2 py-1 text-xs rounded ${
                    content.isActive 
                      ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                      : 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
                  }`}>
                    {content.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Create/Edit Modal */}
      {(isCreating || editingId) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              {isCreating ? 'Create' : 'Edit'} {contentTypes.find(t => t.type === activeContentType)?.label.slice(0, -1)}
            </h3>
            
            <form onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.target as HTMLFormElement);
              const data = Object.fromEntries(formData.entries());
              
              if (isCreating) {
                handleCreate(data);
              } else if (editingId) {
                handleUpdate(editingId, data);
              }
            }}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Title
                  </label>
                  <input
                    type="text"
                    name="title"
                    required
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    placeholder="Enter title..."
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Description
                  </label>
                  <textarea
                    name="description"
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    placeholder="Enter description..."
                  />
                </div>
                
                {activeContentType === 'nft' && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Price (ETH)
                      </label>
                      <input
                        type="number"
                        name="price"
                        step="0.01"
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        placeholder="0.00"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Image URL
                      </label>
                      <input
                        type="url"
                        name="imageUrl"
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        placeholder="https://..."
                      />
                    </div>
                  </>
                )}
              </div>
              
              <div className="flex justify-end gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => {
                    setIsCreating(false);
                    setEditingId(null);
                  }}
                  className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                >
                  {isCreating ? 'Create' : 'Update'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}