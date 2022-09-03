import { onMount, onCleanup, createSignal, createEffect } from "solid-js";
import { mintCard, clearMintedCardAnimations } from "./Minter";
import { getCardImageById } from "./utils";
import "./MintedCards.scss";

const MintedCards = ({
  cards = [],
  callback = () => {},
  cardSize = { width: 168, height: 284 },
  timeBetweenFrames = 20,
}) => {
  let mintedCardsRef;
  const [mintedCards, setMintedCards] = createSignal([]);

  onCleanup(() => {
    clearMintedCardAnimations();
  });

  onMount(() => {
    clearMintedCardAnimations();
  });

  createEffect(() => {
    if (cards.length === 0) {
      return;
    }

    const mintCards = () => {
      const callback = (cardRef) => {
        const cardId = cardRef.getAttribute("data-card");
        setMintedCards([...new Set([...mintedCards(), cardId])]);
      };

      const cardRefs = mintedCardsRef.querySelectorAll("[data-card]");

      mintCard(cardRefs, {
        callback,
        dt: timeBetweenFrames,
      });
    };

    mintCards();
  });

  const clear = () => {
    clearMintedCardAnimations();
    setMintedCards([]);

    callback?.();
  };

  const closeSpotlight = () => {
    clearMintedCardAnimations();

    const mintedCardRefs = mintedCardsRef.querySelectorAll(
      ".minted-card-display-card img"
    );
    mintedCardRefs.forEach((card) => {
      card.classList.add("spin-out");
    });

    const spotlightRef = mintedCardsRef.querySelector(".minted-card-display");
    spotlightRef.classList.add("fade-out");

    const animationDuration = 500;
    setTimeout(() => {
      clear();
    }, animationDuration);
  };

  const showSpotlight = () =>
    mintedCards().length > 0 && mintedCards().length === cards.length;

  return (
    <div class="minted-cards" ref={mintedCardsRef}>
      <div class={`card-select${showSpotlight() ? " spotlight-open" : ""}`}>
        <div class="card-select-cards">
          {cards.map((card) => {
            return (
              <img
                src={getCardImageById(card.id)}
                width={cardSize.width}
                height={cardSize.height}
                alt=""
                data-card={card.id}
              />
            );
          })}
        </div>
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

export default MintedCards;
