import React, { useContext, useEffect, useState } from "react";
import AppBar from "@material-ui/core/AppBar";
import { createStyles, Theme, makeStyles, useTheme } from "@material-ui/core/styles";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import { LeftMenu } from "../leftMenu/LeftMenu";
import { Box, Fab, Typography } from "@material-ui/core";
import { useLocation } from "react-router";
import DarkModeIcon from "@material-ui/icons/Brightness4";
import LightModeIcon from "@material-ui/icons/Brightness5";
import HomeIcon from "@material-ui/icons/Home";
import { ThemeContext } from "src/infrastructure/ThemeContextProvider";
import { NavLink } from "react-router-dom";
import { SignalrContext, SignalRStatus } from "src/infrastructure/SignalrContextProvider";
import { ReconnectSignalr } from "./ReconnectSignalr";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { GameContext } from "src/infrastructure/GameContextProvider";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    text: {
      padding: theme.spacing(2, 2, 0),
    },
    paper: {
      paddingBottom: 50,
    },
    list: {
      marginBottom: theme.spacing(2),
    },
    subheader: {
      backgroundColor: theme.palette.background.paper,
    },
    appBar: {
      top: "auto",
      bottom: 0,
    },
    grow: {
      flexGrow: 1,
    },
    fabButton: {
      position: "absolute",
      zIndex: 1,
      top: -40,
      left: 0,
      right: 0,
      margin: "0 auto",
    },
  })
);
const heartSizes = ["15px", "16px", "17px", "18px", "19px", "20px", "19px", "18px", "17px", "16px", "15px"];
const heartSizesLength = heartSizes.length;

export const Footer = () => {
  const classes = useStyles();
  const theme = useTheme();
  const themeContext = useContext(ThemeContext);
  const signalr = useContext(SignalrContext);
  const game = useContext(GameContext);

  const [heartSizeIdx, setHeartSizeIdx] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setHeartSizeIdx((curr) => {
        return curr + 1 < heartSizesLength ? curr + 1 : 0;
      });
    }, 100);
    return () => clearInterval(timer);
  }, []);

  let location = useLocation();

  const Displayheart = () => {
    if (signalr.status === SignalRStatus.Connected) {
      return <FontAwesomeIcon icon="heartbeat" style={{ color: "#dc004e", fontSize: heartSizes[heartSizeIdx] }} fixedWidth />;
    }
    return <FontAwesomeIcon icon="heart-broken" size="lg" fixedWidth spin={true} />;
  };

  return (
    <div className={classes.grow}>
      <AppBar position="fixed" color="primary" className={classes.appBar}>
        <ReconnectSignalr />
        <Toolbar>
          <LeftMenu />
          <Displayheart />
          <Box ml={2}>
            <Typography>{signalr.status !== SignalRStatus.Connected ? signalr.status.toString() : ""}</Typography>
            {signalr.status === SignalRStatus.Connected && <Typography>{game.state}</Typography>}
          </Box>

          <div className={classes.grow} />

          {location.pathname !== "/" && (
            <Fab color="secondary" aria-label="add" className={classes.fabButton} component={NavLink} to="/">
              <HomeIcon />
            </Fab>
          )}
          <IconButton onClick={themeContext.toggleMode}>
            {theme.palette.type === "light" && <LightModeIcon />}
            {theme.palette.type === "dark" && <DarkModeIcon />}
          </IconButton>
        </Toolbar>
      </AppBar>
    </div>
  );
};
