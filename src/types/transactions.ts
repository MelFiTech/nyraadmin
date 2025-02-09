export interface ApiTransaction {
  transaction_id: string;
  created_at: string;
  amount: string;
  transaction_status: string;
  description: string;
  payment_provider: string;
  balance_before: string;
  balance_after: string;
  transaction_reference: string;
  transaction_reference_provider: string;
  charge: string;
  provider_charge: string;
  transaction_type: 'CREDIT' | 'DEBIT';
  meta?: {
    data?: {
      beneficiary?: {
        account_name: string;
        account_number: string;
      };
    };
  };
} 