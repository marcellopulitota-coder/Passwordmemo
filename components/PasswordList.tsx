import React from 'react';
import { PasswordEntry } from '../types';
import { PasswordListItem } from './PasswordListItem';
import { ExportIcon } from './Icons';

interface PasswordListProps {
  entries: PasswordEntry[];
  onDeleteEntry: (id: string) => void;
  onEditEntry: (entry: PasswordEntry) => void;
}

export const PasswordList: React.FC<PasswordListProps> = ({ entries, onDeleteEntry, onEditEntry }) => {
  
  const escapeCsvField = (field: string) => {
    if (field === null || field === undefined) {
      return '';
    }
    let escaped = field.toString().replace(/"/g, '""');
    if (escaped.search(/("|,|\n)/g) >= 0) {
      escaped = '"' + escaped + '"';
    }
    return escaped;
  };
  
  const handleExport = () => {
    if (entries.length === 0) {
      alert("Nessuna voce da esportare.");
      return;
    }

    const sortedEntries = [...entries].sort((a, b) => a.url.localeCompare(b.url));
    
    const headers = ['URL Sito Web', 'Nome Utente', 'Password', 'Note'];
    const csvContent = [
      headers.join(','),
      ...sortedEntries.map(e => [
        escapeCsvField(e.url),
        escapeCsvField(e.username),
        escapeCsvField(e.password),
        escapeCsvField(e.notes)
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", "password_export.csv");
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-2">
          <h2 className="text-2xl font-bold text-indigo-400">Voci Archiviate</h2>
          {entries.length > 0 && (
            <button 
              onClick={handleExport}
              className="flex items-center space-x-2 bg-gray-600 hover:bg-gray-500 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200"
              title="Esporta tutte le voci visibili in un file CSV"
            >
              <ExportIcon className="h-5 w-5" />
              <span>Esporta in CSV</span>
            </button>
          )}
      </div>

      {entries.length === 0 ? (
        <div className="text-center py-10 px-4 bg-gray-800 rounded-lg">
          <h3 className="text-lg font-medium text-white">Nessuna voce trovata</h3>
          <p className="mt-1 text-sm text-gray-400">
            Aggiungi una nuova voce usando il modulo a sinistra o modifica i filtri di ricerca.
          </p>
        </div>
      ) : (
        entries.map(entry => (
          <PasswordListItem 
            key={entry.id} 
            entry={entry} 
            onDelete={onDeleteEntry}
            onEdit={onEditEntry}
          />
        ))
      )}
    </div>
  );
};