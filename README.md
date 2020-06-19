# Administrative API Examples



[![Build Status](https://travis-ci.org/joemccann/dillinger.svg?branch=master)](https://travis-ci.org/joemccann/dillinger)




# Node Version : v12.18.1 with Visual Studio Code

# 1)Installation and Running the application
```sh
  1. Open Terminal
  2. Change Destination to Project Folder (Open Folder)
  3. Type (without Quotations) "NPM install" in Terminal to load missing dependencies
  4. Wait for download to complete
  5. Type (without Quotations) "NPM start" in Terminal to launch application
```

# 2) Project Structure
| Folder/File | Description |
| ------ | ------ |
| README.md |This file |
| adminsystem.sql | Exported mysql DB structure|
| routes -> api.js | contains the required APIs |
| model | folder containing the model.js files for db operations |
| test -> apitest.js | unit test file utilizing mocha and chai|
|testingimages|images to show tests done with postman and unit testing|
|dbconfig.js| file containing db information for db operations|

base URL route is implemented as http://localhost:3000
# 3)Database Information - MySQL Community Server 8.0.20
The following are the defaults database values used for this project, if required, please update dbconfig.js with your local changes :
| Setting | Value |
| ------ | ------ |
| Hostname | 127.0.0.1 |
| Username | root |
| password | 123123 |

Please import the required tables through importing adminsystem.sql

# 4) Core packages utilized for this project
| Package | Purpose |
| ------ | ------ |
| bookshelf | db operations |
| knex | db operations |
| get-emails | extract email from string |
| mocha | unit testing |
| chai | unit testing |

# 5) Unit testing with Mocha

```sh
  1. Open Terminal
  2. Type (without Quotations) "$ npm install --global mocha" in Terminal to load missing dependencies
  3. Type (without Quotations) "mocha" in terminal
  4. Check unit tests status
```
Please check the testingimages folder to compare if unit testing ran as intended

# 6) Implemented APIs

| API | Status | API Endpoint
| ------ | ------ |------|
| register | Implemented |[Post] /api/register|
| commonstudents | Implemented |[Get] /api/commonstudents|
| suspend | Implemented |[Post] /api/suspend|
| retrievefornotifications | Implemented |[Post] /api/retrievefornotifications|


# 7)Final Checklist
| Subject | Status |
| ------ | ------ |
| Please use NodeJS / ExpressJS for the backend code | Implemented |
| Please use MySQL as the database | Implemented |
| Please use an ORM or Query Builder | bookshelf and knex Implemented |
| Please use async / await in your code | Implemented |
|Please include unit tests| mocha and chai Implemented|

