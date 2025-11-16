import React, { useState, useEffect, useRef } from 'react';

// Define country interface
interface Country {
  code: string;
  name: string;
  dialCode: string;
  example: string;
}

// Define props interface
interface PhoneInputProps {
  value?: string;
  onChange?: (fullPhoneNumber: string) => void;
  error?: string;
  label?: string;
  disabled?: boolean;
  className?: string;
}

const PhoneInput: React.FC<PhoneInputProps> = ({
  value = '',
  onChange,
  error,
  label = "Phone Number",
  disabled = false,
  className = ''
}) => {
  // Country data
  const countries: Country[] = [
    { code: 'EG', name: 'Egypt', dialCode: '+20', example: '10 123 4567' },
    { code: 'US', name: 'United States', dialCode: '+1', example: '201 555 0123' },
    { code: 'GB', name: 'United Kingdom', dialCode: '+44', example: '7911 123456' },
    { code: 'CA', name: 'Canada', dialCode: '+1', example: '204 555 0199' },
    { code: 'DE', name: 'Germany', dialCode: '+49', example: '151 23456789' },
    { code: 'FR', name: 'France', dialCode: '+33', example: '6 12 34 56 78' },
    { code: 'JP', name: 'Japan', dialCode: '+81', example: '90-1234-5678' },
    { code: 'IN', name: 'India', dialCode: '+91', example: '98765 43210' },
  ];

  const [selectedCountry, setSelectedCountry] = useState<Country>(countries[0]);
  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Initialize from value prop
  useEffect(() => {
    if (value) {
      // Extract country code and phone number from full value
      const dialCodeMatch = value.match(/^\+[0-9]+/);
      if (dialCodeMatch) {
        const dialCode = dialCodeMatch[0];
        const country = countries.find(c => c.dialCode === dialCode);
        if (country) {
          setSelectedCountry(country);
          setPhoneNumber(value.substring(dialCode.length).replace(/\D/g, ''));
        } else {
          setPhoneNumber(value.replace(/\D/g, ''));
        }
      } else {
        setPhoneNumber(value.replace(/\D/g, ''));
      }
    }
  }, [value]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Handle country selection
  const handleCountrySelect = (country: Country) => {
    setSelectedCountry(country);
    setIsDropdownOpen(false);
    
    const newFullNumber = country.dialCode + phoneNumber;
    onChange?.(newFullNumber);
  };

  // Handle phone number change
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value;
    // Extract only digits from formatted value
    const digitsOnly = rawValue.replace(/\D/g, '');
    setPhoneNumber(digitsOnly);
    
    const newFullNumber = selectedCountry.dialCode + digitsOnly;
    onChange?.(newFullNumber);
  };

  // Format phone number based on country
  const formatPhoneNumber = (num: string): string => {
    if (!num) return '';
    
    switch (selectedCountry.code) {
      case 'EG':
        return num.replace(/(\d{3})(\d{3})(\d{4})/, '$1 $2 $3');
      case 'US':
      case 'CA':
        return num.replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3');
      case 'GB':
        return num.replace(/(\d{4})(\d{6})/, '$1 $2');
      case 'DE':
        return num.replace(/(\d{3})(\d{3})(\d{4,6})/, '$1 $2 $3');
      case 'FR':
        return num.replace(/(\d{1})(\d{2})(\d{2})(\d{2})(\d{2})/, '$1 $2 $3 $4 $5');
      case 'JP':
        return num.replace(/(\d{3})(\d{4})(\d{4})/, '$1-$2-$3');
      case 'IN':
        return num.replace(/(\d{5})(\d{5})/, '$1 $2');
      default:
        return num.replace(/(\d{3})(\d)/, '$1 $2').replace(/(\d{3})\s(\d{3})\s?(\d)/, '$1 $2 $3');
    }
  };

  // Get country flag emoji
  const getFlagEmoji = (countryCode: string): string => {
    const codePoints = countryCode
      .toUpperCase()
      .split('')
      .map(char => 127397 + char.charCodeAt(0));
    return String.fromCodePoint(...codePoints);
  };

  return (
    <div className={`w-full ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          {label}
        </label>
      )}
      
      <div className="relative flex gap-3 " ref={dropdownRef}>
        {/* Country selector */}
            <div className="relative flex">
              <button
                type="button"
                onClick={() => !disabled && setIsDropdownOpen(!isDropdownOpen)}
                disabled={disabled}
                className={`
                  absolute left-0 top-0 h-full px-3 py-3 flex items-center gap-2 
                  bg-gray-50 dark:bg-gray-700 border-r border-gray-300 dark:border-gray-600 
                  rounded-l-lg text-gray-700 dark:text-gray-300 
                  hover:bg-gray-100 dark:hover:bg-gray-600 
                  focus:outline-none focus:ring-1 focus:ring-blue-500
                  z-10 transition-colors
                  ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
                `}
              >
                <span className="text-lg">{getFlagEmoji(selectedCountry.code)}</span>
                <span>{selectedCountry.dialCode}</span>
                <svg 
                  className={`w-4 h-4 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* Dropdown */}
              {isDropdownOpen && !disabled && (
                <div className="absolute left-0 top-full mt-1 w-64 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg z-20 max-h-60 overflow-y-auto">
                  <div className="p-2">
                    {countries.map((country) => (
                      <button
                        key={country.code}
                        type="button"
                        onClick={() => handleCountrySelect(country)}
                        className={`
                          w-full flex items-center gap-3 px-3 py-2 rounded-md text-left 
                          transition-colors
                          ${selectedCountry.code === country.code 
                            ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300' 
                            : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                          }
                        `}
                      >
                        <span className="text-lg">{getFlagEmoji(country.code)}</span>
                        <div className="flex-1 min-w-0">
                          <div className="font-medium truncate">{country.name}</div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">{country.dialCode}</div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
  
        {/* Phone input */}
        <input
          type="tel"
          value={formatPhoneNumber(phoneNumber)}
          onChange={handlePhoneChange}
          placeholder={`e.g. ${selectedCountry.example}`}
          disabled={disabled}
          className={`
            w-full pl-24 pr-4 px-10 py-3 border rounded-lg
            focus:ring-2 focus:ring-blue-500 focus:border-blue-500
            dark:bg-gray-700 dark:border-gray-600 dark:text-white
            transition-colors
            ${disabled 
              ? 'bg-gray-100 dark:bg-gray-600 cursor-not-allowed' 
              : 'bg-white dark:bg-gray-700'
            }
            ${error ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'}
          `}
        />

      </div>

      {/* Helper text */}
      <div className="mt-1 flex justify-between text-sm">
        <div className="text-gray-500 dark:text-gray-400">
          Enter your mobile number without country code
        </div>
        {error && <div className="text-red-600">{error}</div>}
      </div>
    </div>
  );
};
export default PhoneInput;