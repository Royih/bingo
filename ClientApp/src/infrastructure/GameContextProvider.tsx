import React, { useContext, useEffect, useState } from "react";
import { ConnectionDto, ConnectionsModifiedMsg, GameDto, GameListModifiedMsg } from "./models";
import { SignalrContext } from "./SignalrContextProvider";

export enum GameStates {
  Nameless = "Enter name",
  NotInGame = "Not in a game",
  Setup = "Setup",
  Ready = "Ready",
  Playing = "Playing",
  Complete = "Complete",
}

export type GameContextState = {
  playerName: string | undefined;
  state: GameStates;
  games: GameDto[];
  connections: ConnectionDto[];
  setState(newState: GameStates): void;
  applyPlayerName(playerName: string): void;
  addGame(name: string): void;
  joinGame(id: string): void;
};

const GameContext = React.createContext({} as GameContextState); // Create a context object

export { GameContext };

export const GameContextProvider = (props: any) => {
  const signalr = useContext(SignalrContext);
  const [state, setState] = useState(GameStates.Nameless);
  const [playerName, setPlayerName] = useState<string>();
  const [games, setGames] = useState([] as GameDto[]);
  const [connections, setConnections] = useState([] as ConnectionDto[]);

  const hubConn = signalr.hubConnection;

  useEffect(() => {
    if (hubConn) {
      hubConn.on("GameListModified", (msg: GameListModifiedMsg) => {
        setGames(msg.games);
      });
      hubConn.on("ConnectionsModified", (msg: ConnectionsModifiedMsg) => {
        setConnections(msg.connections);
      });
    }
    return () => {
      console.debug("Cleanup Signalr");
      if (hubConn) {
        hubConn.off("GameListModified");
      }
    };
  }, [hubConn]);

  const addGame = (name: string) => {
    signalr.hubConnection?.invoke("AddGame", { name: name });
  };
  const joinGame = (gameId: string) => {
    signalr.hubConnection?.invoke("JoinGame", { gameId: gameId }).then((res) => {
      setState(GameStates.Setup);
    });
  };

  const applyPlayerName = (playerName: string) => {
    setPlayerName(playerName);
    //ToDo: Also save player-name in local-storage
    //Send message to allow mapping of connection-id with player-name
    hubConn?.invoke("RegisterPlayerName", { playerName: playerName });
    setState(GameStates.NotInGame);
  };

  return (
    <GameContext.Provider
      value={{
        playerName: playerName,
        state: state,
        games: games,
        connections: connections,
        applyPlayerName: applyPlayerName,
        setState: setState,
        addGame: addGame,
        joinGame: joinGame,
      }}
    >
      {props.children}
    </GameContext.Provider>
  );
};
