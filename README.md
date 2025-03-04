# NGOCONNECT

## 🚀 Introduction
This is a **Node.js** application that uses **JWT + Cookies** for authentication and also supports **Google OAuth** for login.

## 📂 Environment Variables
Create a `.env` file in the root directory and add the following values:

```plaintext
DATABASE_URL=your_database_url
JWT_SECRET=your_jwt_secret
JWT_EXPIRY=your_jwt_expiry_time
PORT=your_server_port
NODE_ENV=development

GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_CALLBACK_URL=your_google_callback_url