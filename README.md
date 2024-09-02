# blogclient


## 👉 [Link to Live Project]() 

## Table of Contents

1. [Project Overview](#project-overview)
   - [Objective](#objective)
   - [User Interaction](#user-interaction)   
   - [Administrative Features](#administrative-features)
   - [Future Enhancements](#future-enhancements)
2. [Design & Planning](#design-and-planning)
   - [Kanban Board](#kanban-board)
   - [Mockups](#mockups)
   - [Mobile View](#mobile-view)
   - [Color Palette](#color-palette)
3. [Technologies](#technologies)
4. [Dependencies](#dependencies)   
5. [Reusable Components](#reusable-components)   
6. [Setup and Installation](#setup-and-installation)
   - [Clone the Repository](#clone-the-repository)
   - [Install Dependencies](#install-dependencies)
   - [Start the Development Server](#start-the-development-server)
7. [Testing](#testing)
   - [React Testing Library](#react-testing-library)
8. [Deployment](#deployment)
   - [Heroku Deployment](#heroku-deployment)
     - [Create a Heroku App](#create-a-heroku-app)
     - [Add Node.js Buildpack](#add-nodejs-buildpack)
     - [Build the Project](#build-the-project)
       - [Option 1: Build Locally](#option-1-build-locally)
       - [Option 2: Let Heroku Build](#option-2-let-heroku-build)
     - [Prepare the Project for Heroku Deployment](#prepare-the-project-for-heroku-deployment)
       - [Add a Procfile](#add-a-procfile)
       - [Configure package.json](#configure-packagejson)
     - [Deploy The Project](#deploy-the-project)
     - [Configure Environment Variables](#configure-environment-variables)
     - [Post-Deployment](#post-deployment)
9. [Credits](#credits)

## Project Overview

### Objective



#### User Interaction

- **User Registration and Authentication:**


- **Create Posts:**


- **tag other profiles in posts**

- **comments** 

- **Ratings**


- **Follow other profiles:**


- **Explore and Discover:**



### Administrative Features

- **User Management:**
  - **Profile Update:** Able to update profile name (will not change the login username), update profile image, and add a bio.
  
  - **Content Moderation:** Super-users can review and moderate user-generated content to ensure it is valid to be published.

- **Analytics Insights:**
- more 

### Future Enhancements



[Back to top](#table-of-contents)  

## Design and Planning

### Kanban Board

- **Development Process:** While working on this project, an "Agile" development approach was followed as much as possible.

- **Development Preparation:** The initial steps involved thorough planning of the website, creating a class diagram for the models, and wireframes for the UI.

- **Feature Tracking & Task Management:** Features were categorized and moved through different columns (Todo, In Progress, Done) as they were worked on and completed.


👉 [Project Board link]( )

### Mockups

**Created with webflow**



<p>
<img src="" alt="LandingPage" width="400" height="300"/>
<img src="" alt="LandingPage" width="400" height="300"/>
</p>

## Mobile View
<p>
<img src="" alt="LandingPage" width="400" height="300"/>
<img src="" alt="LandingPage" width="400" height="300"/>

</p>


[Back to top](#table-of-contents)  

### Color Palette

[Coolors Color Palette](https://coolors.co/)
<br>

![Coolors]()

- **_Fonts Used_**: 

## Technologies

- Vite + React

### Or if you want to start from a clean sheet : 
- How install and get started with Vite + React : 

Install Node.js

- https://nodejs.org/en


2. Create a Vite + React Project
Open your terminal and run the following command to create a new Vite project with React:
```
npm create vite@latest . 
```

## Dependencies


- `@emotion/react and @emotion/styled: For CSS-in-JS styling.`

- `axios: Promise-based HTTP client for making API requests.`

- `compression: Middleware for compressing HTTP responses.`

- `express: Fast, unopinionated, minimalist web framework for Node.js.`

- `gsap: A JavaScript library for creating high-performance animations.`

- `js-cookie: For managing cookies, particularly in user authentication.`

- `lodash: Utility library for working with arrays, objects, and other data structures.`

- `react-loader-spinner: For displaying spinners during data loading.`

- `react-redux: For managing state in React applications.`

- `react-router-dom: For handling routing in React applications.`

- `swiper: Modern touch slider for web and mobile.`

- `terser: A tool for minifying JavaScript.`


[Back to top](#table-of-contents)


## Reusable Components

- **Multi Modal displaying different content from the same modal!**
- **blog card**
- **Searchbar**

## Testing

### Lighthouse


### Html Validation 

👉 [HTML Validation]() 

### CSS Validation

👉 [W3C CSS Validator]()

### Color Contrast Testing




### ESLint Validation

![Eslint]()



### React Testing Library

- https://dev.to/mbarzeev/testing-a-simple-component-with-react-testing-library-5bc6
- https://jestjs.io/docs/tutorial-react

[Back to top](#table-of-contents)



## Setup and Installation

1. **Clone the Repository**

    ![alt text](readmecontent/images/clone-2.png)
    ![alt text](readmecontent/images/clone-3.png)

2.  **Install Dependencies**
    `npm install`
3.  **Start the Development Server**
    `npm run dev`

## Configuration for deployment 

### server.js

The `server.js` file sets up an Express server to serve the built React application.
It uses the compression middleware to compress responses, improving load times. In production,
it serves the static files from the `dist` directory and handles any requests by sending the `index.html` file,
enabling client-side routing to function correctly.

```
## Deployment

### Heroku Deployment
Heroku Deployment

### Create a Heroku App

Login to the Heroku website and create a new app. 

Select your region and name your app as you want.


### Add Node.js Buildpack

In the Heroku dashboard, go to the "Settings" tab and 

click on "Add buildpack". Select "Node.js" and add it. 

This tells Heroku to use Node.js to run your application.

### Build the Project

You can either build the project before deploying or let Heroku handle the build process. 

If you want to keep the project size smaller during deployment, let Heroku run the build during deployment.

### Option 1: Build Locally

Build the project locally,:

`npm run build`
This will generate a dist folder containing the built files.

You can then move this to your backend and deploy it as one app on Heroku.

### Option 2: Let Heroku Build

If you prefer to let Heroku handle the build, no need to run the build command locally.

This approach reduces the project size during deployment.

Heroku will use the build script specified in your `package.json` to build the project during deployment.

### Prepare the Project for Heroku Deployment

**Add a Procfile**

Create a Procfile in the root of your project. 

This file tells Heroku how to run your application. Add the following line to your Procfile:

`web: node server.js `

### Configure package.json

This configuration allows Heroku to run the build script during deployment.

Ensure that your package.json includes the necessary scripts for building and running your application. 
```Javascript

  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "lint": "eslint . --ext js,jsx --report-unused-disable-directives --max-warnings 0",
    "preview": "vite preview"
  },
  "engines": {
    "node": "20.x",  // This can change 
    "npm": "10.8.2"  // This can change - has changed a few times keep the up to date version. 
  },
```

### Deploy The project.

Use the Heroku GitHub integration to automatically deploy from a GitHub repository.

### Configure Environment Variables

In the Heroku dashboard, navigate to the "Settings" tab and click on "Reveal Config Vars". 

Add the necessary environment variables required to communicate with the backend and other settings. 

### Post-Deployment

After deploying, Heroku will automatically run the build script defined in package.json.

This will compile your frontend code. Your server will start according to the command defined in Procfile.

You can monitor the deployment process and application logs using the Heroku dashboard or the Heroku 


## Credits

# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.
Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh