# User interface

The user interface (UI) source code can be found under `frontend` directory.
The UI is a *React* app, its dependencies are managed with *NPM*, and build is handled using *webpack* and *Babel*.

## Development

First, setup dependencies by running:

`npm i`

Then, start the local hot-reloaded development server by running:

`npm run start:dev`

Or, build the development build by running `npm run build:dev` and serve the files from `dist` directory with some other development server.

### Tests

Tests use *Jest* and *Puppeteer*.

To run tests:

`npm test`

### Code style

The code base uses *JavaScript Standard Style*. *ESLint* is used for linting.

To lint both application code and tests:

`npm run lint`

In addition to JavaScript Standard Style, ESLint uses the recommended configs for React and Jest.
