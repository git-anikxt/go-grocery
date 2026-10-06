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

The customer and shopkeeper apps use the hosted API by default. To use a local API, create `frontend/.env.local`:

```env
VITE_API_URL=http://localhost:5000
```

For payment testing, use matching Razorpay **test-mode** credentials in the backend and the public frontend key only if the API response does not supply it:

```env
VITE_RAZORPAY_API_KEY=rzp_test_<your-public-key>
```

Restart Vite after changing frontend environment variables. Do not put the Razorpay secret in frontend variables.

## Build

```powershell
cd frontend
npm run build
```

```powershell
cd GoGrocety-shopkeeper-panel-main
npm run build
```
