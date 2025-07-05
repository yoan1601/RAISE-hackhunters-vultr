# React Frontend for FastAPI Backend

This project is a simple React application designed to interact with a Python FastAPI backend. It provides a basic UI to check the health of the backend service.

## Getting Started

### Prerequisites

* Node.js and npm (or yarn)

### Installation and Running

1. **Clone the repository** (if you haven't already).

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Run the development server:**

   ```bash
   npm start
   ```

This will start the React development server, and the application will be accessible at `http://localhost:3000` in your web browser.

### Backend Configuration

The frontend is configured to connect to a backend running at `http://localhost:8000`. If your backend is running on a different URL, you can change it in `src/api/client.js`:

```javascript
const client = axios.create({
  baseURL: 'http://your-backend-url', 
});
```