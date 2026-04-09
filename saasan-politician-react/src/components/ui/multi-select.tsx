import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, X } from 'lucide-react';
import { Button } from './button';
import { Badge } from './badge';

interface MultiSelectOption {
  label: string;
  value: string;
}

interface MultiSelectProps {
  options: MultiSelectOption[];
  value: string[];
  onValueChange: (value: string[]) => void;
  placeholder?: string;
  className?: string;
  popoverClassName?: string;
  disabled?: boolean;
}

export const MultiSelect: React.FC<MultiSelectProps> = ({
  options,
  value,
  onValueChange,
  placeholder = 'Select options...',
  className = '',
  popoverClassName = '',
  disabled = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);

  const filteredOptions = options.filter(option =>
    option.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const selectedOptions = options.filter(option => value.includes(option.value));

  const handleToggle = (optionValue: string) => {
    const newValue = value.includes(optionValue)
      ? value.filter(v => v !== optionValue)
      : [...value, optionValue];
    onValueChange(newValue);
  };

  const handleClear = () => {
    onValueChange([]);
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      <Button
        type="button"
        variant="outline"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className="w-full justify-between text-left font-normal"
      >
        <div className="flex items-center gap-2 flex-1 min-w-0">
          {selectedOptions.length === 0 ? (
            <span className="text-gray-500">{placeholder}</span>
          ) : (
            <div className="flex items-center gap-1 flex-wrap">
              {selectedOptions.slice(0, 3).map(option => (
                <Badge key={option.value} variant="secondary" className="text-xs">
                  {option.label}
                </Badge>
              ))}
              {selectedOptions.length > 3 && (
                <Badge variant="secondary" className="text-xs">
                  +{selectedOptions.length - 3} more
                </Badge>
              )}
            </div>
          )}
        </div>
        <div className="flex items-center gap-2">
          {selectedOptions.length > 0 && (
            <X
              className="h-4 w-4 hover:text-gray-700"
              onClick={(e) => {
                e.stopPropagation();
                handleClear();
              }}
            />
          )}
          <ChevronDown className="h-4 w-4 shrink-0" />
        </div>
      </Button>

      {isOpen && (
        <div className={`absolute top-full left-0 right-0 z-50 mt-1 bg-white border rounded-lg shadow-lg ${popoverClassName}`}>
          <div className="p-2 border-b">
            <input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 text-sm border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
          <div className="max-h-60 overflow-y-auto p-2">
            {filteredOptions.length === 0 ? (
              <div className="text-gray-500 text-sm text-center py-2">
                No options found
              </div>
            ) : (
              filteredOptions.map(option => (
                <div
                  key={option.value}
                  className="flex items-center p-2 hover:bg-gray-100 rounded cursor-pointer"
                  onClick={() => handleToggle(option.value)}
                >
                  <input
                    type="checkbox"
                    checked={value.includes(option.value)}
                    onChange={() => {}}
                    className="mr-2"
                  />
                  <span className="text-sm">{option.label}</span>
                </div>
              ))
            )}
          </div>
          {filteredOptions.length > 0 && (
            <div className="p-2 border-t flex justify-between">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onValueChange([])}
              >
                Clear All
              </Button>
              <Button
                size="sm"
                onClick={() => onValueChange(filteredOptions.map(o => o.value))}
              >
                Select All
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
