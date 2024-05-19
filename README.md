# User-Management API

## Overview

The User-Management API is a RESTful service for managing user lists with customizable properties and sending personalized emails to users. This API supports creating user lists, adding users via CSV upload, sending customized emails with placeholders, and handling user unsubscriptions.

## Features

- **List Creation**: Admins can create a user list with a title and custom properties.
- **User Addition**: Admins can add users to the list via CSV upload. The CSV can handle large files with 10,000+ records.
- **Email Sending**: Send personalized emails to all users in a list. Custom properties can be included as placeholders in the email body.
- **Unsubscribe Users**: Users can unsubscribe from receiving further emails from a specific list.

## Tech Stack

- Node.js
- Express.js
- MongoDB

## Getting Started

### Prerequisites

- Node.js installed on your local machine
- MongoDB instance (local or cloud-based)
- An email service provider account (e.g., Gmail)

### Installation

1. Clone the repository:
  ```bash
  git clone https://github.com/jayantsingh-22/user-management-api.git
  cd user-management-api
  ```

2. Install the dependencies:
    ```bash
    pnpm install
    ```

3. Create a `.env` file in the root directory and add your environment variables:
    ```plaintext
    EMAIL_USER=your-email@gmail.com
    EMAIL_PASS=your-email-password
    MONGODB_URI=your-mongodb-uri
    ```

### Running the Application

To start the application, run:
  ```bash
  pnpm start
  ```


## API Endpoints

### Create a List

- **Endpint**: `/api/lists/create-list`
- **Method**: `POST`
- **Body**:
    ```json
    {
        "title": "List Title",
        "customProperties": [
            { "title": "city", "fallbackValue": "Unknown" },
            { "title": "age", "fallbackValue": "N/A" }
        ]
    }
    ```
- **Response**:
    ```json
    {
        "_id": "list_id",
        "title": "List Title",
        "customProperties": [
            { "title": "city", "fallbackValue": "Unknown" },
            { "title": "age", "fallbackValue": "N/A" }
        ],
        "users": []
    }
    ```

### Upload Users

- **Endpoint**: `/api/users/upload-users/:listId`
- **Method**: `POST`
- **File**: CSV file with headers `name`, `email`, and any custom properties
- **Response**:
    ```json
    {
        "successCount": 5,
        "failureCount": 2,
        "totalUsers": 7,
        "failedUsers": [
            { "name": "Jane Doe", "email": "jane.doe@email.com", "error": "Duplicate email" }
        ]
    }
    ```

### Send Email

- **Endpoint**: `/api/email/send-email`
- **Method**: `POST`
- **Body**:
    ```json
    {
        "listId": "list_id",
        "subject": "Email Subject",
        "text": "Email Body"
    }
    ```
- **Response**:
    ```json
    {
        "success": true
    }
    ```

### Unsubscribe User

- **Endpoint**: `GET /api/email/unsubscribe/:listId/:email`
- **Method**: `GET`
- **Response**:
    ```json
    {
        "message": "You have been unsubscribed successfully."
    }
    ```


## Contributing

1. Fork the repository.
2. Create a new branch (`git checkout -b feature-branch`).
3. Make your changes.
4. Commit your changes (`git commit -m 'Add new feature'`).
5. Push to the branch (`git push origin feature-branch`).
6. Create a new Pull Request.

## Postman Documentation

The link to the published postman documentation is provided below:
``` bash
https://documenter.getpostman.com/view/25282018/2sA3JT4eUm
```

## License

This project is licensed under the MIT License.

