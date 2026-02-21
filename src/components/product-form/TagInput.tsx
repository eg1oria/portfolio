'use client';

import { useState, KeyboardEvent } from 'react';
import { X, Hash } from 'lucide-react';
import '../components.css';
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
    <div>
      <div className="tag-input">
        {value.map((tag) => (
          <span key={tag} className="tag-chip">
            <Hash className="tag-chip__hash" />
            {tag}
            <button type="button" className="tag-chip__remove" onClick={() => removeTag(tag)}>
              <X style={{ width: 12, height: 12 }} />
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
          className="tag-input__field"
        />
      </div>
      {value.length > 0 && (
        <p className="tag-count">
          {value.length} {value.length === 1 ? 'тег' : value.length < 5 ? 'тега' : 'тегов'}
        </p>
      )}
    </div>
  );
}
