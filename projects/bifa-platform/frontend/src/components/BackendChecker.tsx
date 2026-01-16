"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function BackendChecker() {
  const [status, setStatus] = useState<{
    backend: string;
    football: string;
    auth: string;
  }>({
    backend: 'unchecked',
    football: 'unchecked', 
    auth: 'unchecked'
  });

  const checkBackend = async () => {
    // Check main backend
    try {
      const response = await fetch('http://localhost:5000');
      setStatus(prev => ({ 
        ...prev, 
        backend: response.ok ? 'online' : 'error' 
      }));
    } catch (error) {
      setStatus(prev => ({ ...prev, backend: 'offline' }));
    }

    // Check football API
    try {
      const response = await fetch('http://localhost:5000/api/football/leagues');
      setStatus(prev => ({ 
        ...prev, 
        football: response.ok ? 'online' : 'error' 
      }));
    } catch (error) {
      setStatus(prev => ({ ...prev, football: 'offline' }));
    }

    // Check auth API
    try {
      const response = await fetch('http://localhost:5000/api/test');
      setStatus(prev => ({ 
        ...prev, 
        auth: response.ok ? 'online' : 'error' 
      }));
    } catch (error) {
      setStatus(prev => ({ ...prev, auth: 'offline' }));
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'text-green-600';
      case 'offline': return 'text-red-600';
      case 'error': return 'text-yellow-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Backend Status Checker</CardTitle>
      </CardHeader>
      <CardContent>
        <Button onClick={checkBackend} className="mb-4">
          Check All Services
        </Button>
        
        <div className="space-y-2">
          <div className="flex justify-between">
            <span>Backend Server:</span>
            <span className={getStatusColor(status.backend)}>
              {status.backend}
            </span>
          </div>
          <div className="flex justify-between">
            <span>Football API:</span>
            <span className={getStatusColor(status.football)}>
              {status.football}
            </span>
          </div>
          <div className="flex justify-between">
            <span>Auth API:</span>
            <span className={getStatusColor(status.auth)}>
              {status.auth}
            </span>
          </div>
        </div>

        <div className="mt-4 p-3 bg-gray-100 rounded text-sm">
          <strong>Troubleshooting:</strong>
          <ul className="mt-2 space-y-1">
            <li>• Make sure backend is running: <code>npm run dev</code></li>
            <li>• Check port 5000 is not blocked</li>
            <li>• Verify .env file has FOOTBALL_API_KEY</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}