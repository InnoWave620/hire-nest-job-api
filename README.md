# Hire-Nest Job API

## Project Description

This project is a backend API for a job finding application, specifically tailored for domestic workers (Maids) and Landscapers in South Africa. It provides endpoints for creating, reading, updating, and deleting job listings. The API includes features for filtering, searching, and paginating job listings, as well as specific validation for minimum wages based on job category and work arrangement.

## Technologies Used

*   **Node.js**: JavaScript runtime environment.
*   **Express.js**: Web application framework for Node.js.
*   **Mongoose**: MongoDB object modeling for Node.js.
*   **MongoDB**: NoSQL database for storing job data.
*   **dotenv**: Module to load environment variables from a `.env` file.
*   **cors**: Middleware to enable Cross-Origin Resource Sharing.

## Setup Instructions

1.  **Clone the repository:**
    ```bash
    git clone <repository_url>
    cd hire-nest-api
    ```
2.  **Install dependencies:**
    ```bash
    npm install
    ```
3.  **Set up environment variables:**
    Create a `.env` file in the root directory of the project with the following content:
    ```env
    MONGO_URI=<Your MongoDB Connection String>
    PORT=5000 # Or any port you prefer
    ```
    Replace `<Your MongoDB Connection String>` with your actual MongoDB connection string (e.g., `mongodb://localhost:27017/hirenest`).
4.  **Start the server:**
    ```bash
    npm start
    ```
    The server should start and connect to your MongoDB database.

## API Endpoints

The API provides the following endpoints under the `/jobs` route:

### `POST /jobs` - Create a new job

Creates a new job listing. Includes validation for 'Maid' and 'Landscaper' categories to ensure minimum wage requirements are met based on `workArrangement`.

*   **Request Body:** JSON object containing job details.
    ```json
    {
      "title": "Job Title",
      "description": "Job Description",
      "location": "Job Location",
      "pay": 5500.00, // Monthly for full-time, Hourly for part-time
      "type": "Full-time" or "Part-time" or "Contract" or "Permanent",
      "category": "Maid" or "Landscaper",
      "workArrangement": "accommodation" or "part-time" or "full-time",
      "postedBy": "Recruiter Name"
    }
    ```
*   **Validation:**
    *   `category` and `workArrangement` are required and must be one of the specified enum values.
    *   For `category` 'Maid' or 'Landscaper':
        *   If `workArrangement` is 'full-time', `pay` must be >= R5067.04.
        *   If `workArrangement` is 'part-time', `pay` must be >= R28.79.
*   **Response:**
    *   `201 Created`: Returns the created job object.
    *   `400 Bad Request`: Returns an error message if validation fails or request body is invalid.

### `GET /jobs` - Get all jobs with filtering, searching, and pagination

Retrieves a list of job listings. Supports filtering, searching, and pagination via query parameters.

*   **Query Parameters:**
    *   `title` (optional): Search for jobs with titles containing this keyword (case-insensitive).
    *   `location` (optional): Search for jobs with locations containing this keyword (case-insensitive).
    *   `type` (optional): Search for jobs with types containing this keyword (case-insensitive).
    *   `category` (optional): Filter by exact category match ('Maid' or 'Landscaper').
    *   `workArrangement` (optional): Filter by exact work arrangement match ('accommodation', 'part-time', or 'full-time').
    *   `description` (optional): Search for jobs with descriptions containing this keyword (case-insensitive).
    *   `page` (optional, default: 1): The page number for pagination.
    *   `limit` (optional, default: 10): The number of jobs per page.
*   **Example Request:**
    ```
    GET /jobs?category=Maid&workArrangement=part-time&location=Durban&description=cleaning&page=2&limit=5
    ```
*   **Response:**
    *   `200 OK`: Returns a JSON object with paginated job data.
    ```json
    {
      "jobs": [
        // Array of job objects
      ],
      "currentPage": 1,
      "totalPages": 5,
      "totalJobs": 25
    }
    ```
    *   `500 Internal Server Error`: Returns an error message if a server error occurs.

### `GET /jobs/:id` - Get a specific job by ID

Retrieves a single job listing by its unique MongoDB ID.

*   **URL Parameter:** `:id` - The MongoDB ID of the job.
*   **Response:**
    *   `200 OK`: Returns the job object.
    *   `404 Not Found`: If no job with the given ID is found.
    *   `400 Bad Request`: If the provided ID format is invalid.
    *   `500 Internal Server Error`: If a server error occurs.

### `PUT /jobs/:id` - Update an existing job

Updates an existing job listing identified by its ID.

*   **URL Parameter:** `:id` - The MongoDB ID of the job to update.
*   **Request Body:** JSON object containing the fields to update. Includes the same validation as `POST /jobs`.
*   **Response:**
    *   `200 OK`: Returns the updated job object.
    *   `404 Not Found`: If no job with the given ID is found.
    *   `400 Bad Request`: If the provided ID format is invalid or validation fails.
    *   `500 Internal Server Error`: If a server error occurs.

### `DELETE /jobs/:id` - Delete a job

Deletes a job listing identified by its ID.

*   **URL Parameter:** `:id` - The MongoDB ID of the job to delete.
*   **Response:**
    *   `200 OK`: Returns a success message.
    ```json
    {
      "message": "Job deleted successfully"
    }
    ```
    *   `404 Not Found`: If no job with the given ID is found.
    *   `400 Bad Request`: If the provided ID format is invalid.
    *   `500 Internal Server Error`: If a server error occurs.

## Contributing

(Optional section: Add instructions on how others can contribute to your project)

## License

(Optional section: Add license information, e.g., MIT)