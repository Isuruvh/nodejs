# Okta Hook Demo Project

This workspace contains multiple small Node.js Express services used to test different Okta hook types locally with ngrok.

## Included services

- `server.js` – user-created event webhook demo
- `register.js` – registration hook demo
- `server1.js` – progressive profile hook demo
- `server-auth.js` – protected auth demo for later use

## Local ports

- http://localhost:8082 – main event hook server
- http://localhost:8086 – registration hook server
- http://localhost:8087 – progressive profile hook server
- http://localhost:8083 – protected auth demo server

## Run locally

### Event hook demo
```powershell
cd C:\Users\isuru\nodejs
node server.js
```

### Registration hook demo
```powershell
cd C:\Users\isuru\nodejs
node register.js
```

### Progressive profile hook demo
```powershell
cd C:\Users\isuru\nodejs
node server1.js
```

### Protected auth demo
```powershell
cd C:\Users\isuru\nodejs
node server-auth.js
```

## Start ngrok tunnels

### Event hook
```powershell
cd C:\Users\isuru\nodejs
ngrok http 8082 --config "C:\Users\isuru\AppData\Local\ngrok\ngrok.yml"
```

### Registration hook
```powershell
cd C:\Users\isuru\nodejs
ngrok http 8086 --config "C:\Users\isuru\AppData\Local\ngrok\ngrok.yml"
```

### Progressive profile hook
```powershell
cd C:\Users\isuru\nodejs
ngrok http 8087 --config "C:\Users\isuru\AppData\Local\ngrok\ngrok.yml"
```

## Relevant Okta endpoints

- Event hook: `/userCreated`
- Registration hook: `/registrationHookSSR`
- Progressive profile hook: `/registrationHookPP`

## Notes

- Only one app should be bound to a port at a time.
- If a port is already in use, stop the old Node process before starting a new one.
- The demo hooks are intentionally simple and designed for local testing with Okta.
- The auth demo is kept separate so it can be used later without interfering with the hook testing flow.

## Project status

The project currently contains working local hook demos for:
- user-created event hooks
- registration hooks
- progressive profile hooks

The next step is to validate the progressive profile rule with the real Okta payload and refine the employee number check against the exact field mapping.
