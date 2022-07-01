import React from "react";
import { useUserContext } from "./userContext/userContext";
import Auth from "./userContext/auth";
import YoutubePage from "./pages/YoutubePage";

function App() {
  const { displayName } = useUserContext();

  return (
    // 表示分岐するときは，なるべく変数を一つにしたほうがいい．
    <div className="App" style={{height:"100%"}}>
      {displayName == "loading" ? <h2 style={{ color: "#FAFAFA" }}>Loading...</h2> : <> {displayName == "Preregistered" ? <Auth /> : <YoutubePage /> } </>}
    </div>
  );
}

export default App;