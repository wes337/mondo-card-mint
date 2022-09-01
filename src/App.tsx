import { Component, onMount, onCleanup, createSignal } from "solid-js";
import "./App.scss";
import { mintCard, clearMintedCards } from "./Minter";
import { getCardImage, getRandomCards } from "./utils";

const App: Component = () => {
  const [mintedCards, setMintedCards] = createSignal([]);

  onMount(() => {
    clearMintedCards();
  });

  onCleanup(() => {
    clearMintedCards();
  });

  const onClickCard = (event) => {
    const card = event.target;
    const callback = (cardRef) => {
      const card = JSON.parse(cardRef.getAttribute("data-card"));
      setMintedCards([...new Set([...mintedCards(), card])]);
    };

    const random = Math.random() < 0.5;

    mintCard([card], {
      callback,
      fallToLeft: random,
    });
  };

  const clear = () => {
    setMintedCards([]);
    clearMintedCards();
  };

  return (
    <div class="app">
      <div class="card-select">
        <h4>
          Click on a card to <span class="color-change">MINT</span> it
        </h4>
        <div class="card-select-cards">
          {getRandomCards(5).map((randomCard) => (
            <img
              src={getCardImage(randomCard)}
              width={168}
              height={284}
              alt=""
              data-card={JSON.stringify(randomCard)}
              onClick={onClickCard}
            />
          ))}
        </div>
      </div>

      {mintedCards().length && (
        <div class="minted-card-display" onClick={clear}>
          {mintedCards().map((card) => {
            const src = getCardImage(card);
            return <img src={src} alt="" />;
          })}
        </div>
      )}
    </div>
  );
};

export default App;
