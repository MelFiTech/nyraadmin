'use client';
import React from 'react';


import { useState, useRef, useEffect } from 'react';
import { Modal } from '@/components/ui/Modal';
import axios, { AxiosError } from 'axios';
import html2canvas from 'html2canvas';
import { useAuth } from '@/contexts/AuthContext';
import dynamic from 'next/dynamic';

// Prevent SSR for this component
const EvacuateModalComponent = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const { token } = useAuth();
  const [selectedWallet, setSelectedWallet] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [response, setResponse] = useState<EvacuationResponse | null>(null);
  const [timestamp, setTimestamp] = useState<string>('');
  const responseRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (response) {
      const date = new Date();
      setTimestamp(date.toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        hour12: true
      }));
    }
  }, [response]);

  const handleEvacuate = async () => {
    if (!selectedWallet) return;
    if (!token) {
      setError('You are not authenticated. Please log in again.');
      return;
    }
    
    try {
      setIsLoading(true);
      setError(null);
      
      const { data } = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/funds/evacuate`, 
        {
          from: selectedWallet
        },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          withCredentials: false
        }
      );

      if (data.success) {
        setResponse(data.data);
      } else {
        setError(data.error || 'Failed to evacuate funds');
      }
    } catch (error) {
      console.error('Evacuation failed:', error);
      const axiosError = error as AxiosError<{error: string}>;
      setError(axiosError.response?.data?.error || axiosError.message || 'Failed to evacuate funds');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownloadScreenshot = async () => {
    if (!responseRef.current) return;

    try {
      const canvas = await html2canvas(responseRef.current);
      const image = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.href = image;
      link.download = `evacuation-report-${Date.now()}.png`;
      link.click();
    } catch (error) {
      console.error('Screenshot failed:', error);
    }
  };

  const handleClose = () => {
    setResponse(null);
    setSelectedWallet('');
    setError(null);
    setTimestamp('');
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose}>
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold text-dark">Evacuate Funds</h2>
          <button 
            onClick={handleClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm">
            {error}
          </div>
        )}
        
        {!response ? (
          <>
            <p className="text-gray-600">Select the wallet you want to evacuate funds from:</p>
            
            <select
              className="w-full rounded-md border border-gray-300 p-2"
              value={selectedWallet}
              onChange={(e) => setSelectedWallet(e.target.value)}
            >
              <option value="">Select wallet</option>
              <option value="9psb">9PSB</option>
              <option value="safe_haven">Safe Haven</option>
            </select>

            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={handleEvacuate}
                disabled={!selectedWallet || isLoading}
                className="px-4 py-2 bg-primary text-dark font-bold rounded-md hover:bg-primary/80 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Processing...' : 'Evacuate Funds'}
              </button>
            </div>
          </>
        ) : (
          <div className="space-y-6">
            <div ref={responseRef} className="space-y-6">
              <div className="bg-olive-10 p-6 rounded-lg space-y-3">
                <h3 className="text-lg font-semibold text-dark mb-4">Evacuation Results</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Total Accounts Processed</p>
                    <p className="text-lg font-medium text-dark">{response.total_accounts_processed}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Total Failures</p>
                    <p className="text-lg font-medium text-dark">{response.total_failures}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Total Amount Moved</p>
                    <p className="text-lg font-medium text-dark">₦{response.total_amount_moved.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Total Charges Incurred</p>
                    <p className="text-lg font-medium text-dark">₦{response.total_charges_incured.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Skipped Transactions</p>
                    <p className="text-lg font-medium text-dark">{response.skipped}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Amount Skipped</p>
                    <p className="text-lg font-medium text-dark">₦{response.amount_skipped.toLocaleString()}</p>
                  </div>
                </div>
              </div>

              <div className="bg-olive-10 p-6 rounded-lg">
                <p className="text-sm text-gray-600">Transaction Timestamp</p>
                <p className="text-lg font-medium text-dark">{timestamp}</p>
              </div>
            </div>

            <div className="flex justify-end space-x-3">
              <button
                onClick={handleDownloadScreenshot}
                className="px-4 py-2 bg-primary text-dark font-bold rounded-md hover:bg-primary/80"
              >
                Download Report
              </button>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};

// Export a dynamically imported version that skips SSR
export const EvacuateModal = dynamic(() => Promise.resolve(EvacuateModalComponent), {
  ssr: false
});

// Type definitions
interface EvacuationResponse {
  total_accounts_processed: number;
  total_failures: number;
  total_amount_moved: number;
  total_charges_incured: number;
  skipped: number;
  amount_skipped: number;
}