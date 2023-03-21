import React from "react";
import { Typography } from "@mui/material";
import { Notice, Setting, VideoPlayer } from "./components";

export default function App() {
  return (
    <div>
      <Typography variant="h3" align="center">
        Vidluxe
      </Typography>
      <VideoPlayer />
      <Setting>
        <Notice />
      </Setting>
    </div>
  );
}
