# Discord RGBot

A Discord bot that alternates the color of selected roles between red, green and blue

## Configure

Copy `.env.default` to `.env` and fill in the values.

## Install dependencies

```sh 
npm install
```

## Run

```sh
node ./src/index.js
```

## Disclaimer

This project is an experiment developed very quickly. The roles that need to be color alternated are stored in a simple JSON file, which is definitely not optimized for heavy loads. Moreover, the endpoint to modify a role is rate-limited to 1000 requests every 86400 seconds, which is reached in about 1h30 with a change interval of 5 seconds. The discord API is clearly not meant to be used like this.
