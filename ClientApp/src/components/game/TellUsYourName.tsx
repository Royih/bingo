import { Button, Container, TextField } from "@material-ui/core";
import React, { useContext, useState } from "react";
import { GameContext } from "src/infrastructure/GameContextProvider";

export const TellUsYourName = () => {
  const game = useContext(GameContext);
  const [playerName, setPlayerName] = useState("");

  return (
    <Container>
      <TextField id="new-name" label="Ditt navn" variant="outlined" onChange={(ev) => setPlayerName(ev.currentTarget.value)} />
      <Button variant="contained" color="primary" onClick={() => game.applyPlayerName(playerName)} disabled={playerName.length < 2}>
        Gå videre
      </Button>
    </Container>
  );
};
