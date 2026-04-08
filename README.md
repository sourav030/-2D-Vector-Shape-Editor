# Canvas Editor

A full-stack canvas editor built with Vue 3, Fabric.js, Express, and MongoDB. The app lets you add basic shapes, draw freehand, edit selected object properties, manage z-order, and save or reload canvas states from the backend.

## Features

- Add rectangles, circles, and triangles to the canvas.
- Toggle freehand drawing with a brush tool.
- Move selected objects and edit their position and fill color.
- Bring objects to the front or send them to the back.
- Undo and redo canvas changes.
- Save canvas JSON to MongoDB and load the latest or any saved canvas.

## Tech Stack

- Frontend: Vue 3, Vite, Fabric.js, Axios, Tailwind CSS, vue3-toastify
- Backend: Node.js, Express, Mongoose, CORS, dotenv
- Database: MongoDB

## Project Structure

```text
backend/
	server.js
	src/
		config/db.js
		controller/canvaController.js
		model/canvas.js
		routes/canvaRoute.js
frontend/
	src/
		App.vue
		components/
			CanvasBoard.vue
			PropertiesPanel.vue
			Toolbar.vue
		composables/
			useCanvas.js
			useHistory.js
```

## Requirements

- Node.js 18 or newer
- MongoDB connection string

## Setup

### 1. Backend environment

Create a `.env` file inside `backend/` with the following variables:

```env
PORT=4000
MONGODB_URI=your_mongodb_connection_string
```

### 2. Install dependencies

Install packages for both apps:

```bash
cd backend
npm install

cd ../frontend
npm install
```

## Run the app

### Start the backend

```bash
cd backend
npm run dev
```

The API will be available at `http://localhost:4000` if you use the example port above.

### Start the frontend

```bash
cd frontend
npm run dev
```

Open the Vite URL shown in the terminal, usually `http://localhost:5173`.

## API Endpoints

Base path: `/api`

- `POST /api/create` - Save a canvas JSON payload
- `GET /api/all` - Fetch all saved canvases
- `GET /api/latest` - Fetch the most recently saved canvas
- `GET /api/canva/:id` - Fetch a canvas by MongoDB id

## Keyboard Shortcuts

- `Ctrl/Cmd + Z` - Undo
- `Ctrl/Cmd + X` - Redo

## Notes

- The frontend currently posts to `http://localhost:4000/api/create`, so keep the backend port aligned with that value unless you update the client code.
- The canvas state is stored as Fabric JSON in MongoDB.
