'use client';
import React, { useState } from 'react';
import { TransactionModal } from './TransactionModal';
import type { ApiTransaction } from '@/types/transactions';

import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from '@/components/ui/Table';

interface TransactionTableProps {
  transactions: ApiTransaction[];
}

export const TransactionTable = ({ transactions }: TransactionTableProps) => {
  const [showTransactionModal, setShowTransactionModal] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<ApiTransaction | null>(null);

  const handleTransactionClick = (transaction: ApiTransaction) => {
    setSelectedTransaction(transaction);
    setShowTransactionModal(true);
  };

  const truncateDescription = (desc: string) => {
    return desc.length > 30 ? desc.substring(0, 27) + '...' : desc;
  };

  return (
    <>
      <div className="bg-white rounded-lg flex flex-col h-[500px]">
        <div className="p-4 lg:p-3 border-b">
          <h2 className="text-lg lg:text-base font-medium">Transactions</h2>
        </div>
        <div className="relative">
          <div className="sticky top-0 bg-white z-10">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[120px]">Date</TableHead>
                  <TableHead className="w-[100px]">Type</TableHead>
                  <TableHead className="w-[120px]">Amount</TableHead>
                  <TableHead className="w-[100px]">Status</TableHead>
                  <TableHead className="w-[200px]">Description</TableHead>
                  <TableHead className="w-[100px]">Provider</TableHead>
                </TableRow>
              </TableHeader>
            </Table>
          </div>
          <div className="overflow-auto h-[400px]">
            <Table>
              <TableBody>
                {transactions.map((tx: ApiTransaction) => (
                  <TableRow 
                    key={tx.transaction_id}
                    onClick={() => handleTransactionClick(tx)}
                    className="cursor-pointer"
                  >
                    <TableCell className="w-[120px]">
                      {new Date(tx.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="w-[100px]">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        tx.transaction_type === 'CREDIT' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {tx.transaction_type}
                      </span>
                    </TableCell>
                    <TableCell className="w-[120px]">
                      ₦{Math.abs(parseFloat(tx.amount)).toLocaleString()}
                    </TableCell>
                    <TableCell className="w-[100px]">
                      {tx.transaction_status}
                    </TableCell>
                    <TableCell className="w-[200px]">
                      {truncateDescription(tx.description)}
                    </TableCell>
                    <TableCell className="w-[100px]">
                      {tx.payment_provider}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>

      {selectedTransaction && (
        <TransactionModal
          isOpen={showTransactionModal}
          onClose={() => setShowTransactionModal(false)}
          transaction={selectedTransaction}
        />
      )}
    </>
  );
};