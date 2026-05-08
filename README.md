# ConvoNest - Full-Stack Real-Time Chat Application


ConvoNest is a modern, full-stack, real-time chat application built with the MERN stack (MongoDB, Express.js, React.js, Node.js) and powered by Socket.IO. The platform enables users to register, log in, update their profiles, and engage in private, one-on-one conversations with text and images.

**https://convonest-chat-app.vercel.app/login** 

---

## ✨ Features

- **User Authentication:** Secure user signup and login with JWT (JSON Web Tokens) and password hashing (bcrypt).
- **Real-Time Messaging:** Instant, bi-directional communication between users using Socket.IO WebSockets.
- **User Presence:** Real-time indicators to show whether a user is `Online` or `Offline`.
- **Image Sharing:** Users can send and receive images, which are uploaded to Cloudinary.
- **Unread Message Notifications:** A badge count shows the number of unseen messages from each user.
- **Responsive Design:** A clean, modern UI built with Tailwind CSS that works seamlessly on desktop and mobile devices.
- **Profile Customization:** Users can update their full name, bio, and upload a profile picture.
- **User Search:** Ability to filter the user list to easily find conversations.
- **Media Gallery:** A dedicated section to view all images shared within a single conversation.


## 🛠️ Technology Stack

| Category         | Technology                                                                                                  |
| ---------------- | ----------------------------------------------------------------------------------------------------------- |
| **Frontend** | React.js, Socket.IO Client, Axios, Tailwind CSS                             |
| **Backend** | Node.js, Express.js, Socket.IO                                                                              |
| **Database** | MongoDB, Mongoose (ODM)                                                                                     |
| **Auth & Security** | JSON Web Tokens (JWT), bcrypt.js                                                                            |
| **File Storage** | Cloudinary API                                                                                              |

---

## 🚀 Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

You need to have the following installed on your machine:
- Node.js (v18.x or higher)
- npm or yarn
- A free [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) account for the database.
- A free [Cloudinary](https://cloudinary.com/) account for image storage.

### Installation & Setup

1.  **Clone the repository:**
    ```sh
    git clone https://github.com/Hemanth-Muppa/ConvoNest.git
    cd ConvoNest
    ```

2.  **Backend Setup:**
    ```sh
    # Navigate to the server directory
    cd server

    # Install dependencies
    npm install

    # Create a .env file in the /server directory (see Environment Variables below)
    touch .env

    # Start the backend server
    npm start
    ```
    The backend will be running on `http://localhost:5000` (or your specified PORT).

3.  **Frontend Setup:**
    ```sh
    # Navigate to the frontend (root) directory from the project's root
    cd client

    # Install dependencies
    npm install

    # Create a .env file in the root directory (see Environment Variables below)
    touch .env

    # Start the frontend development server
    npm run dev
    ```
    The frontend will be running on `http://localhost:5173` (or the next available port).

---

### 🔑 Environment Variables

You need to create `.env` files for both the server and the client and add the following variables.

**1. Backend (`/server/.env`):**
```env
MONGODB_URL="your_mongodb_connection_string"
PORT=5000
JWT_SECRET="your_strong_jwt_secret_key"

CLOUDINARY_CLOUD_NAME="your_cloudinary_cloud_name"
CLOUDINARY_API_KEY="your_cloudinary_api_key"
CLOUDINARY_API_SECRET="your_cloudinary_api_secret"
```

**2. Frontend (`/client/.env`):**
```env
VITE_BACKEND_URL="http://localhost:5000"
```

---

### API Endpoints
A brief overview of the main API routes available.

| Method | Endpoint                    | Description                          | Protected |
|--------|-----------------------------|--------------------------------------|-----------|
| POST   | `/api/auth/signup`          | Register a new user                  | No        |
| POST   | `/api/auth/login`           | Log in an existing user              | No        |
| GET    | `/api/auth/check`           | Check if a user is authenticated     | Yes       |
| PUT    | `/api/auth/update-profile`  | Update user profile details          | Yes       |
| GET    | `/api/messages/users`       | Get all users for the sidebar        | Yes       |
| GET    | `/api/messages/:id`         | Get messages for a specific chat     | Yes       |
| POST   | `/api/messages/send/:id`    | Send a message to a user             | Yes       |
| PUT    | `/api/messages/mark/:id`    | Mark a message as seen               | Yes       |

---

## 🤝 Contributing

Feel free to open issues or submit pull requests. Please make sure to update tests as appropriate.


*Happy coding! 🚀*
