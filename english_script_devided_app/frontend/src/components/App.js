import React from "react";
import { useUserContext } from "./userContext/userContext";
import Auth from "./userContext/auth";
import YoutubePage from "./pages/YoutubePage";

function App() {
  const { user, loading, error } = useUserContext();

  return (
    <div className="App">
      {error && <p className="error">{error}</p>}
      {loading ? <h2>Loading...</h2> : <> {user ? <YoutubePage /> : <Auth />} </>}
    </div>
  );
}

export default App;