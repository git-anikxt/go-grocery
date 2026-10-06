# GoGrocery

GoGrocery is a grocery marketplace with a customer website, an Express/MongoDB API, and a shopkeeper dashboard.

## Project layout

- `frontend/` — customer-facing React/Vite website
- `backend/` — Express API, MongoDB models, authentication, and Razorpay integration
- `GoGrocety-shopkeeper-panel-main/` — shopkeeper React/Vite dashboard

## Requirements

- Node.js 18 or newer
- npm
- A MongoDB database and Razorpay test credentials to run the backend/payment flow

## Install dependencies

Run these commands from separate PowerShell terminals:

```powershell
cd backend
npm install
```

```powershell
cd frontend
npm install
```

```powershell
cd GoGrocety-shopkeeper-panel-main
npm install
```

## Configure the backend

Copy `backend/.env.example` to `backend/.env` and fill in your own values. Never commit `.env` or share its secrets.

```env
PORT=5000
MONGO=mongodb+srv://<username>:<password>@<cluster>/<database>?retryWrites=true&w=majority
JWT_SECRET=<long-random-secret>
RAZORPAY_API_KEY=rzp_test_<your-public-key>
RAZORPAY_API_SECRET=<your-test-key-secret>
```

Start the backend:

```powershell
cd backend
npm run dev
```

The API health check is available at `http://localhost:5000/`.

## Run the applications

Start each app in its own terminal:

```powershell
cd frontend
npm run dev
```

```powershell
cd GoGrocety-shopkeeper-panel-main
npm run dev
```

Vite prints the local URLs. If both apps are running, they normally use ports `5173` and `5174`.

Both portals include a development environment file with the hosted API URL, so no Vite configuration is needed. After installing dependencies, start either portal with `npm run dev` from its folder.

To point the customer portal at a local API instead, create `frontend/.env.development.local`:

```env
VITE_API_URL=http://localhost:5000
```

To point the shopkeeper portal at a local API instead, create `GoGrocety-shopkeeper-panel-main/.env.development.local` with the same setting. These `.local` override files are ignored by Git.

The customer development config includes the Razorpay **test public key** used when the hosted API does not return a public key. It is safe for client-side use; never put the Razorpay secret in frontend variables. Restart Vite after changing any environment variables.

## Build

```powershell
cd frontend
npm run build
```

```powershell
cd GoGrocety-shopkeeper-panel-main
npm run build
```
