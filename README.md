# Tour Management System

Tour Management System is a web application designed to manage tours, bookings, and guides for a tour company. This project utilizes a full-stack architecture with React.js for the frontend and Node.js with Express.js for the backend. MongoDB is used as the database to store tour, booking, and guide information.

![Preview image 1](/client/public/img/Booking_login.jpg)
![Preview image 2](/client/public/img/Booking_calendar.jpg)
![Preview image 3](/client//public/img/Booking_booking_side_overview.jpg)

## Features

- **Dashboard**: View an overview of tours, bookings, and guides.

- **Tours**: Create, update, and delete tours with details such as tour name, date, and location.

- **Bookings**: Manage bookings for each tour, including details such as group name, contact information, and status.

- **Guides**: Add, edit, and remove guides with their personal information and availability.

- **Image Upload**: Upload images for tours and guides directly from the application.

- **Filtering and Sorting**: Filter and sort tours, bookings, and guides based on various criteria.

## Installation

```bash
**Note**: Before running this project locally, please ensure you have set up your own MongoDB Atlas connection. You can do this by signing up for a MongoDB Atlas account and configuring the connection string in the appropriate environment variables or configuration files.

```

To run this project locally, follow these steps:

1. Clone the repository:

```bash
git clone https://github.com/LucasDaSilva96/Tour-Management-System.git
```

2. Navigate to the server directory and install dependencies:

```bash
cd server
npm install
```

3. Create a .env file in the server directory and configure environment variables:

- **DATABASE**: Here goes the mongoDB Atlas connection string with username and password.

- **JWT_SECRET**: Here goes the secret sentence that is used to encrypt jwt-tokens

- **JWT_EXPIRES_IN**: Here goes the amount of days before the generated jwt-token expires. Example: 100 days.

- **JWT_COOKIE_EXPIRES_IN**: Here goes the amount of days before the jwt cookie expires. Example: 100, 80 , 50 and so on...

- **PORT**: Define a port number to run the server in.

4. Start the server:

```bash
npm start
```

5. Navigate to the client directory and install dependencies:

```bash
cd ../client
npm install
```

6. Start the client:

```bash
npm run start
```

## Technologies Used

- **Frontend**: React.js, Redux, Material-UI
- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **Image Upload**: Multer
- **Authentication**: JSON Web Tokens (JWT)
- **State Management**: Redux Toolkit
- **HTTP Requests**: Axios
- **Date Formatting**: Day.js
- **File Handling**: fs (Node.js File System)
- **Middleware**: Multer
- Deployment: render (backend), render (frontend)

## Contributing

Contributions are welcome! Please fork the repository and create a pull request with your changes. Be sure to follow the [contributing guidelines](https://github.com/LucasDaSilva96/Tour-Management-System/blob/main/CONTRIBUTING.md).

## License

This project is licensed under the GPL-3.0 License - see the LICENSE file for details.
