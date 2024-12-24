'use client';
import React from 'react';


import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from '@/components/ui/Table';

interface Transaction {
  transaction_id: string;
  created_at: string;
  transaction_type: 'CREDIT' | 'DEBIT';
  amount: string;
  transaction_status: string;
  transaction_category: string;
}

interface TransactionTableProps {
  transactions: Transaction[];
  onTransactionClick?: (transaction: Transaction) => void;
}

export function TransactionTable({ transactions, onTransactionClick }: TransactionTableProps) {
  const handleRowClick = (transaction: Transaction) => {
    if (onTransactionClick) {
      onTransactionClick(transaction);
    }
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Date</TableHead>
          <TableHead>Type</TableHead>
          <TableHead>Amount</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Category</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {transactions.map((transaction) => (
          <TableRow 
            key={transaction.transaction_id}
            onClick={() => handleRowClick(transaction)}
            className="cursor-pointer"
          >
            <TableCell>
              {new Date(transaction.created_at).toLocaleDateString()}
            </TableCell>
            <TableCell>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                transaction.transaction_type === 'CREDIT' 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-red-100 text-red-800'
              }`}>
                {transaction.transaction_type}
              </span>
            </TableCell>
            <TableCell>
              ₦{Math.abs(parseFloat(transaction.amount)).toLocaleString()}
            </TableCell>
            <TableCell>{transaction.transaction_status}</TableCell>
            <TableCell>{transaction.transaction_category}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}