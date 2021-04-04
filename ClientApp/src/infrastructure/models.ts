export interface CommandResultDto<T> {
  success: boolean;
  errorMessages: string[];
  messages: string[];
  data: T;
}

export interface IDropdownValue {
  key: any;
  value: string;
}

export type KeyValueDto = {
  key: string;
  value: string;
};
