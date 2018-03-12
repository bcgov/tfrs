Components
---------
ReactJS is a component-based JavaScript library. If you are new to React, you may want to [read up on a tutorial](https://reactjs.org/tutorial/tutorial.html).

Since components are heavily used, it is much more easier and cleaner to split them into two types:
1. Presentational Components
2. Container Components

If you are coming from a backend developer background, or any other software architecture/engineering discipline, you may be familiar with MVC, where the application is divided into three parts: Model, View, Container. Since the frontend application is merely an interface to the underlying API, we do not necessarily need to model our data in the application. But, it might still be useful to separate all the logic from the actual HTML template view.

# Features or Themes or common Function
It is useful to separate your code into themes (common function). If you are working on the admin part of the application, it might make sense to have a folder called `admin`. Under this feature/theme/function folder, you will start writing your components.

# Presentational Components
A **presentational components** mere function is to render the HTML. Think of it as a template that accepts props. It does not contain any logic or computational code.

# Container Components
All your business and other logic will be contained in a **container component**. A container component doesn't have a lot of HTML code, and merely calls the presentational components to render the appropriate HTML. Your container component handles all the behavior related to a specific feature, theme, or page in the application. It is the layer that connects with your application state or redux store.
