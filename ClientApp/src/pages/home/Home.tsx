import { Box } from "@material-ui/core";
import React, { useContext } from "react";
import { GameLayout } from "src/components/game/GameLayout";
import { GameContext } from "src/infrastructure/GameContextProvider";

export const Home = () => {
  const game = useContext(GameContext);
  //const [next, setNext] = useState(false);
  //const [previous, setPrevious] = useState(false);

  return (
    <Box mt={3}>
      <GameLayout></GameLayout>

      <pre>{JSON.stringify(game.connections, null, 5)}</pre>
    </Box>
  );
};
