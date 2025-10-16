import React, { useState, useMemo, useRef } from 'react';
import { PasswordEntry } from './types';
import { useLocalStorage } from './hooks/useLocalStorage';
import { PasswordForm } from './components/PasswordForm';
import { PasswordList } from './components/PasswordList';
import { LockIcon, SearchIcon, SaveDataIcon, LoadDataIcon, CheckIcon } from './components/Icons';

function App() {
  const [entries, setEntries] = useLocalStorage<PasswordEntry[]>('password-entries', []);
  const [searchQuery, setSearchQuery] = useState('');
  const [editingEntry, setEditingEntry] = useState<PasswordEntry | null>(null);
  const [saveState, setSaveState] = useState<'idle' | 'saving' | 'saved'>('idle');
  const [loadState, setLoadState] = useState<'idle' | 'loading' | 'loaded'>('idle');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const addEntry = (entry: Omit<PasswordEntry, 'id'>) => {
    const newEntry = { ...entry, id: crypto.randomUUID() };
    setEntries([...entries, newEntry]);
  };
  
  const updateEntry = (updatedEntry: PasswordEntry) => {
    setEntries(entries.map(entry => (entry.id === updatedEntry.id ? updatedEntry : entry)));
    setEditingEntry(null); // Esci dalla modalità di modifica
  };

  const deleteEntry = (id: string) => {
    setEntries(entries.filter(entry => entry.id !== id));
    if (editingEntry && editingEntry.id === id) {
      setEditingEntry(null); // Se stiamo eliminando la voce in modifica, esci dalla modalità modifica
    }
  };
  
  const handleStartEdit = (entry: PasswordEntry) => {
    setEditingEntry(entry);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelEdit = () => {
    setEditingEntry(null);
  };

  const filteredEntries = useMemo(() => {
    return entries.filter(entry =>
      entry.url.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entry.username.toLowerCase().includes(searchQuery.toLowerCase())
    ).sort((a, b) => a.url.localeCompare(b.url));
  }, [entries, searchQuery]);

  const handleSaveToFile = () => {
    if (entries.length === 0) {
      alert("Nessun dato da salvare.");
      return;
    }

    setSaveState('saving');
    try {
      const dataStr = JSON.stringify(entries, null, 2);
      const blob = new Blob([dataStr], { type: 'application/json' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = 'PWSDATA';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(link.href);
      setSaveState('saved');
    } catch (error) {
      console.error("Errore durante il salvataggio dei dati:", error);
      alert("Si è verificato un errore durante il salvataggio dei dati.");
      setSaveState('idle');
    }

    setTimeout(() => setSaveState('idle'), 2000);
  };

  const handleLoadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (entries.length > 0 && !window.confirm("Attenzione: caricando un nuovo file, tutti i dati attuali non salvati verranno sovrascritti. Continuare?")) {
      if (event.target) event.target.value = '';
      return;
    }

    setLoadState('loading');
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target?.result;
        if (typeof text !== 'string') throw new Error('Contenuto del file non valido.');
        
        const data = JSON.parse(text);
        if (!Array.isArray(data) || !data.every(item => 'id' in item && 'url' in item && 'username' in item && 'password' in item)) {
          throw new Error('Il formato del file non è corretto.');
        }
        
        setEntries(data);
        setLoadState('loaded');
      } catch (error) {
        console.error("Errore durante il caricamento dei dati:", error);
        alert(`Errore durante il caricamento: ${error.message}`);
        setLoadState('idle');
      } finally {
        if (event.target) event.target.value = '';
        setTimeout(() => setLoadState('idle'), 2000);
      }
    };
    reader.onerror = () => {
      alert('Impossibile leggere il file.');
      setLoadState('idle');
      if (event.target) event.target.value = '';
    };
    reader.readAsText(file);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 font-sans p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
        <header className="flex flex-col sm:flex-row items-start sm:items-center sm:justify-between mb-8 gap-4">
          <div className="flex items-center space-x-4">
            <div className="bg-indigo-500 p-3 rounded-full">
              <LockIcon className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-white tracking-tight">Cassaforte Password</h1>
              <p className="text-gray-400">La tua cassaforte per password, locale e privata.</p>
            </div>
          </div>
          <div className="flex items-center space-x-2 self-end sm:self-center">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
            />
            <button
              onClick={handleLoadClick}
              disabled={loadState !== 'idle'}
              className={`flex items-center space-x-2 font-semibold py-2 px-4 rounded-lg transition-colors duration-200 ${
                loadState === 'loaded' ? 'bg-green-600 text-white' : 'bg-gray-600 hover:bg-gray-500 text-white'
              }`}
              title="Carica dati da file"
            >
              {loadState === 'loaded' ? <CheckIcon className="h-5 w-5" /> : <LoadDataIcon className="h-5 w-5" />}
              <span>{loadState === 'loaded' ? 'Caricato!' : 'Carica Dati'}</span>
            </button>
            <button
              onClick={handleSaveToFile}
              disabled={saveState !== 'idle'}
              className={`flex items-center space-x-2 font-semibold py-2 px-4 rounded-lg transition-colors duration-200 ${
                saveState === 'saved' ? 'bg-green-600 text-white' : 'bg-indigo-600 hover:bg-indigo-700 text-white'
              }`}
              title="Salva dati in un file"
            >
              {saveState === 'saved' ? <CheckIcon className="h-5 w-5" /> : <SaveDataIcon className="h-5 w-5" />}
              <span>{saveState === 'saved' ? 'Salvato!' : 'Salva Dati'}</span>
            </button>
          </div>
        </header>

        <main className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1 sticky top-8 self-start">
            <PasswordForm 
              onAddEntry={addEntry} 
              onUpdateEntry={updateEntry}
              editingEntry={editingEntry}
              onCancelEdit={handleCancelEdit}
            />
          </div>
          <div className="lg:col-span-2 space-y-6">
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                <SearchIcon className="h-5 w-5 text-gray-400" />
              </span>
              <input
                type="text"
                placeholder="Cerca per sito o nome utente..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-gray-800 border border-gray-700 rounded-md shadow-sm py-2 pl-10 pr-3 text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
            <PasswordList 
              entries={filteredEntries} 
              onDeleteEntry={deleteEntry}
              onEditEntry={handleStartEdit}
            />
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;