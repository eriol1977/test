import { Status } from './enums';
import { SelectOption } from './types';

export const TIMEZONES: SelectOption[] = [
  { value: '-180', label: 'GMT-03:00' },
  { value: '-120', label: 'GMT-02:00' },
  { value: '-60', label: 'GMT-01:00' },
  { value: '0', label: 'GMT 00:00' },
  { value: '60', label: 'GMT 01:00' },
  { value: '120', label: 'GMT 02:00' },
  { value: '180', label: 'GMT 03:00' },
];

export const STATUSES: SelectOption[] = [
  { value: Status.DRAFT, label: 'DRAFT' },
  { value: Status.COMPLETED, label: 'COMPLETED' },
];
