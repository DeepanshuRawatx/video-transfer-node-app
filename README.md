# Node.js Video Transfer Application

This Node.js application facilitates the transfer of video files from one location to another using Google Drive API. It supports downloading video files from a source location and uploading them to a specified destination folder on Google Drive using chunked uploading mechanism with endpoint to monitor the status of both the download and the chunked upload processes, providing visibility into the progress of each chunk. .

## Table of Contents

- [Getting Started](#getting-started)
- [Monitoring Progress](#monitoring-progress)
- [API Endpoints](#api-endpoints)
- [Postman Collection](#postman-Collection)
- [File Transfer Process](#file-transfer-process)
- [Dependencies](#dependencies)
- [Usage](#usage)
- [License](#license)

## Getting Started

Before running the application, ensure you have Node.js installed on your system. You'll also need to set up Google Drive API credentials and obtain the necessary JSON file containing your credentials.

1. Clone this repository to your local machine.
2. Install the dependencies by running `npm install`.
3. Place your Google Drive API credentials JSON file (e.g.,`nooro-key-credentials.json`) in the project directory.
4. Customize the application as needed.

## Monitoring Progress

The application provides an endpoint to monitor the progress of ongoing file transfer processes. You can access the progress information by sending a GET request to `/progress`.

GET /progress: Retrieves the progress information of ongoing file transfer processes, including both download and upload progress. The response provides details about the percentage of completion for both processes.

Download Progress: The download progress indicates the percentage of the file that has been successfully downloaded from the source location.

Upload Progress: The upload progress represents the percentage of the file that has been successfully uploaded to the destination folder on Google Drive using chunked uploading mechanism.

Clients can send GET requests to /progress to monitor the progress of ongoing file transfers in real-time.

The progress information is updated dynamically during the execution of download and upload processes, providing users with insights into the status of each operation.

This feature enables users to track the progress of file transfers and monitor the performance of the application during data transmission.

## API Endpoints

The application exposes the following API endpoints:

- `GET /progress`: Retrieves the progress information of ongoing file transfer processes.
- `POST /transfer-video`: Initiates the process to transfer a video file from a source location to a specified destination folder on Google Drive.

## Postman Collection
Included in this repository is a Postman collection file named nooro.postman_collection.json, which contains a set of pre-defined requests for interacting with the API endpoints provided by this application. The collection file enables easy testing and integration of the application's functionality.

Importing the Postman Collection
To import the Postman collection into your Postman workspace, follow these steps:

Download the nooro.postman_collection.json file from the repository.
Open Postman and locate the "Import" button in the upper-left corner of the application.
Click on "Import" and select the downloaded nooro.postman_collection.json file.
Postman will import the collection into your workspace, allowing you to explore the available API requests.
Using the Postman Collection
Once imported, you can use the Postman collection to interact with the API endpoints provided by the Node.js application. Each request within the collection includes pre-configured parameters and authentication settings, making it easy to test various scenarios and verify the application's behavior.

## File Transfer Process

The file transfer process involves the following steps:

1. **Initiating Transfer**: Send a POST request to `/transfer-video` with the source file ID and destination folder ID.
2. **Downloading**: The application downloads the video file from the source location using the Google Drive API.
3. **Uploading**: After downloading, the application uploads the video file to the specified destination folder on Google Drive.

## Dependencies

This application utilizes the following dependencies:

- `express`: Web framework for Node.js.
- `googleapis`: Official Node.js client library for Google APIs.
- `fs`: Node.js built-in module for file system operations.
- `dotenv`: Library for loading environment variables from a `.env` file.

## Usage

To run the application, execute the following command:

```bash
node app.js
```

By default, the application runs on port 3000. You can customize the port by setting the `PORT` environment variable.

