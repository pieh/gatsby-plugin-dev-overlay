import React, { useReducer, useEffect } from "react";
import AnimatedDiv from "./animated-div";

const frames = ["⠋", "⠙", "⠹", "⠸", "⠼", "⠴", "⠦", "⠧", "⠇", "⠏"];
const interval = 80;

const reducer = (state, action) => {
  if (action === `TICK`) {
    return (state + 1) % frames.length;
  }
  return state;
};

const Spinner = () => {
  const [index, dispatch] = useReducer(reducer, 0);

  useEffect(() => {
    const intervalID = setInterval(() => {
      dispatch(`TICK`);
    }, interval);

    return () => {
      clearInterval(intervalID);
    };
  }, [dispatch]);

  return <>{frames[index]}</>;
};

const SpinnerActivity = ({ activity }) => {
  return (
    <AnimatedDiv>
      {activity.status === `IN_PROGRESS` ? <Spinner /> : activity.status}{" "}
      {activity.text}
    </AnimatedDiv>
  );
};

export default SpinnerActivity;
