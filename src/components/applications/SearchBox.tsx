import React, { useState } from 'react';
import { Search, X, Command, Mic, Filter } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Card, CardContent } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface SearchBoxProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  inputClassName?: string;
  showFilterButton?: boolean;
  showKeyboardShortcut?: boolean;
  showVoiceSearch?: boolean;
  onFilterClick?: () => void;
  recentSearches?: string[];
  onRecentSearchClick?: (search: string) => void;
  variant?: 'default' | 'minimal' | 'pill' | 'withCard';
  size?: 'sm' | 'md' | 'lg';
}

/**
 * Enhanced SearchBox component using shadcn/ui Input with additional features
 */
const SearchBox = ({
  value,
  onChange,
  placeholder = 'Search...',
  className = '',
  inputClassName = '',
  showFilterButton = false,
  showKeyboardShortcut = false,
  showVoiceSearch = false,
  onFilterClick,
  recentSearches = [],
  onRecentSearchClick,
  variant = 'default',
  size = 'md',
}: SearchBoxProps) => {
  const [isFocused, setIsFocused] = useState(false);
  const [showRecent, setShowRecent] = useState(false);

  // Size configurations
  const sizeConfig = {
    sm: { height: 'h-8', text: 'text-xs', iconSize: 14, clearSize: 12 },
    md: { height: 'h-10', text: 'text-sm', iconSize: 16, clearSize: 14 },
    lg: { height: 'h-12', text: 'text-base', iconSize: 18, clearSize: 16 },
  };

  // Get container classes based on variant
  const containerClasses = {
    default: 'rounded-lg border border-input',
    minimal: 'border-0 shadow-none bg-transparent',
    pill: 'rounded-full',
    withCard: '',
  };

  // Handle clear button click
  const handleClear = () => {
    onChange('');
  };

  // Main search input component
  const searchInput = (
    <div
      className={cn('relative flex items-center overflow-hidden bg-background', containerClasses[variant], className)}
    >
      {/* Left search icon */}
      <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
        <Search
          size={sizeConfig[size].iconSize}
          className={cn('text-muted-foreground transition-colors duration-200', isFocused && 'text-primary')}
        />
      </div>

      {/* Search input */}
      <Input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={cn(
          sizeConfig[size].height,
          sizeConfig[size].text,
          'pl-10 pr-10 border-0 shadow-none focus-visible:ring-0 bg-transparent',
          variant === 'pill' && 'rounded-full',
          inputClassName
        )}
        onFocus={() => {
          setIsFocused(true);
          setShowRecent(true);
        }}
        onBlur={() => {
          setIsFocused(false);
          setTimeout(() => setShowRecent(false), 200);
        }}
      />

      {/* Right side actions */}
      <div className="absolute inset-y-0 right-3 flex items-center gap-1.5">
        {/* Clear button */}
        {value && (
          <ActionButton
            icon={<X size={sizeConfig[size].clearSize} />}
            onClick={handleClear}
            tooltip="Clear"
            size={size}
          />
        )}

        {/* Voice search */}
        {showVoiceSearch && !value && (
          <ActionButton icon={<Mic size={sizeConfig[size].clearSize} />} tooltip="Search with voice" size={size} />
        )}

        {/* Filter */}
        {showFilterButton && (
          <ActionButton
            icon={<Filter size={sizeConfig[size].clearSize} />}
            onClick={onFilterClick}
            tooltip="Filter results"
            size={size}
          />
        )}

        {/* Keyboard shortcut */}
        {showKeyboardShortcut && !value && (
          <Badge variant="outline" className="gap-1 border border-input bg-background text-muted-foreground">
            <Command size={12} />
            <span>K</span>
          </Badge>
        )}
      </div>

      {/* Recent searches dropdown */}
      {showRecent && recentSearches.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 z-10 opacity-0 animate-in fade-in slide-in-from-top-1 duration-200 fill-mode-forwards">
          <Card className="overflow-hidden">
            <CardContent className="p-1.5">
              <div className="text-xs font-medium text-muted-foreground p-2">Recent Searches</div>
              <div className="max-h-48 overflow-auto">
                {recentSearches.map((search, index) => (
                  <Button
                    key={index}
                    variant="ghost"
                    className="w-full justify-start text-sm h-9 px-2 py-1"
                    onClick={() => {
                      if (onRecentSearchClick) {
                        onRecentSearchClick(search);
                      } else {
                        onChange(search);
                      }
                      setShowRecent(false);
                    }}
                  >
                    <Search size={14} className="mr-2 text-muted-foreground" />
                    {search}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );

  // If variant is withCard, wrap in Card component
  if (variant === 'withCard') {
    return (
      <Card className={cn('overflow-hidden', className)}>
        <CardContent className="p-0">{searchInput}</CardContent>
      </Card>
    );
  }

  return searchInput;
};

// Reusable action button component with tooltip
interface ActionButtonProps {
  icon: React.ReactNode;
  onClick?: () => void;
  tooltip?: string;
  size: 'sm' | 'md' | 'lg';
}

const ActionButton = ({ icon, onClick, tooltip, size }: ActionButtonProps) => {
  const sizeClasses = {
    sm: 'h-5 w-5',
    md: 'h-6 w-6',
    lg: 'h-7 w-7',
  };

  const button = (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      onClick={onClick}
      className={cn(
        sizeClasses[size],
        'rounded-full opacity-70 hover:opacity-100 hover:bg-muted transition-all duration-150'
      )}
    >
      {icon}
    </Button>
  );

  if (tooltip) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>{button}</TooltipTrigger>
          <TooltipContent>
            <p>{tooltip}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return button;
};

// Demo component with examples
const SearchBoxExamples = () => {
  const [searchValue, setSearchValue] = useState('');
  const recentSearches = [
    'Dashboard analytics',
    'User management',
    'System settings',
    'Performance reports',
    'Resource allocation',
  ];

  return (
    <div className="space-y-8 p-6 max-w-2xl mx-auto">
      <div>
        <h2 className="text-lg font-medium mb-2">Default Search</h2>
        <SearchBox
          value={searchValue}
          onChange={setSearchValue}
          showKeyboardShortcut
          recentSearches={recentSearches}
          placeholder="Search applications..."
        />
      </div>

      <div>
        <h2 className="text-lg font-medium mb-2">Pill Variant with Voice & Filter</h2>
        <SearchBox
          value={searchValue}
          onChange={setSearchValue}
          variant="pill"
          showVoiceSearch
          showFilterButton
          size="lg"
          placeholder="Search anything..."
          recentSearches={recentSearches}
        />
      </div>

      <div>
        <h2 className="text-lg font-medium mb-2">Minimal Variant</h2>
        <SearchBox
          value={searchValue}
          onChange={setSearchValue}
          variant="minimal"
          size="sm"
          placeholder="Quick search..."
        />
      </div>

      <div>
        <h2 className="text-lg font-medium mb-2">Card Variant</h2>
        <SearchBox
          value={searchValue}
          onChange={setSearchValue}
          variant="withCard"
          showKeyboardShortcut
          placeholder="Search in card..."
          recentSearches={recentSearches}
          showFilterButton
        />
      </div>
    </div>
  );
};

export { SearchBoxExamples };
export default SearchBox;
