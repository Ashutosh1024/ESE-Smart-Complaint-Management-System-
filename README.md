# AI-Based Smart Complaint Management System (MERN)

This is a Full Stack MERN application for registering, tracking, and managing complaints. It integrates Google's Gemini AI to automatically categorize complaint priority, suggest the responsible department, and generate automatic response summaries.

## Features

*   **User Authentication:** Secure JWT-based Login and Registration.
*   **Complaint Registration:** Users can report issues with details like category and location.
*   **Dashboard & Tracking:** Users/Admins can view complaints, filter by category, and search by location.
*   **AI Complaint Analysis:** Powered by Gemini AI:
    *   Detects complaint urgency (High/Medium/Low).
    *   Suggests the responsible department based on the complaint text.
    *   Summarizes the complaint.
    *   Generates an empathetic auto-response draft.
*   **Status Management:** Update complaint status (Pending, In Progress, Resolved).

## Technologies Used

*   **Frontend:** React, Vite, Tailwind CSS, React Router, Axios, Lucide React.
*   **Backend:** Node.js, Express.js.
*   **Database:** MongoDB, Mongoose.
*   **AI Integration:** `@google/generative-ai` (Gemini 1.5 Flash).
*   **Security:** `bcryptjs` (Password hashing), `jsonwebtoken` (Auth).

## Running Locally

### Backend Setup
1. Open a terminal and navigate to the `backend` folder: `cd backend`
2. Install dependencies: `npm install`
3. Ensure the `.env` file exists with `MONGO_URI`, `JWT_SECRET`, `PORT=5000`, and `GEMINI_API_KEY`.
4. Start the server: `npm run dev` (or `npm start`)

### Frontend Setup
1. Open a new terminal and navigate to the `frontend` folder: `cd frontend`
2. Install dependencies: `npm install`
3. Ensure the `.env` file exists with `VITE_API_URL=http://localhost:5000/api`.
4. Start the development server: `npm run dev`

## Deployment on Render

This project is configured for deployment on Render.com.

1. Create a GitHub repository and push this code.
2. Sign up on [Render](https://render.com/).
3. Click "New" -> "Blueprint" and connect your GitHub repository.
4. Render will automatically detect the `render.yaml` file and deploy both the Node.js backend and the static React frontend.
5. **Important:** Because the frontend is a static site (React), `VITE_API_URL` needs to be set to your Render backend URL *during the build process*. You may need to update the `VITE_API_URL` in the Render dashboard for the frontend service to point to `https://your-backend-service.onrender.com/api` and trigger a manual deploy.
