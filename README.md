# Okta Event Hook Demo

This project is a simple Node.js Express app that listens for Okta user lifecycle event webhooks and logs when a user is created.

## Features

- Serves a basic HTML page at `/`
- Handles Okta verification requests at `/userCreated`
- Receives `POST` requests from Okta when a user is created
- Logs the created user email to the terminal
- Exposes the app through ngrok for Okta testing

## Local app

The server listens on:

- http://localhost:8082

## Routes

- `GET /` -> serves the homepage
- `GET /userCreated` -> responds with the Okta verification payload
- `POST /userCreated` -> processes the Okta event payload

## Run locally

```bash
cd C:\Users\isuru\nodejs
node server.js
```

## Start ngrok tunnel

```powershell
cd C:\Users\isuru\nodejs
ngrok http 8082 --config "C:\Users\isuru\AppData\Local\ngrok\ngrok.yml"
```

## Public URL used for testing

```text
https://esteemed-omit-creme.ngrok-free.dev
```

Okta webhook endpoint used for testing:

```text
https://esteemed-omit-creme.ngrok-free.dev/userCreated
```

## Okta event hook behavior

When Okta sends a user creation event, the server reads the payload and prints a message like:

```text
The user john.doe@example.com has been added to the Okta org!
```

## Notes

- The app is intentionally simple and designed for local testing with Okta event hooks.
- The ngrok tunnel is required so Okta can reach the app from the internet.
- The app should be running before configuring Okta webhooks.

## Project status

This project successfully demonstrated a working Okta user-created event hook flow using a public ngrok tunnel.
