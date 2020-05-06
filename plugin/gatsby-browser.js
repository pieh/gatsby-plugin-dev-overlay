import React from "react";
import Overlay from "./src/overlay";

export const wrapRootElement = ({ element }) => {
  if (process.env.GATSBY_BUILD_STAGE === `develop`) {
    // this is dev only, so it shouldn't cause hydration issue :fingers_crossed:
    return (
      <>
        {element}
        <Overlay />
      </>
    );
  }

  return element;
};
