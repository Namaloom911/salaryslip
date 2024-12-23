README.md
markdown
Copy code
# Salary Slip Generator

This project is a web application that allows you to upload an Excel file and generate salary slips based on a predefined template (`sum.docx`) located in the project directory. The application processes the uploaded Excel file and generates salary slips in the `output` folder. Each salary slip is generated for an individual employee listed in the uploaded Excel file.

## Features

- Upload an Excel file containing employee data (Name, Basic Salary, Bonus, Commissions, etc.).
- Generate a salary slip for each employee using the `sum.docx` template.
- The generated salary slips are saved in the `output` folder.
- View the list of generated salary slips via a `GET` request to the `/output` endpoint.

## Prerequisites

- Node.js (version 14.x or later)
- npm (Node package manager)

## Installation

1. Clone the repository:
    ```bash
    git clone https://github.com/YourUsername/SalarySlipGenerator.git
    cd SalarySlipGenerator
    ```

2. Install the required dependencies:
    ```bash
    npm install
    ```

3. Ensure that the `sum.docx` template file is in the root directory of the project. This template will be used to generate the salary slips.

4. Start the server:
    ```bash
    npm start
    ```

The server will be running on `http://localhost:4000`.

## API Endpoints

### POST `/upload`

- **Description**: Upload an Excel file to generate salary slips.
- **Request**:
  - Form data: The file should be uploaded as `file` (of type `.xlsx`).
  - Example: Use Postman or a frontend form to upload the file.
- **Response**: A message indicating whether the file was uploaded and processed successfully.

### GET `/output`

- **Description**: View the list of generated salary slips.
- **Response**: A JSON array containing the names of all the files in the `output` folder. If no files are present, an empty array will be returned.

### Example Response from GET `/output`:

If the `output` folder contains files:
```json
{
  "files": [
    "John Doe.docx",
    "Jane Smith.docx"
  ],
  "message": "2 file(s) found in the output folder."
}
If the output folder is empty:

json
Copy code
{
  "files": [],
  "message": "0 file(s) found in the output folder."
}
File Structure
bash
Copy code
/SalarySlipGenerator
├── /output         # Folder where the generated salary slips are saved.
├── /uploads        # Temporary folder to store uploaded files.
├── /node_modules    # Node.js dependencies.
├── app.js           # Main application file containing the server logic.
├── sum.docx         # Template file for the salary slips.
├── package.json     # Project metadata and dependencies.
└── README.md        # This file.
How It Works
The user uploads an Excel file through the /upload endpoint.
The application reads the Excel file and processes each row to extract the employee data (e.g., Name, Basic Salary, Bonus).
The application uses the sum.docx template to generate a salary slip for each employee.
Each generated salary slip is saved as a .docx file in the output folder.
You can view the generated salary slips by making a GET request to /output.
Example Excel File Format
The Excel file should have the following columns (with their respective headers):

Name	Basic	Bonus	Commission	Tip	Google Reviews	Trust Pilot Reviews	Tax	Chargebacks	Refunds	Absent Fine	Fine	Advance	Total Payable
John Doe	3000	500	200	50	4.5	4.8	300	100	50	0	20	150	3800
Jane Smith	2500	400	150	40	4.7	4.9	250	80	30	0	10	100	3340
Each row corresponds to an employee, and their salary slip will be generated based on this data.

License
This project is licensed under the MIT License - see the LICENSE file for details.

markdown
Copy code

---

### Explanation of the Sections:
1. **Project Overview**: Describes what the project does (uploads Excel files and generates salary slips).
2. **Features**: Lists the functionality of the application.
3. **Installation**: Step-by-step instructions on how to clone the repository, install dependencies, and start the application.
4. **API Endpoints**: Describes the available endpoints, `POST /upload` for file upload, and `GET /output` to list the generated files.
5. **File Structure**: Displays the directory structure of the project.
6. **How It Works**: Explains the steps that the app takes to process the uploaded file and generate salary slips.
7. **Example Excel File Format**: Provides a sample structure for the uploaded Excel file.
8. **License**: Mentions that the project is open source with an MIT license.

---
