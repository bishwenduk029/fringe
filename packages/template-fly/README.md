# Getting Started with Create Fringe App

This project was bootstrapped with [Create Fringe App](https://github.com/bishwenduk029/fringe).

# Getting Started

Howdy! Let's get your Fringe app to [fly](https://fly.io).

It's important to know that you must have a [Fly.io account](https://fly.io) to deploy your Fringe app.

## Installation

Make sure you have the [flyctl CLI](https://fly.io/docs/getting-started/installing-flyctl/) tool installed:

You may need to run `flyctl login` to authenticate your Fly.io account.

Next, use flyctl to initialize Fringe App: (let flyctl override the default fly.toml available in this bootstrap)

```bash
flyctl init
```

Fringe uses the concept of file based routing. Each file route in your `src` folder becomes as endpoint. Even 
routes to `*.graphql` become active REST endpoints.

So say you have a graphql query at file path `src/graphql/about/index.graphql` , it becomes an endpoint at `http://localhost:8080/graphql/about

You will need a `api` directory and `graphql` directory in your `src` folder with at least one function and one graphql query/mutation to start with:

`src/api/about/index.js`
```js
export default function Index() {
  return <h1>Home</h1>;
}
```

`src/graphql/about/index.js`
```graphql
query {
  launchesPast(limit: 4) {
    __typename
    mission_name @fringe_cache
    launch_date_local
    launch_site {
      __typename
      site_name_long
    }
  }
}
```
## Available Scripts

In the project directory, you can run:

### `npm run dev`

Runs the app in the development mode. Use postman or curl to test your API endpoints.

### `npm run build`

Builds the app for production to the `build` folder. It correctly bundles your Fringe app as a stand-alone Node server. 

### `npm run start`

Starts the stand-alone build from the `build` folder. Note that you must first build your app using `npm run build`.

### `npm run deploy`

Publish your app to [fly.io](https://fly.io) and enjoy autoscaling of your app.

## Important Note: In order to deploy your apps to fly edge cloud, make sure to install flyctl command line utility.
Relevant link for installation guide [here](https://fly.io/docs/speedrun).