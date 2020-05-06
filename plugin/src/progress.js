import React from "react";
import AnimatedDiv from "./animated-div";

const Progress = ({ activity }) => {
  return (
    <AnimatedDiv>
      {activity.status === `_IN_PROGRESS` ? (
        <span data-progress={activity.current / activity.total} style={{}} />
      ) : (
        activity.status
      )}{" "}
      {activity.text} {activity.current} / {activity.total}
    </AnimatedDiv>
  );
};

export default Progress;
