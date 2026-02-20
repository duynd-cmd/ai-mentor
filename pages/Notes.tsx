import React, { useState } from 'react';
import { useMemory } from '../contexts/MemoryContext';
import { enhanceNote } from '../services/geminiService';
import { Plus, Wand2, Trash2, Check, X } from 'lucide-react';
import { Note } from '../types';

export const Notes: React.FC = () => {
  const { notes, addNote, updateNote, deleteNote, memory, apiKey } = useMemory();
  const [selectedNoteId, setSelectedNoteId] = useState<string | null>(null);
  const [isEnhancing, setIsEnhancing] = useState(false);

  const activeNote = notes.find(n => n.id === selectedNoteId);

  const handleCreate = () => {
    const newNote: Note = {
      id: Date.now().toString(),
      title: 'Ghi chú mới',
      subject: 'Chung',
      content: '',
      tags: [],
      lastEdited: Date.now()
    };
    addNote(newNote);
    setSelectedNoteId(newNote.id);
  };

  const handleEnhance = async (action: 'summarize' | 'simplify' | 'quiz') => {
    if (!activeNote || !apiKey) return;
    setIsEnhancing(true);
    const result = await enhanceNote(activeNote.content, action, memory);
    const newContent = activeNote.content + `\n\n--- AI ${action.toUpperCase()} ---\n${result}`;
    updateNote(activeNote.id, newContent);
    setIsEnhancing(false);
  };

  return (
    <div className="h-[calc(100vh-8rem)] flex gap-6 animate-fade-in relative">
      
      {/* Sidebar List */}
      <div className="w-1/3 bg-white rounded-3xl border border-cream-200 overflow-hidden flex flex-col">
        <div className="p-6 border-b border-cream-100 flex justify-between items-center">
          <h3 className="font-serif text-xl font-bold text-slate-800">Sổ ghi chú</h3>
          <button onClick={handleCreate} className="p-2 bg-slate-800 text-cream-50 rounded-lg hover:bg-slate-700 transition-colors">
            <Plus size={20} />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {notes.length === 0 && <p className="text-center text-slate-400 mt-10">Chưa có ghi chú nào.</p>}
          {notes.map(note => (
            <div 
              key={note.id}
              onClick={() => setSelectedNoteId(note.id)}
              className={`p-4 rounded-xl cursor-pointer transition-all border ${selectedNoteId === note.id ? 'bg-cream-100 border-cream-300' : 'bg-transparent border-transparent hover:bg-cream-50'}`}
            >
              <h4 className="font-bold text-slate-800 truncate">{note.title}</h4>
              <p className="text-xs text-slate-500 mt-1">{new Date(note.lastEdited).toLocaleDateString()}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Editor */}
      <div className="w-2/3 bg-white rounded-3xl border border-cream-200 overflow-hidden flex flex-col shadow-sm">
        {activeNote ? (
          <>
            <div className="p-6 border-b border-cream-100 flex justify-between items-center bg-cream-50/50">
              <input 
                value={activeNote.title}
                onChange={(e) => updateNote(activeNote.id, activeNote.content)} // In real app update title specifically
                className="bg-transparent text-xl font-serif font-bold text-slate-900 focus:outline-none w-full"
                placeholder="Tiêu đề"
              />
              <div className="flex gap-2">
                <div className="relative group">
                   <button className="flex items-center gap-2 px-3 py-1.5 bg-sage-100 text-sage-700 rounded-lg text-sm font-medium hover:bg-sage-200 transition-colors">
                     <Wand2 size={16} /> Công cụ AI
                   </button>
                   <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-xl border border-cream-200 p-2 hidden group-hover:block z-10">
                     <button onClick={() => handleEnhance('summarize')} className="w-full text-left px-3 py-2 hover:bg-cream-50 rounded-lg text-sm">Tóm tắt</button>
                     <button onClick={() => handleEnhance('simplify')} className="w-full text-left px-3 py-2 hover:bg-cream-50 rounded-lg text-sm">Đơn giản hóa</button>
                     <button onClick={() => handleEnhance('quiz')} className="w-full text-left px-3 py-2 hover:bg-cream-50 rounded-lg text-sm">Tạo trắc nghiệm</button>
                   </div>
                </div>
                <button onClick={() => deleteNote(activeNote.id)} className="p-2 text-slate-400 hover:text-red-500 transition-colors">
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
            <textarea 
              className="flex-1 p-8 resize-none focus:outline-none text-slate-700 leading-relaxed font-sans"
              value={activeNote.content}
              onChange={(e) => updateNote(activeNote.id, e.target.value)}
              placeholder="Bắt đầu viết..."
            />
            {isEnhancing && (
               <div className="absolute bottom-4 right-4 bg-slate-800 text-cream-50 px-4 py-2 rounded-full text-sm flex items-center gap-2 animate-pulse">
                 <Wand2 size={14} /> AI đang suy nghĩ...
               </div>
            )}
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-slate-300">
            <Wand2 className="w-16 h-16 mb-4 opacity-50" />
            <p>Chọn hoặc tạo mới ghi chú.</p>
          </div>
        )}
      </div>
    </div>
  );
};