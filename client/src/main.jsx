import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import App from "./App.jsx";
import { UserProvider } from "./context/UserContext.jsx";
import {ToastContainer} from 'react-toastify'
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <UserProvider>
        <ToastContainer position="top-right"  autoClose={3000}  hideProgressBar={false}  newestOnTop={false}  closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover theme="colored" />
        <App />
      </UserProvider>
    </BrowserRouter>
  </StrictMode>,
);
