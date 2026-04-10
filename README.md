# Canvas Editor

Canvas Editor is a full-stack drawing app built with Vue 3, Fabric.js, Express, and MongoDB. It supports manual shape editing, freehand drawing, undo/redo, persistence to MongoDB, and a text prompt that can generate shapes through the backend AI route.

## Features

- Add rectangles, circles, and triangles to the canvas.
- Draw freehand with a configurable brush width.
- Select an object and edit its position and fill color.
- Bring objects to the front or send them to the back.
- Undo and redo canvas changes.
- Save canvas state to MongoDB and reload previously saved canvases.
- Generate shapes from a text prompt through the AI command input.

## Tech Stack

- Frontend: Vue 3, Vite, Fabric.js, Axios, vue3-toastify, Tailwind CSS 4
- Backend: Node.js, Express, Mongoose, CORS, dotenv
- Database: MongoDB
- AI orchestration: LangGraph with LangChain model integrations

## Project Structure

```text
backend/
	server.js
	src/
		config/
			aiGraph.js
			db.js
		controller/
			canvaController.js
		model/
			canvas.js
		routes/
			canvaRoute.js
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

### 1. Configure the backend

Create a `.env` file inside `backend/`:

```env
PORT=4000
MONGODB_URI=your_mongodb_connection_string
```

If you change `PORT`, update the frontend API URLs in `frontend/src/composables/useCanvas.js` and `frontend/src/App.vue` to match.

### 2. Install dependencies

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

The server listens on the port from `.env` and responds on `/` with a basic health message.

### Start the frontend

```bash
cd frontend
npm run dev
```

Open the Vite URL printed in the terminal, usually `http://localhost:5173`.

## API Routes

Base path: `/api`

- `POST /api/create` - Save the current Fabric canvas JSON
- `GET /api/all` - Fetch all saved canvases
- `GET /api/latest` - Fetch the most recently saved canvas
- `GET /api/canva/:id` - Fetch a canvas by MongoDB id
- `POST /api/ai-command` - Convert a natural-language prompt into shape data

## Usage

The app has two main workflows:

1. Use the toolbar to add shapes, toggle drawing mode, undo/redo, move layers, and save or load canvases.
2. Use the prompt input at the bottom of the page to type a command such as `draw 2 blue circles`, then submit it to generate shapes through the AI route.

Saved canvases are stored as Fabric JSON in MongoDB and can be reloaded from the dropdown in the toolbar or by loading the latest saved state.

## Keyboard Shortcuts

- `Ctrl/Cmd + Z` - Undo
- `Ctrl/Cmd + X` - Redo

## Notes

- The frontend currently calls `http://localhost:4000` directly, so keep that backend port consistent unless you update the client code.
- The app uses Fabric.js object state, so position, color, brush changes, and shape edits are all reflected in the saved JSON.
