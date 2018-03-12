State handling and storage
-------------
This project uses **Redux** to handle application state and storage. If you've never used Redux before, you can [read about the basics here](https://redux.js.org/basics).

Redux is another JavaScript library that is not exactly built just for React, although it is popular to use the two together. They have specific documentation on [how to use it with React](https://redux.js.org/basics/usage-with-react).

- `actions/` are where you would find the actions. Try to separate your reducers by their theme or function rather than just putting them all in a single file.
- `reducers/` are where you would find the reducers. Try to separate your reducers by their theme or function rather than just putting them all in a single file.
- `store/store.js` is the storage object that keeps everything together and holds the state of the application.
