import React from "react";
import { useUserContext } from "./userContext/userContext";
import Auth from "./userContext/auth";
import YoutubePage from "./pages/YoutubePage";

function App() {
  const { displayName, user, loading, error } = useUserContext();

  return (
    <div className="App" style={{height:"100%"}}>
      {loading ? <h2 style={{ color: "#FAFAFA" }}>Loading...</h2> : <> {displayName != "Preregistered" ? <YoutubePage /> : <Auth />} </>}
    </div>
  );
}

export default App;