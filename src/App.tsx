import { Component } from "solid-js";
import { getRandomCards } from "./utils";
import MintedCards from "./MintedCards";
import "./App.scss";

const randomCards = getRandomCards(5);

const App: Component = () => {
  return (
    <div class="app">
      <MintedCards
        cards={randomCards}
        cardSize={{
          width: 168,
          height: 284,
        }}
        timeBetweenFrames={20} // Lower number will increase speed
        callback={() => {
          // Callback function fired after spotlight is closed
          console.log("Finished!");
        }}
      />
    </div>
  );
};

export default App;
