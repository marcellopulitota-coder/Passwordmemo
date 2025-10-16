import React, { useState, useEffect } from 'react';
import { PasswordEntry } from '../types';
import { EyeIcon, EyeSlashIcon, CheckIcon } from './Icons';

interface PasswordFormProps {
  onAddEntry: (entry: Omit<PasswordEntry, 'id'>) => void;
  onUpdateEntry: (entry: PasswordEntry) => void;
  editingEntry: PasswordEntry | null;
  onCancelEdit: () => void;
}

export const PasswordForm: React.FC<PasswordFormProps> = ({ onAddEntry, onUpdateEntry, editingEntry, onCancelEdit }) => {
  const [url, setUrl] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [notes, setNotes] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  
  const isEditing = !!editingEntry;

  useEffect(() => {
    if (isEditing) {
      setUrl(editingEntry.url);
      setUsername(editingEntry.username);
      setPassword(editingEntry.password);
      setNotes(editingEntry.notes);
    } else {
      // Pulisci il form quando non si sta modificando
      setUrl('');
      setUsername('');
      setPassword('');
      setNotes('');
    }
    setShowPassword(false);
  }, [editingEntry, isEditing]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!url || !username || !password) {
      alert('Per favore, compila tutti i campi obbligatori.');
      return;
    }
    
    if (isEditing) {
      onUpdateEntry({ ...editingEntry, url, username, password, notes });
    } else {
      onAddEntry({ url, username, password, notes });
      // Pulisci i campi dopo aver salvato una nuova voce
      setUrl('');
      setUsername('');
      setPassword('');
      setNotes('');
      setShowPassword(false);
    }

    setIsSaved(true);
    setTimeout(() => {
      setIsSaved(false);
    }, 2000);
  };
  
  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;
    if (value && !/^https?:\/\//i.test(value)) {
      value = 'https://' + value;
    }
    setUrl(value);
  }

  const getButtonContent = () => {
    if (isSaved) {
      return (
        <>
          <CheckIcon className="h-5 w-5 mr-2" />
          {isEditing ? 'Aggiornato!' : 'Salvato!'}
        </>
      );
    }
    return isEditing ? 'Aggiorna Voce' : 'Salva Voce';
  };

  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4 text-indigo-400">{isEditing ? 'Modifica Voce' : 'Aggiungi Nuova Voce'}</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="url" className="block text-sm font-medium text-gray-300">URL Sito Web</label>
          <input
            id="url"
            type="text"
            placeholder="esempio.com"
            value={url.replace(/^https?:\/\//i, '')}
            onChange={(e) => setUrl(e.target.value)}
            onBlur={handleUrlChange}
            required
            className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>
        <div>
          <label htmlFor="username" className="block text-sm font-medium text-gray-300">Nome Utente / Email</label>
          <input
            id="username"
            type="text"
            placeholder="utente@esempio.com"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-300">Password</label>
          <div className="relative mt-1">
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm pr-10"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 px-3 flex items-center text-gray-400 hover:text-white"
              aria-label={showPassword ? "Nascondi password" : "Mostra password"}
            >
              {showPassword ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
            </button>
          </div>
        </div>
        <div>
          <label htmlFor="notes" className="block text-sm font-medium text-gray-300">Note</label>
          <textarea
            id="notes"
            rows={3}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            placeholder="Domande di sicurezza, codici di recupero, ecc."
          ></textarea>
        </div>
        <div className="space-y-2">
          <button
            type="submit"
            disabled={isSaved}
            className={`w-full flex justify-center items-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white transition-colors duration-200 ${
              isSaved
                ? 'bg-green-600'
                : 'bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 focus:ring-offset-gray-900'
            }`}
          >
            {getButtonContent()}
          </button>
          {isEditing && (
            <button
              type="button"
              onClick={onCancelEdit}
              className="w-full flex justify-center py-2 px-4 border border-gray-500 rounded-md shadow-sm text-sm font-medium text-white bg-gray-600 hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400 focus:ring-offset-gray-900 transition-colors"
            >
              Annulla
            </button>
          )}
        </div>
      </form>
    </div>
  );
};