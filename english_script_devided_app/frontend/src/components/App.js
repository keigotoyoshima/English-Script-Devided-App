import React from "react";
import { useUserContext } from "./userContext/userContext";
import Auth from "./userContext/auth";
import YoutubePage from "./pages/YoutubePage";

function App() {
  const { displayName, user, loading, error } = useUserContext();

  return (
    <div className="App">
      {/* <p>user.displayName</p> */}
      {error && <p className="error">{error}</p>}
      {loading ? <h2>Loading...</h2> : <> {displayName ? <YoutubePage /> : <Auth />} </>}
    </div>
  );
}

export default App;