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

export type GameDto = {
  id: string;
  name: string;
  createdByConnectionId: string;
  createdByName: string;
  players: number;
};

export type ConnectionDto = {
  connectionId: string;
  playerName: string;
};

export type GameListModifiedMsg = {
  games: GameDto[];
};
export type ConnectionsModifiedMsg = {
  connections: ConnectionDto[];
};
