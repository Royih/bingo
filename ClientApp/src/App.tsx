import React from "react";
import "./App.css";
import { ThemeContextProvider } from "./infrastructure/ThemeContextProvider";
import { CssBaseline } from "@material-ui/core";
import { Counter } from "./pages/functionDemo/Counter";
import { SnackbarProvider } from "notistack";
import { Layout } from "./components/Layout";
import { Home } from "./pages/home/Home";
import { Route } from "react-router";
import { Footer } from "./pages/footer/Footer";
import { ApiContextProvider } from "./infrastructure/ApiContextProvider";
import { UserContextProvider } from "./infrastructure/UserContextProvider";
import { FetchData } from "./pages/functionDemo/FetchData";
import { Users } from "./components/users/Users";
import { EditUserProfile } from "./components/users/EditUserProfile";
import { ThrowExceptions } from "./pages/functionDemo/TestExceptions";
import { SignalrContextProvider } from "./infrastructure/SignalrContextProvider";
import { TestSignalR } from "./pages/functionDemo/TestSignalR";
import { Login } from "./components/Login";
import { library } from "@fortawesome/fontawesome-svg-core";
import {
  faBatteryHalf,
  faBug,
  faCaretSquareDown,
  faChevronCircleRight,
  faClipboardList,
  faCog,
  faDoorClosed,
  faDoorOpen,
  faHeartbeat,
  faHome,
  faLightbulb,
  faMehBlank,
  faQuestionCircle,
  fas,
  faSatelliteDish,
  faSun,
  faToggleOff,
  faToggleOn,
  faTrash,
  faUserLock,
  faUsers,
  faVolumeDown,
  faVolumeUp,
  faSyncAlt,
  faHeartBroken,
  faUnlink,
} from "@fortawesome/free-solid-svg-icons";
library.add(
  fas,
  faSatelliteDish,
  faClipboardList,
  faHome,
  faUsers,
  faBatteryHalf,
  faChevronCircleRight,
  faDoorOpen,
  faDoorClosed,
  faVolumeUp,
  faVolumeDown,
  faSun,
  faToggleOn,
  faToggleOff,
  faLightbulb,
  faQuestionCircle,
  faMehBlank,
  faBug,
  faTrash,
  faCog,
  faUserLock,
  faHeartbeat,
  faCaretSquareDown,
  faSyncAlt,
  faHeartbeat,
  faHeartBroken,
  faUnlink
);

function App() {
  return (
    <ApiContextProvider>
      <UserContextProvider>
        <SignalrContextProvider>
          <ThemeContextProvider>
            <CssBaseline />
            <SnackbarProvider maxSnack={10}>
              <Layout>
                <Route exact path="/" component={Home} />
                <Route exact path="/counter" component={Counter} />
                <Route exact path="/fetch-data" component={FetchData} />
                <Route exact path="/throw-exceptions" component={ThrowExceptions} />
                <Route exact path="/users" component={Users} />
                <Route path="/user/create" component={EditUserProfile} />
                <Route path="/users/:id" component={EditUserProfile} />
                <Route path="/test-signalr" component={TestSignalR} />
                <Route path="/login" component={Login} />
              </Layout>
              <Footer />
            </SnackbarProvider>
          </ThemeContextProvider>
        </SignalrContextProvider>
      </UserContextProvider>
    </ApiContextProvider>
  );
}

export default App;
