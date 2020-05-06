import React, { useEffect, useReducer } from "react";
import uuidv4 from "uuid/v4";
import { motion, AnimatePresence } from "framer-motion";

import SpinnerActivity from "./spinner";
import ProgressActivity from "./progress";
import Log from "./log";

const socket = window.io();

const initialState = {
  status: ``,
  logs: [],
  activities: [],
};

const reducer = (state, action) => {
  switch (action.type) {
    case `SET_STATUS`:
      return {
        ...state,
        status: action.payload,
      };
    case `ACTIVITY_START`: {
      return {
        ...state,
        activities: [...state.activities, action.payload],
      };
    }
    case `ACTIVITY_UPDATE`:
    case `ACTIVITY_END`: {
      const currentActivity = action.payload;
      return {
        ...state,
        activities: state.activities.map((activity) => {
          if (activity.uuid === currentActivity.uuid) {
            return {
              ...activity,
              ...currentActivity,
            };
          }

          return activity;
        }),
      };
    }
    case `ACTIVITY_END:DELAYED`: {
      const currentActivity = action.payload;
      return {
        ...state,
        activities: state.activities.filter((activity) => {
          return activity.uuid !== currentActivity.uuid;
        }),
      };
    }
    case `LOG`: {
      return {
        ...state,
        logs: [...state.logs, action.payload],
      };
    }
    case `LOG:DELAYED`: {
      const currentActivity = action.payload;
      return {
        ...state,
        logs: state.logs.filter((activity) => {
          return activity.uuid !== currentActivity.uuid;
        }),
      };
    }
    default: {
      return state;
    }
  }
};

const Overlay = () => {
  const [state, dispatch] = useReducer(reducer, initialState);
  useEffect(() => {
    console.log("useEffect");
    const messageHandler = (event) => {
      console.log("socket event", event.type, event.payload);
      if (event.type === `gatsby-plugin-dev-overlay`) {
        const action = event.payload;
        if (action.type === `LOG`) {
          action.id = uuidv4();
        }
        dispatch(action);

        if ([`ACTIVITY_END`, `LOG`].includes(action.type)) {
          setTimeout(() => {
            dispatch({
              ...action,
              type: `${action.type}:DELAYED`,
            });
          }, 5000);
        }
      }
    };
    socket.on(`message`, messageHandler);

    return () => {
      socket.off(`message`, messageHandler);
    };
  }, [dispatch]);

  return (
    <AnimatePresence>
      {state.logs.length + state.activities.length > 0 && (
        <motion.pre
          style={{
            position: `fixed`,
            bottom: 20,
            left: 20,
            background: "rgb(64,62,65)",
            color: "white",
            width: `50%`,
            padding: 5,
            maxHeight: `50%`,
            overflowY: `auto`,
            whiteSpace: `pre-wrap`,
            fontSize: 10,
            lineHeight: 1.6,
            // opacity: state.logs.length + state.activities.length > 0 ? 1 : 0,
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <AnimatePresence>
            {state.logs.map((log) => {
              return <Log key={log.uuid} log={log} />;
            })}
            {state.activities.map((activity) => {
              if (activity.type === `spinner`) {
                return (
                  <SpinnerActivity key={activity.uuid} activity={activity} />
                );
              } else if (activity.type === `progress`) {
                return (
                  <ProgressActivity key={activity.uuid} activity={activity} />
                );
              }
              return null;
            })}
          </AnimatePresence>
        </motion.pre>
      )}
    </AnimatePresence>
  );
};

export default Overlay;
