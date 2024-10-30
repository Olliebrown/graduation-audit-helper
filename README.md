# UW Stout Advising App (Access Stout Only)
This is a tool to scrape student data from Access stout. It will only work with valid credentials
that must be manually entered and validated via two-step. It will store the data in a local JSON
file and provides a simple front-end viewer to quickly see the status of a student based on the
data scraped from their advising audit.

It works by using Puppeteer to automate the process of logging in and navigating to the student's
audit page. It then scrapes the data from the page and stores it in a JSON file. You must manually approve the login with your two-step verification method.

It also provides a rudimentary front-end for viewing the generate json file which is a WIP.

NOTE: This has only been tested with a few different programs:
- B.S. in Computer Science
- Minors in Mathematics, Design, Computer Networking Systems & Design, and Information Security Management

It will almost certainly make mistakes with other programs as each one is rendered with a unique and
esoteric HTML structure inside access stout (WHY!?!?!).

## Prerequisites
This is a node.js based project. Node will install all the necessary dependencies for the project.

Modules used:
- Puppeteer for scraping
- Material-UI & React for the front-end
- esbuild for bundling of front-end

## Usage
After cloning and installing dependencies with `npm install`, you must provide the following:
- A .env file with private credentials:
  - `USERNAME` as your UWStout email (with @uwstout.edu or @my.uwstout.edu)
  - `PASSWORD` as your UWStout password
  - CAUTION: These are stored in plain text so treat them very carefully!!
- A data file with lists of student IDs to scrape.
  - This should be a JSON file with an array of objects that, at a minimum, contains a `campusId` key.
  - You can add any extra data you want to store about the student in this object.
  - Example:
    ```json
    [
      {
        "campusId": "1234567",
        "firstName": "John",
        "lastName": "Doe",
        "email": "doej@my.uwstout.edu"
      },
      {
        "campusId": "7654321",
        "firstName": "Janell",
        "lastName": "Smith",
        "email": "smithj@my.uwstout.edu"
      }
    ]
    ```
- Edit `scraper/index.js` to change the path to the data file if necessary.
  - You may also want to edit the path of the output file
  - We recommend placing them in `scraper/data` and/or `output` as the content of these folders are excluded from the repository.
  - Data in `output` will be automatically copied to `public/data` for viewing in the front-end.
- Run the scraper with `npm run scrape`
- After scraping, you can view the data by running `npm run client:devServer` and navigating to `localhost:3000` in your browser.
