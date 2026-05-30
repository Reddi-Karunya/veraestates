/** Raw cost fields stored in DB or edited in admin */
export type CostBreakdownInput = {
  owner_price: number;
  registration_cost: number;
  legal_verification_cost: number;
  platform_fee: number;
  miscellaneous_cost: number;
};

/** Fully computed breakdown for display */
export type CostBreakdownComputed = CostBreakdownInput & {
  property_id: string;
  total_cost: number;
};

export type CostLineItemKey =
  | "owner_price"
  | "registration_cost"
  | "legal_verification_cost"
  | "platform_fee"
  | "miscellaneous_cost";

export type CostLineItem = {
  key: CostLineItemKey;
  label: string;
  amount: number;
  highlight?: boolean;
};
