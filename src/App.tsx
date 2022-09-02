import { Component, onMount, onCleanup, createSignal } from "solid-js";
import { mintCard, clearMintedCardAnimations } from "./Minter";
import { getCardImage, getCardImageById, getRandomCards } from "./utils";
import "./App.scss";

const randomCards = getRandomCards(5);

const App: Component = () => {
  const [selectedCards, setSelectedCards] = createSignal([]);
  const [mintedCards, setMintedCards] = createSignal([]);

  onMount(() => {
    clearMintedCardAnimations();
  });

  onCleanup(() => {
    clearMintedCardAnimations();
  });

  const onClickCard = (event, cardId) => {
    if (selectedCards().includes(cardId)) {
      setSelectedCards(selectedCards().filter((id) => id !== cardId));
      event.target.blur();
    } else {
      setSelectedCards([...selectedCards(), cardId]);
    }
  };

  const getSelectedCardRefs = () => {
    return selectedCards().map((selectedCardId) =>
      document.querySelector(`[data-card="${selectedCardId}"`)
    );
  };

  const mintCards = () => {
    if (selectedCards().length === 0) {
      return;
    }

    const callback = (cardRef) => {
      const cardId = cardRef.getAttribute("data-card");
      setMintedCards([...new Set([...mintedCards(), cardId])]);
    };

    const cardRefs = getSelectedCardRefs();
    mintCard(cardRefs, {
      callback,
    });
  };

  const clear = () => {
    clearMintedCardAnimations();
    setSelectedCards([]);
    setMintedCards([]);
  };

  const closeSpotlight = () => {
    clearMintedCardAnimations();

    const mintedCardRefs = document.querySelectorAll(
      ".minted-card-display-card img"
    );
    const spotlightRef = document.querySelector(".minted-card-display");
    spotlightRef.classList.add("fade-out");
    mintedCardRefs.forEach((card) => {
      card.classList.add("spin-out");
    });

    const animationDuration = 500;
    setTimeout(() => {
      clear();
    }, animationDuration);
  };

  const showSpotlight = () =>
    mintedCards().length > 0 && mintedCards().length === selectedCards().length;

  return (
    <div class="app">
      <div class={`card-select${showSpotlight() ? " spotlight-open" : ""}`}>
        <h4>
          Select cards, then press the <span class="color-change">MINT</span>{" "}
          button
        </h4>
        <div class="card-select-cards">
          {randomCards.map((randomCard) => {
            const isSelected = selectedCards().includes(randomCard.id);
            return (
              <img
                class={`${isSelected ? " selected" : ""}`}
                src={getCardImage(randomCard)}
                width={168}
                height={284}
                alt=""
                data-card={randomCard.id}
                onClick={(event) => onClickCard(event, randomCard.id)}
              />
            );
          })}
        </div>
        <button class="mint-button" onClick={mintCards}>
          <span class="glow">Mint</span>
        </button>
      </div>

      {showSpotlight() && (
        <div class="minted-card-display" onClick={closeSpotlight}>
          {mintedCards().map((mintedCardId) => {
            const src = getCardImageById(mintedCardId);
            return (
              <div class="minted-card-display-card">
                <img src={src} alt="" />
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default App;
