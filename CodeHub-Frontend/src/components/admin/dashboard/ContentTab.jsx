import React from 'react';
import { Search, Trash2, Edit } from 'lucide-react';
import { Button, Card } from '../../ui';

const ContentTab = ({ 
  snippets, 
  searchTerm, 
  setSearchTerm, 
  snippetPage, 
  setSnippetPage, 
  handleDeleteSnippet,
  formatDate 
}) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">Content Management</h2>
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search content..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
          </div>
        </div>
      </div>

      <div className="grid gap-4">
        {snippets.content.map(snippet => (
          <Card key={snippet.id} className="bg-slate-800 border-slate-700 p-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-white mb-2">{snippet.title}</h3>
                <p className="text-gray-400 mb-4">{snippet.description}</p>
                <div className="flex items-center space-x-4 text-sm text-gray-400">
                  <span>By {snippet.author}</span>
                  <span>•</span>
                  <span>{formatDate(snippet.createdAt)}</span>
                  <span>•</span>
                  <span>{snippet.language}</span>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  onClick={() => handleDeleteSnippet(snippet.id)}
                  className="bg-red-600 hover:bg-red-700"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
                <Button className="bg-blue-600 hover:bg-blue-700">
                  <Edit className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {snippets.totalPages > 1 && (
        <div className="flex justify-center items-center space-x-4">
          <Button
            onClick={() => setSnippetPage(Math.max(0, snippetPage - 1))}
            disabled={snippetPage === 0}
            className="bg-slate-700 hover:bg-slate-600"
          >
            Previous
          </Button>
          <span className="text-gray-400">
            Page {snippetPage + 1} of {snippets.totalPages}
          </span>
          <Button
            onClick={() => setSnippetPage(Math.min(snippets.totalPages - 1, snippetPage + 1))}
            disabled={snippetPage === snippets.totalPages - 1}
            className="bg-slate-700 hover:bg-slate-600"
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
};

export default ContentTab;
