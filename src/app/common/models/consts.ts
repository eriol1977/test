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

export const YES_NO: SelectOption[] = [
  { value: 'Y', label: 'Yes' },
  { value: 'N', label: 'No' },
];

export const TABLES: SelectOption[] = [
  { value: 'assetLocation', label: 'ASSET LOCATIONS' },
  { value: 'classification', label: 'CLASSIFICATIONS' },
  { value: 'component', label: 'COMPONENTS' },
  { value: 'componentProblem', label: 'COMPONENT PROBLEMS' },
  { value: 'problem', label: 'PROBLEMS' },
  { value: 'personnel', label: 'PERSONNEL' },
  { value: 'workRequest', label: 'WORK REQUESTS' },
];
