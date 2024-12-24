'use client';
import React from 'react';


import { Toaster as HotToaster } from 'react-hot-toast';

export function Toaster() {
  return (
    <HotToaster
      position="top-right"
      reverseOrder={false}
      gutter={8}
      containerClassName=""
      containerStyle={{}}
      toastOptions={{
        // Default options for specific types
        success: {
          duration: 3000,
          style: {
            background: '#EFFDF5',
            color: '#0F766E',
            border: '1px solid #6EE7B7',
          },
        },
        error: {
          duration: 3000,
          style: {
            background: '#FEF2F2',
            color: '#991B1B',
            border: '1px solid #FECACA',
          },
        },
        loading: {
          duration: 3000,
          style: {
            background: '#F3F4F6',
            color: '#1F2937',
            border: '1px solid #E5E7EB',
          },
        },
        // Default options for all toasts
        className: '',
        style: {
          maxWidth: '500px',
          padding: '16px',
          borderRadius: '8px',
        },
      }}
    />
  );
}