# DSA Company Questions Viewer

A MERN stack application that displays company-specific DSA questions from a GitHub repository.

## Features

- View DSA questions by company
- Filter by timeframe (Thirty Days, Three Months, Six Months, One Year)
- Filter by difficulty level
- Filter by minimum acceptance rate
- Clean and minimal UI using Material-UI
- Direct integration with GitHub repository

## Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)

## Setup

1. Clone the repository:
```bash
git clone <your-repo-url>
cd <repo-name>
```

2. Install dependencies:
```bash
npm run install-all
```

This will install dependencies for both frontend and backend.

## Running the Application

1. Start both frontend and backend servers:
```bash
npm start
```

This will start:
- Backend server on http://localhost:5000
- Frontend development server on http://localhost:3000

## Usage

1. Open your browser and navigate to http://localhost:3000
2. Select a company from the dropdown
3. Choose a timeframe
4. (Optional) Set difficulty level and minimum acceptance rate
5. Click "Search" to view the questions
6. Click on any question title to open it on LeetCode

## API Endpoints

- GET `/api/companies` - Get list of all companies
- GET `/api/questions/:company/:timeframe` - Get questions for a specific company and timeframe
  - Query parameters:
    - `difficulty` (optional): Filter by difficulty level
    - `acceptanceRate` (optional): Filter by minimum acceptance rate

## Technologies Used

- Frontend:
  - React.js
  - Material-UI
  - Axios

- Backend:
  - Node.js
  - Express.js
  - Axios
  - csv-parse

## License

MIT 