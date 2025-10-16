import React, { useState } from 'react';
import { PasswordEntry } from '../types';
import { CopyIcon, TrashIcon, CheckIcon, PencilIcon } from './Icons';
import { COPY_SOUND_DATA_URL } from '../constants';

interface PasswordListItemProps {
  entry: PasswordEntry;
  onDelete: (id: string) => void;
  onEdit: (entry: PasswordEntry) => void;
}

export const PasswordListItem: React.FC<PasswordListItemProps> = ({ entry, onDelete, onEdit }) => {
  const [isCopied, setIsCopied] = useState(false);
  const [showNotes, setShowNotes] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(entry.password);
    const audio = new Audio(COPY_SOUND_DATA_URL);
    audio.volume = 0.5;
    audio.play().catch(e => console.error("Error playing sound:", e));
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };
  
  const getFaviconUrl = (url: string) => {
    try {
      const urlObject = new URL(url);
      return `https://www.google.com/s2/favicons?domain=${urlObject.hostname}&sz=32`;
    } catch (e) {
      return `https://www.google.com/s2/favicons?domain=example.com&sz=32`; // fallback
    }
  };


  return (
    <div className="bg-gray-700/50 p-4 rounded-lg border border-gray-600 transition-shadow hover:shadow-indigo-500/20 hover:shadow-lg">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4 min-w-0">
          <img src={getFaviconUrl(entry.url)} alt="favicon" className="h-8 w-8 rounded-full bg-gray-800 flex-shrink-0"/>
          <div className="min-w-0">
            <a href={entry.url} target="_blank" rel="noopener noreferrer" className="text-lg font-semibold text-white truncate hover:underline" title={entry.url}>{entry.url.replace(/^https?:\/\//i, '')}</a>
            <p className="text-sm text-gray-400 truncate">{entry.username}</p>
          </div>
        </div>
        <div className="flex items-center space-x-2 flex-shrink-0">
          <button
            onClick={handleCopy}
            className={`p-2 rounded-full transition-colors duration-200 ${isCopied ? 'bg-green-500 text-white' : 'bg-indigo-600 hover:bg-indigo-500 text-white'}`}
            aria-label="Copia password"
          >
            {isCopied ? <CheckIcon className="h-5 w-5" /> : <CopyIcon className="h-5 w-5" />}
          </button>
          <button
            onClick={() => onEdit(entry)}
            className="p-2 rounded-full bg-gray-600 hover:bg-blue-500 text-gray-300 hover:text-white transition-colors"
            aria-label="Modifica voce"
          >
            <PencilIcon className="h-5 w-5" />
          </button>
          <button
            onClick={() => onDelete(entry.id)}
            className="p-2 rounded-full bg-gray-600 hover:bg-red-500 text-gray-300 hover:text-white transition-colors"
            aria-label="Elimina voce"
          >
            <TrashIcon className="h-5 w-5" />
          </button>
        </div>
      </div>
      {entry.notes && (
         <div className="mt-4">
         <button onClick={() => setShowNotes(!showNotes)} className="text-sm text-indigo-400 hover:underline">
           {showNotes ? 'Nascondi Note' : 'Mostra Note'}
         </button>
         {showNotes && (
           <p className="mt-2 text-sm text-gray-300 bg-gray-800 p-3 rounded-md whitespace-pre-wrap break-words">{entry.notes}</p>
         )}
       </div>
      )}
    </div>
  );
};