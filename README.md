# Sociogram

Sociogram is a full-stack social media web application built using the MERN (MongoDB, Express, React, Node.js) stack. It allows users to create profiles, share posts, follow other users, and interact in a social environment.

## Features

- **User Authentication**: Secure login and registration using JWT authentication.
- **Profile Management**: Users can create and update their profiles.
- **Post Creation & Interaction**: Users can create posts, like, and comment on posts.
- **Follow/Unfollow System**: Users can follow/unfollow others.
- **Cloudinary Integration**: Image uploads for profile pictures and posts.
- **Real-time Notifications** (Planned Feature): Receive updates when someone interacts with your posts.

## Tech Stack

- **Frontend**: React.js, Redux, Tailwind CSS
- **Backend**: Node.js, Express.js
- **Database**: MongoDB (MongoDB Atlas)
- **Authentication**: JWT (JSON Web Tokens)
- **Cloud Storage**: Cloudinary
- **Deployment**: (Add deployment details if hosted)

## Installation & Setup

### Prerequisites
Ensure you have the following installed:
- Node.js
- MongoDB (or a MongoDB Atlas connection)

### Steps
1. Clone the repository:
   ```bash
   git clone https://github.com/dev-SidD/SocioGram.git
   cd Sociogram
   ```
2. Install dependencies for both frontend and backend:
   ```bash
   cd backend
   npm install
   cd ../client
   npm install
   ```
3. Set up environment variables: Create a `.env` file in the backend folder and add:
   ```
   MONGO_URI=your_mongo_db_uri
   JWT_SECRET=your_secret_key
   CLOUDINARY_CLOUD_NAME=your_cloudinary_name
   CLOUDINARY_API_KEY=your_cloudinary_api_key
   CLOUDINARY_API_SECRET=your_cloudinary_api_secret
   ```
4. Start the backend server:
   ```bash
   cd backend
   npm start
   ```
5. Start the frontend:
   ```bash
   cd client
   npm start
   ```

## Contributing
Feel free to submit issues or pull requests to improve the project.

## License
This project is licensed under the MIT License.

## Contact
- **GitHub**: [dev-SidD](https://github.com/dev-SidD)
- **Email**: (Add your email if you want to be contacted)

