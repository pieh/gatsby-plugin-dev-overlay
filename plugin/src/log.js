import React from "react";
import AnimatedDiv from "./animated-div";

const Log = ({ log }) => {
  return (
    <AnimatedDiv>
      {log.level} {log.text}
    </AnimatedDiv>
  );
};

export default Log;
