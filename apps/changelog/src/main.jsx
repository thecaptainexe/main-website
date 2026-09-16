import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./style.css";
import { installCursorEffects } from "@captainexe/shared/cursor-effects";
installCursorEffects();
createRoot(document.getElementById("root")).render(<StrictMode><App /></StrictMode>);
