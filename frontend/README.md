# User interface

The Oma Opintopolku -loki user interface is a

- **React** (https://reactjs.org/) app,
- styled using **styled components** (https://www.styled-components.com/),
- dependencies managed using **NPM** (https://www.npmjs.com/), and
- build handled with **webpack** (https://webpack.js.org/) and **Babel** (https://babeljs.io/).

## Development

First, setup dependencies by running:

`npm i`

Next, copy `.env-example` to `.env`.

Then, start the local hot-reloaded development server by running:

`npm run start:dev`

Or, build the development build by running `npm run build:dev` and serve the files from `dist` directory with some other development server.

To include Oppija-raamit (https://github.com/Opetushallitus/oppija-raamit), add `proxy-oppija-raamit=true` argument by running:

`npm run start:dev -- --proxy-oppija-raamit=true`

### Tests

Tests use **Jest** (https://jestjs.io/) and **Puppeteer** (https://pptr.dev/).

To run tests:

`npm test`

### Code style

The code base uses **JavaScript Standard Style** (https://standardjs.com/). **ESLint** (https://eslint.org/) is used for linting.

To lint both application code and tests:

`npm run lint`

In addition to JavaScript Standard Style, ESLint uses the recommended configs for React and Jest.