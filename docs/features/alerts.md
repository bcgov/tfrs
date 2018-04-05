Alerts, Error Messages, etc.
-------

**Status:** *(not yet implemented)*


The application should make extensive use of alerts to inform users of what is currently happening within the system. Bootstrap provides a pre-styled alert box which you may style even further.

Alerts should be high-level enough in the application so they wouldn't reside in the component containers. You may want to put it in its own reducer and use it as needed. Also look into implementing this npm package [react-redux-alerts](https://www.npmjs.com/package/react-redux-alerts) vs implementing it on your own. Implementing a package usually means less code to write & a faster implementation, however, remember that it is always better to have less dependencies on third-party code as it because stale very quickly and may introduce bugs to your code which can be a maintenance nightmare.
