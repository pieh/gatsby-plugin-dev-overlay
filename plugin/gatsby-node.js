if (process.env.NODE_ENV === `development`) {
  const stripAnsi = require(`strip-ansi`);
  const _ = require(`lodash`);
  const uuidv4 = require("uuid/v4");

  const ACTIONS_WE_CARE_ABOUT = [
    // `LOG_ACTION`,
    `SET_STATUS`,
    `LOG`,
    `ACTIVITY_START`,
    `ACTIVITY_END`,
    `ACTIVITY_UPDATE`,
    // `ACTIVITY_PENDING`,
    // `ACTIVITY_CANCEL`,
    // `ACTIVITY_ERRORED`,
  ];

  const init = (socket, emitter) => {
    console.log("socket listening for logs");
    ACTIONS_WE_CARE_ABOUT.forEach((actionType) => {
      emitter.on(actionType, (action) => {
        if (actionType === `LOG`) {
          if (action.payload.activity_type) {
            return;
          } else {
            action.payload.uuid = uuidv4();
          }
        }

        const sanitizedAction = {
          ...action,
          /* Payload can either be a String or an Object
           * See more at integration-tests/structured-logging/__tests__/to-do.js
           */
          payload: _.isPlainObject(action.payload)
            ? {
                ...action.payload,
                text: stripAnsi(action.payload.text),
                statusText: stripAnsi(action.payload.statusText),
              }
            : action.payload,
        };

        socket.send({
          type: `gatsby-plugin-dev-overlay`,
          payload: sanitizedAction,
        });
      });
    });

    // console.log({ socket });
  };

  exports.onPostBootstrap = ({ emitter }) => {
    const websocketManager = require(`gatsby/dist/utils/websocket-manager`)
      .websocketManager;

    const check = () => {
      if (websocketManager.websocket) {
        console.log("has socket");
        init(websocketManager.websocket, emitter);
      } else {
        console.log("no socket");
        setTimeout(check, 1000);
      }
    };

    check();

    // const socket = .websocket;
  };
}
