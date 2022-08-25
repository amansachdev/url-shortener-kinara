#### API Documentation
> **/short** 
1. Takes the fullUrl parameter from the req.body and insert then wait for the record to be inserted using the model.

Example of POSTMAN
![image](https://user-images.githubusercontent.com/46645259/186361927-9e1bf319-753f-41ac-a5e0-27df0abe057c.png)

> **/expand** 
1. Requires the short url ID.
2. searches for the long url in DB.
3. Returns the long url.

> **/delete** 
1. Removes the particular record from the database.
2. Requires the shortURL ID to be passed. 

#### Testing using mocha
1. npm run test
![image](https://user-images.githubusercontent.com/46645259/186401170-2918cd2f-8da9-4455-a945-75e4a47269f6.png)

#### MongoDB
Using hashed passwords.
![image](https://user-images.githubusercontent.com/46645259/186421157-69096794-22ed-4787-9aac-8aa409d42146.png)


#### Prerequisites

1. Basic Understanding of Node and JavaScript.
2. Node and NPM installed.

#### How to Start

1. Clone the repo. 
2. Run `npm install`
3. Run `node server.js`
4. Server will be running at `locahost:5000`
