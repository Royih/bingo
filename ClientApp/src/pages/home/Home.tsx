import { Button, Paper } from "@material-ui/core";
import React, { useState } from "react";
import { Board } from "src/components/board/Board";

export const Home = () => {
  const [next, setNext] = useState(false);
  const [previous, setPrevious] = useState(false);

  return (
    <Paper>
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
    </Paper>
  );
};
