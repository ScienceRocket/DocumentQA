import React, { useState, useEffect, useCallback } from 'react';
import { useApp } from '../context/AppContext';
import { Search, X } from 'lucide-react';
import { SearchInputProps } from '../types';
import './SearchInput.css';

// Debounce hook
function useDebounce(value: string, delay: number): string {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

const SearchInput: React.FC<SearchInputProps> = ({
  value,
  onChange,
  placeholder = "Search...",
  isLoading = false,
}) => {
  const { setSearchQuery, setSearchResults, setSearching, state } = useApp();
  const [localValue, setLocalValue] = useState(value);
  const debouncedValue = useDebounce(localValue, 300);

  // Initialize local value on first mount
  useEffect(() => {
    setLocalValue(value);
  }, []); // Empty dependency array - only run on mount

  // Clear local value when search is cleared externally
  useEffect(() => {
    if (!value) {
      setLocalValue('');
    }
  }, [value]);

  // Perform search when debounced value changes
  useEffect(() => {
    const performSearch = async () => {
      if (debouncedValue.trim()) {
        setSearching(true);
        try {
          // Import the search function here to avoid circular dependencies
          const { searchQAHistory } = await import('../utils/api');
          const results = await searchQAHistory(
            debouncedValue,
            state.qaHistory,
            state.documents
          );
          setSearchResults(results);
        } catch (error) {
          console.error('Search failed:', error);
          setSearchResults([]);
        } finally {
          setSearching(false);
        }
      } else {
        setSearchResults([]);
        setSearching(false);
      }
      setSearchQuery(debouncedValue);
    };

    performSearch();
  }, [debouncedValue, state.qaHistory, state.documents, setSearchQuery, setSearchResults, setSearching]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setLocalValue(newValue);
    onChange(newValue);
  };

  const handleClear = () => {
    setLocalValue('');
    onChange('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape') {
      handleClear();
    }
  };

  return (
    <div className="search-input-container">
      <div className="search-input-wrapper">
        <Search size={16} className="search-icon" />
        <input
          type="text"
          value={localValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="search-input"
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          spellCheck="false"
        />
        {isLoading && <div className="loading search-loading" />}
        {localValue && !isLoading && (
          <button
            type="button"
            onClick={handleClear}
            className="search-clear"
            title="Clear search"
          >
            <X size={14} />
          </button>
        )}
      </div>
    </div>
  );
};

export default SearchInput;
