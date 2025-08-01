'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';

interface CodeEntryProps {
  onCodeSubmit?: (code: string) => void;
}

export default function CodeEntry({ onCodeSubmit }: CodeEntryProps) {
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  useEffect(() => {
    // Load saved room code from localStorage
    const savedCode = localStorage.getItem('stickyNotes_lastRoomCode');
    if (savedCode && validateCodeFormat(savedCode)) {
      setCode(savedCode);
    }
    
    // Focus input on mount
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const validateCodeFormat = (code: string): boolean => {
    return /^[A-Z0-9]{6}$/.test(code.toUpperCase());
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '');
    if (value.length <= 6) {
      setCode(value);
      // Clear error when user starts typing
      if (error) {
        setError('');
      }
      
      // Show validation feedback
      if (value.length > 0 && value.length < 6) {
        setError('');
      } else if (value.length === 6) {
        setError('');
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!code.trim()) {
      setError('Please enter a room code');
      return;
    }

    if (!validateCodeFormat(code)) {
      setError('Room code must be 6 alphanumeric characters');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/rooms/validate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          code: code.toUpperCase(),
          createIfNotExists: true 
        }),
      });

      const data = await response.json();

      if (data.valid) {
        // Save to localStorage
        localStorage.setItem('noteSpace_lastRoomCode', code.toUpperCase());
        
        if (onCodeSubmit) {
          onCodeSubmit(code.toUpperCase());
        } else {
          router.push(`/room/${code.toUpperCase()}`);
        }
      } else {
        setError(data.error || 'Invalid room code');
      }
    } catch (error) {
      console.error('Code validation error:', error);
      setError('Connection error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const generateRandomCode = async () => {
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/rooms/validate');
      const data = await response.json();
      
      if (data.code) {
        setCode(data.code);
        setError(''); // Clear any existing errors
        
        // Auto-submit the generated code after a short delay
        setTimeout(async () => {
          // Validate and navigate directly
          try {
            const validateResponse = await fetch('/api/rooms/validate', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ 
                code: data.code,
                createIfNotExists: true 
              }),
            });

            const validateData = await validateResponse.json();
            
            if (validateData.valid) {
              localStorage.setItem('noteSpace_lastRoomCode', data.code);
              router.push(`/room/${data.code}`);
            } else {
              setError('Failed to create room');
            }
          } catch (error) {
            console.error('Room creation error:', error);
            setError('Failed to create room');
          } finally {
            setIsLoading(false);
          }
        }, 800);
      } else {
        setError('Failed to generate room code');
      }
    } catch (error) {
      console.error('Code generation error:', error);
      setError('Failed to generate room code');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="text-6xl mb-4">📝</div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">
            Sticky Notes
          </h1>
          <p className="text-slate-600">
            Enter a room code to access your shared sticky notes
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="roomCode" className="sr-only">
              Room Code
            </label>
            <input
              ref={inputRef}
              id="roomCode"
              type="text"
              value={code}
              onChange={handleInputChange}
              placeholder="ENTER CODE"
              className={`w-full px-6 py-4 text-2xl font-mono text-center uppercase tracking-widest rounded-lg border-2 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
                error
                  ? 'border-red-300 bg-red-50 text-red-900 placeholder-red-400'
                  : 'border-slate-200 bg-white text-slate-900 placeholder-slate-400 hover:border-slate-300'
              }`}
              maxLength={6}
              disabled={isLoading}
              aria-describedby={error ? 'code-error' : undefined}
            />
            {error && (
              <p id="code-error" className="mt-2 text-sm text-red-600" role="alert">
                {error}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading || !code.trim()}
            className="w-full py-4 px-6 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                Joining Room...
              </div>
            ) : (
              'Join Room'
            )}
          </button>
        </form>

        <div className="mt-6 text-center">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-slate-50 text-slate-500">or</span>
            </div>
          </div>
          
          <button
            onClick={generateRandomCode}
            disabled={isLoading}
            className="mt-4 text-indigo-600 hover:text-indigo-700 font-medium transition-colors duration-200 focus:outline-none focus:underline disabled:text-slate-400 disabled:cursor-not-allowed"
          >
            Create New Room
          </button>
        </div>

        <div className="mt-8 text-center text-xs text-slate-500">
          <p>Room codes are 6 alphanumeric characters</p>
          <p className="mt-1">Share your code with others to collaborate</p>
        </div>
      </div>
    </div>
  );
}