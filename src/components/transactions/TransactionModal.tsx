'use client';

import React from 'react';
import { Dialog } from '@/components/ui/Dialog';
import { Copy, Check } from 'lucide-react';
import { useState } from 'react';
import type { ApiTransaction } from '@/types/transactions';

interface TransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  transaction: ApiTransaction | null;
}

export const TransactionModal = ({ isOpen, onClose, transaction }: TransactionModalProps) => {
  if (!transaction) return null;

  const [copiedField, setCopiedField] = useState<string | null>(null);

  const handleCopy = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const isCredit = transaction.transaction_type === 'CREDIT';
  const amountColor = isCredit ? 'text-green-600' : 'text-red-600';
  const amountPrefix = isCredit ? '+' : '-';

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      title="Transaction Details"
    >
      <div className="px-4 py-6">
        <div className="text-center mb-6">
          <p className={`text-3xl font-extrabold ${amountColor}`}>
            {amountPrefix}₦{Math.abs(parseFloat(transaction.amount)).toLocaleString()}
          </p>
          <p className="text-sm text-gray-600 mt-2">
            {new Date(transaction.created_at).toLocaleString()}
          </p>
        </div>
        <div className="grid grid-cols-2 gap-6">
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-sm font-medium text-gray-600">Type</p>
            <p className="mt-1 text-sm font-semibold text-gray-900">{transaction.transaction_type}</p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-sm font-medium text-gray-600">Status</p>
            <p className="mt-1 text-sm font-semibold text-gray-900">{transaction.transaction_status}</p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg col-span-2">
            <p className="text-sm font-medium text-gray-600">Description</p>
            <p className="mt-1 text-sm font-semibold text-gray-900 truncate" title={transaction.description}>{transaction.description}</p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg col-span-2">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm font-medium text-gray-600">Provider</p>
                <p className="mt-1 text-sm font-semibold text-gray-900">{transaction.payment_provider}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Balance Before</p>
                <p className="mt-1 text-sm font-semibold text-gray-900">₦{parseFloat(transaction.balance_before).toLocaleString()}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Balance After</p>
                <p className="mt-1 text-sm font-semibold text-gray-900">₦{parseFloat(transaction.balance_after).toLocaleString()}</p>
              </div>
            </div>
          </div>
          {!isCredit && (
            <>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm font-medium text-gray-600">Charge</p>
                <p className="mt-1 text-sm font-semibold text-gray-900">₦{Math.abs(parseFloat(transaction.charge)).toLocaleString()}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm font-medium text-gray-600">Provider Charge</p>
                <p className="mt-1 text-sm font-semibold text-gray-900">₦{parseFloat(transaction.provider_charge).toLocaleString()}</p>
              </div>
            </>
          )}
          {transaction.meta?.data?.beneficiary && (
            <div className="col-span-2 bg-gray-50 p-4 rounded-lg">
              <p className="text-sm font-medium text-gray-600">Beneficiary</p>
              <p className="mt-1 text-sm font-semibold text-gray-900">
                {transaction.meta.data.beneficiary.account_name} - {transaction.meta.data.beneficiary.account_number}
              </p>
            </div>
          )}
          <div className="col-span-2 bg-gray-50 p-4 rounded-lg">
            <p className="text-sm font-medium text-gray-600 mb-2">References</p>
            <div className="space-y-2">
              <div>
                <p className="text-xs text-gray-500">Transaction ID</p>
                <div className="flex items-center gap-2">
                  <p className="text-sm font-semibold text-gray-900 truncate" title={transaction.transaction_id}>
                    {transaction.transaction_id}
                  </p>
                  <button 
                    onClick={() => handleCopy(transaction.transaction_id, 'transaction_id')}
                    className="p-1 hover:bg-gray-200 rounded"
                  >
                    {copiedField === 'transaction_id' ? (
                      <Check className="w-4 h-4 text-green-600" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>
              <div>
                <p className="text-xs text-gray-500">Transaction Reference</p>
                <div className="flex items-center gap-2">
                  <p className="text-sm font-semibold text-gray-900 truncate" title={transaction.transaction_reference}>
                    {transaction.transaction_reference}
                  </p>
                  <button 
                    onClick={() => handleCopy(transaction.transaction_reference, 'transaction_reference')}
                    className="p-1 hover:bg-gray-200 rounded"
                  >
                    {copiedField === 'transaction_reference' ? (
                      <Check className="w-4 h-4 text-green-600" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>
              <div>
                <p className="text-xs text-gray-500">Provider Reference</p>
                <div className="flex items-center gap-2">
                  <p className="text-sm font-semibold text-gray-900 truncate" title={transaction.transaction_reference_provider}>
                    {transaction.transaction_reference_provider}
                  </p>
                  <button 
                    onClick={() => handleCopy(transaction.transaction_reference_provider, 'provider_reference')}
                    className="p-1 hover:bg-gray-200 rounded"
                  >
                    {copiedField === 'provider_reference' ? (
                      <Check className="w-4 h-4 text-green-600" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Dialog>
  );
};