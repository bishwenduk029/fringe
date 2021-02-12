Fringe is a simple framework for running functions and graphql at Edge.

It's inspired by frameworks like [Next.js](https://nextjs.org/) and [flareact](https://flareact.com/)

It supports following:

- File Based routing for functions at edge
- Dynamic API routes
- File Based routing for graphql at edge
- Just declare your GraphQL queries/mutations in plain .graphql files and they will be run on server

**Serveless GraphQL**

Fringe allows you to run GraphQL at edge along with caching responses in a normalized form at edge. Just declare your GraphQL queries in .graphql files during your development and file paths to your .graphql files become REST API endpoints.

Project Structure:

![Image of Project Structure](https://user-images.githubusercontent.com/4037621/104008201-21147100-51cf-11eb-825b-5524b4457aa7.png)

The space/index.graphql can be run at REST endpoint http://localhost:8080/graphql/space

***Advantages***
- Keep your frontend builds free of GraphQL boilerplate.
- Also no tooling needed for GraphQL in your frontend.
- The model offers protection of origin GraphQL Server behind edge.
- Improves developer experience with more focus on business at hand than on setup.
- Write your component and define your GraphQL and keep them side by side with zero additional setup.
- Even execute GraphQL queries/mutations via file based routing for GraphQL.🔥
- Normalized Caching at edge of GraphQL results can offer better performance and again reduce the boilerplate for server  codes.

**Getting Started**

  ```
    npm install create-fringe-app <name-of-app>
    npm run build
    npm run start

    Now hit the link http://localhost:8080/graphql/space/
  ```




