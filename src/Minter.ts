interface mintCardOptions {
  g?: number;
  dt?: number;
  bounce?: number;
  endVelocity?: number;
  stagger?: number;
  fallToLeft?: boolean;
  clear?: boolean;
  callback?: (card: any) => void;
}

const MINT_CARD_ANIMATION_CLASS = "minted-card-animation";

export const clearMintedCardAnimations = () => {
  document
    .querySelectorAll(`.${MINT_CARD_ANIMATION_CLASS}`)
    .forEach((element) => element.remove());
};

export const mintCard = (cardRefs, options?: mintCardOptions) => {
  const g = options?.g || -3;
  const dt = options?.dt || 5;
  const bounce = options?.bounce || 0.99;
  const endVelocity = options?.endVelocity || 0;
  const stagger = options?.stagger || 200;
  const fallToLeft = options?.fallToLeft || false;
  const clear = options?.clear || false;
  const callback = options?.callback || null;

  const windowHeight = window.innerHeight;

  const fallIteration = (elem, elemHeight, oldPos, dx, dy) => {
    const copy = elem.cloneNode(true);
    document.body.append(copy);

    const newTop = Math.min(windowHeight - elemHeight, oldPos.top + dy);
    const newPos = {
      left: oldPos.left + dx,
      top: newTop,
    };

    copy.style.top = `${newPos.top}px`;
    copy.style.left = `${newPos.left}px`;

    if (Math.abs(newTop - (windowHeight - elemHeight)) < 5) {
      if (newPos.left > window.innerWidth || newPos.left < 0) {
        callback?.(elem);
      } else if (dy < 0 || dy > endVelocity) {
        dy *= -1 * bounce;
        setTimeout(() => {
          fallIteration(copy, elemHeight, newPos, dx, dy);
        }, dt);
      } else {
        // Animation finished
        callback?.(elem);
      }
    } else {
      dy = dy - g;
      setTimeout(() => {
        fallIteration(copy, elemHeight, newPos, dx, dy);
      }, dt);
    }
  };

  const startFall = (elem, height, stagger) => {
    let dx = Math.floor(Math.random() * 10) + 5;

    const fallRandomlyToLeft = Math.random() < 0.5;
    if (fallRandomlyToLeft) {
      dx = -dx;
    }

    const copy = elem.cloneNode(true);
    copy.classList.add(MINT_CARD_ANIMATION_CLASS);
    copy.style.position = "fixed";
    copy.style.top = `${elem.offsetTop}px`;
    copy.style.left = `${elem.offsetLeft}px`;
    copy.style.zIndex = 1;
    document.body.append(copy);

    setTimeout(() => {
      const position = {
        top: copy.offsetTop,
        left: copy.offsetLeft,
      };
      fallIteration(copy, height, position, dx, 0);
    }, stagger);
  };

  if (clear) {
    clearMintedCardAnimations();
  }

  cardRefs.forEach((cardRef, index) => {
    if (
      cardRef.offsetHeight < window.outerHeight &&
      !cardRef.classList.contains(`.${MINT_CARD_ANIMATION_CLASS}`)
    ) {
      startFall(cardRef, cardRef.offsetHeight, index * stagger);
    }
  });
};
