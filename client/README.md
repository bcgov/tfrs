## Boiler Plate README

## FIRST INSTALL NPM MODULES

~~~
npm install
~~~

## TO RUN: 

~~~
npm start
~~~
### AFTER THAT EVERYTIME YOU SAVE YOUR FILE IT WILL RELOAD IN THE BROWSER
### IF YOU CHANGE STUFF IN THE SERVER.JS FILE YOU WILL HAVE TO RESTART THE SERVER AND ### REBUNDLE

### IF YOU WANT TO EDIT THIS CREATE A BRANCH AND PULL REQUEST
### DAWSON OR RYAN WILL TAKE A GANDER AT IT


## GUIDELINES:

####Files/Components:
-Consistent file naming scheme
i.e. HomeContainer.jsx -> HomeSidebar.jsx -> HomeFooter.jsx

-Containers (i.e. HomeContainer.jsx) contain logic and state (connect to redux) and pass props to sub components (i.e. HomeSidebar.jsx)

-Put reusable components in one folder in components folder: components -> common -> Countdown.jsx, GoogleMap.jsx, etc.

-Component classes are named the same as the files in which they are contained
i.e. Nav.jsx -> ```class Nav extends Component {...}```

-Organize imports in all files - modules at top, components below modules
i.e. (in order) 
~~~
import React, { Component } from 'react';
import Routes from '../constants/routes.jsx';
import Sidebar from './Sidebar.jsx';
etc
~~~

-Lifecycle methods right underneath constructor
i.e. (in order) 
~~~
constructor(props) {...}
componentDidMount() {...}
handleSubmit() {...}
etc
~~~

-Everything else the same more or less

####Styling:
Depends on project



