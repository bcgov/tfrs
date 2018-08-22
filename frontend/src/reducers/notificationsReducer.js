const notificationsReducer = (state = { lastMessage: null, messages: [] }, action) => {
  console.log('fired for: ')
  console.log(action);

  switch (action.type) {
    case 'server_notify':
      return Object.assign({}, {
        lastMessage: action.message,
        messages: state.messages.concat([action.message])
      });
    default:
      return state;
  }
};

export default notificationsReducer;
