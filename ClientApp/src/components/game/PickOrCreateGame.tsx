import { Button, Paper, Table, TableBody, TableCell, TableHead, TableRow, TextField, Typography } from "@material-ui/core";
import React, { useContext, useState } from "react";
import { GameContext } from "src/infrastructure/GameContextProvider";
import { GameDto } from "src/infrastructure/models";
import { Confirm } from "../common/Confirm";

export const PickOrCreateGame = () => {
  const game = useContext(GameContext);
  const [doCreate, setDoCreate] = useState(false);
  const [newGameName, setNewGameName] = useState("");

  const allowProceed = (): boolean => {
    return newGameName.length > 0;
  };
  const handleCreate = () => {
    game.addGame(newGameName);
    setDoCreate(false);
  };

  return (
    <>
      <Button variant="contained" color="primary" onClick={() => setDoCreate(true)}>
        Opprett nytt spill
      </Button>

      <Paper>
        {game.games && game.games.length === 0 && <Typography>Ingen spill opprettet. Klikk på knappen for å lage ett</Typography>}
        {game.games && game.games.length > 0 && (
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Navn</TableCell>
                <TableCell>Laget av</TableCell>
                <TableCell>Players</TableCell>
                <TableCell></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {game.games &&
                game.games.map((myGame: GameDto) => (
                  <TableRow key={myGame.id}>
                    <TableCell>{myGame.name}</TableCell>
                    <TableCell>{myGame.createdByName}</TableCell>
                    <TableCell>{myGame.players}</TableCell>
                    <TableCell>
                      <Button color="primary" variant="contained" onClick={() => game.joinGame(myGame.id)}>
                        Bli med
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        )}
      </Paper>

      <Confirm show={doCreate} title="Opprett nytt spill" proceedButtonText="Fortsett" onProceedClick={handleCreate} onCancelClick={() => setDoCreate(false)} allowProceedClick={allowProceed()}>
        <TextField id="new-game-name" label="Navn på spill" variant="outlined" onChange={(ev) => setNewGameName(ev.currentTarget.value)} />
      </Confirm>
    </>
  );
};
