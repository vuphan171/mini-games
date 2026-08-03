export interface CreateCustomerPayload {
  storeID: string;
  customerName: string;
  email: string;
  phone: string;
  score?: number;
  result?: string;
  playDuration?: number;
}
