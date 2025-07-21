import React from "react";
import ReactDOM from "react-dom/client";
import "./Polyfills";
import Rainbowkit from "./Rainbowkit.jsx";
import { ThemeProvider } from "styled-components";
import ThemeStyles from "./assets/styles/ThemeStyles";
import GlobalStyles from "./assets/styles/GlobalStyles";
import { AlchemyAccountProvider } from "@alchemy/aa-react";
import { lightAccountClient } from "@alchemy/aa-alchemy";
import { sepolia } from "viem/chains";
import { AuthProvider } from './contexts/AuthContext';
import { UserProvider } from './contexts/UserContext';
import PresaleContextProvider from "./contexts/PresaleContextProvider.jsx";
import ModalContextProvider from "./contexts/ModalContextProvider.jsx";
import App from "./App.jsx";

// bootstrap css
import "bootstrap/dist/css/bootstrap.min.css";

// slick css
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <AlchemyAccountProvider
      config={{
        apiKey: "YOUR_ALCHEMY_API_KEY", // Replace with your Alchemy API key
        chain: sepolia,
        client: lightAccountClient,
      }}
    >
      <Rainbowkit>
        <ThemeProvider theme={ThemeStyles}>
          <GlobalStyles />
          <AuthProvider>
            <UserProvider>
              <PresaleContextProvider>
                <ModalContextProvider>
                  <App />
                </ModalContextProvider>
              </PresaleContextProvider>
            </UserProvider>
          </AuthProvider>
        </ThemeProvider>
      </Rainbowkit>
    </AlchemyAccountProvider>
  </React.StrictMode>
);
