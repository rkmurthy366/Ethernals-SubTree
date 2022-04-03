import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import { MoralisProvider } from "react-moralis";
import { MantineProvider } from "@mantine/core";
import { NotificationsProvider } from "@mantine/notifications";

const SERVER_URL = process.env.REACT_APP_MORALIS_SERVER_URL;
const APP_ID = process.env.REACT_APP_MORALIS_APP_ID;

ReactDOM.render(
  <React.StrictMode>
    <MoralisProvider serverUrl={SERVER_URL} appId={APP_ID}>
      <MantineProvider>
        <NotificationsProvider>
          <App />
        </NotificationsProvider>
      </MantineProvider>
    </MoralisProvider>
  </React.StrictMode>,
  document.getElementById("root")
);
