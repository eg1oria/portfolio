'use client';

import { useState, KeyboardEvent } from 'react';
import { X, Hash } from 'lucide-react';

interface TagInputProps {
  value: string[];
  onChange: (value: string[]) => void;
  placeholder?: string;
}

export function TagInput({ value, onChange, placeholder }: TagInputProps) {
  const [inputValue, setInputValue] = useState('');

  const addTag = (raw: string) => {
    const tags = raw
      .split(',')
      .map((t) => t.trim().toLowerCase())
      .filter((t) => t && !value.includes(t));
    if (tags.length) onChange([...value, ...tags]);
    setInputValue('');
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addTag(inputValue);
    }
    if (e.key === 'Backspace' && !inputValue && value.length) {
      onChange(value.slice(0, -1));
    }
  };

  const removeTag = (tagToRemove: string) => {
    onChange(value.filter((t) => t !== tagToRemove));
  };

  return (
    <div className="group relative">
      <div
        className="
          min-h-[2.75rem] w-full rounded-lg border border-slate-200
          bg-white px-3 py-2 flex flex-wrap gap-1.5 items-center
          focus-within:border-slate-400 focus-within:ring-2 focus-within:ring-slate-100
          transition-all duration-150
        ">
        {value.map((tag) => (
          <span
            key={tag}
            className="
              inline-flex items-center gap-1 px-2 py-0.5
              bg-slate-100 text-slate-700 text-xs font-medium
              rounded-md border border-slate-200
              hover:border-slate-300 hover:bg-slate-200/70
              transition-colors duration-100
            ">
            <Hash className="w-3 h-3 text-slate-400" />
            {tag}
            <button
              type="button"
              onClick={() => removeTag(tag)}
              className="ml-0.5 text-slate-400 hover:text-red-500 transition-colors">
              <X className="w-3 h-3" />
            </button>
          </span>
        ))}
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={() => inputValue.trim() && addTag(inputValue)}
          placeholder={value.length === 0 ? placeholder || 'Введите тег и нажмите Enter...' : ''}
          className="
            flex-1 min-w-[140px] bg-transparent text-sm text-slate-800
            outline-none placeholder:text-slate-400
          "
        />
      </div>
      {value.length > 0 && (
        <p className="mt-1.5 text-xs text-slate-400">
          {value.length} {value.length === 1 ? 'тег' : value.length < 5 ? 'тега' : 'тегов'}
        </p>
      )}
    </div>
  );
}
