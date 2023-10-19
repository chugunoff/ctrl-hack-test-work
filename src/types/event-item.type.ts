export type EventItem = {
  id: number;
  event: 'updated by user' | 'cleared' | 'recalculated' | 'try sending' | 'success sending' | 'error sending';
  fields: string;
  newValue: string;
  oldValue: string | null;
};
