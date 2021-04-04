import React, { useEffect, useState } from "react";
import { makeStyles, createStyles, Theme, Paper, Grid, Button } from "@material-ui/core";
import { indigo, red } from "@material-ui/core/colors";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
    },
    paper: {
      padding: theme.spacing(2),
      textAlign: "center",
      color: theme.palette.text.secondary,
    },
    board: {
      padding: theme.spacing(2),
      textAlign: "center",
      color: theme.palette.getContrastText(indigo[900]),
      backgroundColor: indigo[700],
    },
    field: {
      padding: theme.spacing(1),
      textAlign: "center",
      color: theme.palette.getContrastText(red[900]),
      backgroundColor: red[700],
      fontSize: "20pt",
      border: "2px solid #fff",
    },
    fieldHeader: {
      padding: theme.spacing(0),
      textAlign: "center",
      color: theme.palette.getContrastText(red[900]),
      backgroundColor: red[700],
      fontSize: "25pt",
      fontWeight: "bolder",
      border: "2px solid #fff",
    },
    fieldDescription: {
      padding: theme.spacing(0),
      textAlign: "center",
      color: theme.palette.getContrastText(red[900]),
      backgroundColor: red[700],
      fontSize: "13pt",
      border: "2px solid #fff",
    },
  })
);

export interface IBoardState {
  next: boolean;
  previous: boolean;
}

const fetchColValue = (col: number) => {
  if (col === 0) {
    return Math.floor(Math.random() * 14) + 1;
  }
  if (col === 1) {
    return Math.floor(Math.random() * 14) + 16;
  }
  if (col === 2) {
    return Math.floor(Math.random() * 14) + 31;
  }
  if (col === 3) {
    return Math.floor(Math.random() * 14) + 46;
  }
  return Math.floor(Math.random() * 14) + 61;
};

const fetchNextColValue = (col: number, except: number[]) => {
  let nuVal = fetchColValue(col);
  while (except.indexOf(nuVal) > -1) {
    nuVal = fetchColValue(col);
  }
  return nuVal;
};

const fetchNewBoard = (): number[][] => {
  const result = [];
  for (let col = 0; col < 5; col++) {
    let colValues: number[] = [];
    for (let i = 0; i < 5; i++) {
      colValues.push(fetchNextColValue(col, colValues));
    }
    result.push(colValues);
  }
  return result;
};

export const Board = (props: IBoardState) => {
  const classes = useStyles();
  const [board, setBoard] = useState(fetchNewBoard());

  const [, setBoardHistory] = useState<number[][][] | undefined>();

  const nextClick = props.next;
  useEffect(() => {
    let nuPrevBoard: number[][] | undefined = undefined;
    setBoard((curr) => {
      nuPrevBoard = curr;
      return fetchNewBoard();
    });

    setBoardHistory((curr) => {
      const nu = curr ? [...curr] : [];
      if (nuPrevBoard) {
        nu.push(nuPrevBoard);
      }

      return nu;
    });
  }, [nextClick]);

  const prevClick = props.previous;
  useEffect(() => {
    setBoardHistory((curr) => {
      const nu = curr ? [...curr] : [];
      const prevBoard = nu.pop();
      setBoard((curr) => {
        return prevBoard || curr;
      });
      return nu;
    });
  }, [prevClick]);

  return (
    <Paper className={classes.board}>
      <Grid container spacing={3}>
        <Grid item xs>
          <Button className={classes.fieldHeader}>B</Button>
        </Grid>
        <Grid item xs>
          <Button className={classes.fieldHeader}>I</Button>
        </Grid>
        <Grid item xs>
          <Button className={classes.fieldHeader}>N</Button>
        </Grid>
        <Grid item xs>
          <Button className={classes.fieldHeader}>G</Button>
        </Grid>
        <Grid item xs>
          <Button className={classes.fieldHeader}>O</Button>
        </Grid>
      </Grid>
      <Grid container spacing={3}>
        <Grid item xs>
          <Button className={classes.fieldDescription}>1-15</Button>
        </Grid>
        <Grid item xs>
          <Button className={classes.fieldDescription}>16-30</Button>
        </Grid>
        <Grid item xs>
          <Button className={classes.fieldDescription}>31-45</Button>
        </Grid>
        <Grid item xs>
          <Button className={classes.fieldDescription}>46-60</Button>
        </Grid>
        <Grid item xs>
          <Button className={classes.fieldDescription}>61-75</Button>
        </Grid>
      </Grid>
      {[0, 1, 2, 3, 4].map((column) => (
        <Grid key={"col-" + column} container spacing={3}>
          {board.map((value) => (
            <Grid item xs key={"col-" + column + "-" + value[column]}>
              <Button className={classes.field}>{value[column]}</Button>
            </Grid>
          ))}
        </Grid>
      ))}
    </Paper>
  );
};
