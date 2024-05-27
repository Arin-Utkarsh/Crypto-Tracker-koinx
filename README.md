How to run this:
Open the app folder on vs code
 -open terminal and run npm install
  -run node index.js

  
How to test the apis through postman:
Open Postman and create a new POST request.

Set the request URL to: http://localhost:3000/balance.

Go to the Body tab and select raw.

Set the type to JSON.
click on send 
After this data from the csv file will be saved on your database mongodb and use post http method

execute this api with {
  "timestamp": "2022-09-27 12:00:00"
} in body part of api 
http://localhost:3000/balance/  
click on send 
you will get the result in json data 
