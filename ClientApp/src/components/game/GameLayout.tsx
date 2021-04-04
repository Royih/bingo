import React, { useContext, useState } from "react";
import { Button, Container } from "@material-ui/core";
import { GameContext, GameStates } from "src/infrastructure/GameContextProvider";
import { TellUsYourName } from "./TellUsYourName";
import { PickOrCreateGame } from "./PickOrCreateGame";
import { Board } from "./Board";

export const GameLayout = () => {
  const game = useContext(GameContext);

  const [next, setNext] = useState(false);
  const [previous, setPrevious] = useState(false);

  if (game.state === GameStates.Nameless) {
    return <TellUsYourName></TellUsYourName>;
  }
  if (game.state === GameStates.NotInGame) {
    return <PickOrCreateGame></PickOrCreateGame>;
  }
  if (game.state === GameStates.Setup) {
    return (
      <>
        <Board next={next} previous={previous}></Board>
        <Button
          variant="outlined"
          color="primary"
          onClick={() => {
            setPrevious((curr) => {
              return !curr;
            });
          }}
        >
          Prev
        </Button>
        <Button
          variant="outlined"
          color="primary"
          onClick={() => {
            setNext((curr) => {
              return !curr;
            });
          }}
        >
          Next
        </Button>
      </>
    );
  }
  return (
    <div>
      <Container>Hello wolrd</Container>
    </div>
  );
};
