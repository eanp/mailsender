# Node.js Mail Sender

This is a Node.js application that sends emails using Nodemailer. It provides an HTTP API endpoint for sending emails with customizable destination, subject, and content.

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [Endpoints](#endpoints)
- [Configuration](#configuration)
- [Contributing](#contributing)
- [License](#license)

## Installation

1. Clone the repository:

   ```bash
   git clone <repository-url>
   ```

2. Navigate to the project directory:

   ```bash
   cd mailsender
   ```

3. Install dependencies:

   ```bash
   npm install
   ```

## Usage

To run the application, use the following command:

```bash
npm start
```

The application will start listening on the specified port (default is 3000) and be accessible at http://localhost:3000.

## Endpoints

### POST /

This endpoint is used to send an email. It accepts a JSON payload with the following properties:

- `destination`: The email address of the recipient.
- `subject`: The subject of the email.
- `text`: The content of the email.
- `email`: The sender's email address.
- `password`: The sender's email password.

Example request:

```bash
curl -X POST \
  -H "Content-Type: application/json" \
  -d '{
        "destination": "recipient@example.com",
        "subject": "Hello",
        "text": "This is a test email",
        "email": "sender@example.com",
        "password": "password123"
      }' \
  http://localhost:3000/
```

### GET /

This endpoint returns a simple message indicating that the server is running.

Example request:

```bash
curl http://localhost:3000/
```

## Configuration

The application uses environment variables for configuration. Before running the application, make sure to create a `.env` file in the project root directory and define the following variables:

```
BASE_PORT=3000
BASE_URL=http://localhost
```

## Contributing

Contributions are welcome! If you find any issues or would like to add new features, please open an issue or submit a pull request.

## License

This project is licensed under the [MIT License](LICENSE).
