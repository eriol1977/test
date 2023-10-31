export type AppPage = {
  title: string;
  url: string;
  icon?: string;
};

export type SelectOption = {
  value: string;
  label: string;
  color?: string;
};

export type WorkRequestItem = {
  IDLIST?: string;
  WOREDESCR?: string;
  ASLODESCR?: string;
  COGRDESCR?: string;
  PROBDESCR?: string;
  COLOR?: string;
};

export type DocumentStatus = {
  code: string;
  description: string;
  isCancelled: boolean;
};
