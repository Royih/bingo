import React, { useState, useEffect, useContext } from "react";
import { HubConnectionBuilder, HubConnection, LogLevel } from "@microsoft/signalr";
import { ApiContext } from "./ApiContextProvider";

export type SignalRState = {
  status: SignalRStatus;
  reconnect(): void;
  invoke<T>(methodName: string, args: any): Promise<T>;
  connectedSince: Date | null;
  disconnectedSince: Date | null;
  hubConnection: HubConnection | undefined;
};
export enum SignalRStatus {
  Pending = "Pending",
  Connected = "Connected",
  Error = "Error",
  Reconnecting = "Reconnecting",
}
const SignalRComHubPath = process.env.REACT_APP_API_PATH + "/comhub";
const SignalrContext = React.createContext({} as SignalRState);
export { SignalrContext }; // Export it so it can be used by other Components

export const SignalrContextProvider = (props: any) => {
  const invoke = async (methodName: string, args: any) => {
    return hubConnection?.invoke(methodName, args);
  };
  const api = useContext(ApiContext);
  const [status, setStatus] = useState<SignalRStatus>(SignalRStatus.Pending);
  const [hubConnection, setHubConnection] = useState<HubConnection>();
  const [connectedSince, setConnectedSince] = useState<Date | null>(null);
  const [disconnectedSince, setDisconnectedSince] = useState<Date | null>(new Date());
  const [reconnecto, setReconnecto] = useState(false);

  const reconnect = () => {
    console.log("Reconnecting...");
    setStatus(SignalRStatus.Reconnecting);
    setReconnecto((currentState) => {
      return !currentState;
    });
  };

  useEffect(() => {
    const doStart = async () => {
      return await createHubConnection();
    };

    // Set the initial SignalR Hub Connection.
    const createHubConnection = async () => {
      // Trying to auto-reconnect SignalR trying n-times with increasing intervals
      const reconnectIntervals: number[] = [2000, 5000, 10000, 12000, 15000, 20000, 25000, 30000, 45000];

      // Build new Hub Connection, url is currently hard coded.
      const hubConnection = new HubConnectionBuilder().withUrl(SignalRComHubPath).withAutomaticReconnect(reconnectIntervals).configureLogging(LogLevel.Information).build();

      setHubConnection(hubConnection);

      hubConnection.onclose(() => {
        setStatus(SignalRStatus.Error);
        setConnectedSince(null);
        setDisconnectedSince(new Date());
      });

      hubConnection.onreconnecting(() => {
        setStatus(SignalRStatus.Reconnecting);
        setConnectedSince(null);
        setDisconnectedSince(new Date());
      });

      hubConnection.onreconnected(() => {
        setStatus(SignalRStatus.Connected);
        setConnectedSince(new Date());
        setDisconnectedSince(null);
      });

      try {
        await hubConnection.start();
        console.debug("Connection successful!");
        setStatus(SignalRStatus.Connected);
        setConnectedSince(new Date());
        setDisconnectedSince(null);
      } catch (err) {
        console.error("Signalr error: ", err);
        setStatus(SignalRStatus.Error);
      }

      return () => {
        console.debug("Cleanup Signalr");
        if (hubConnection) {
          hubConnection.off("Heartbeat");
          hubConnection.off("DeviceChanged");
          hubConnection.stop();
        }
      };
    };

    doStart();
  }, [api, reconnecto]);

  return (
    <SignalrContext.Provider
      value={{
        status: status,
        reconnect: reconnect,
        invoke: invoke,
        connectedSince: connectedSince,
        disconnectedSince: disconnectedSince,
        hubConnection: hubConnection,
      }}
    >
      {props.children}
    </SignalrContext.Provider>
  );
};
