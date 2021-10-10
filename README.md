1. Navigate to each folder and run npm install
2. Navigate to each folder and run npm start
3. The frontend will run on http://localhost:3000/
4. The backend will run on http://localhost:5000/
5. The web socket will run on http://localhost:7000/


YOU WILL NEED TO CONNECT THIS PROJECT TO YOUR OWN DATABASE THROUGH THE MONGODB SITE.


04/10/2021 - BUGS

Found two bugs in testing in create account that need to be resolved.

1. First app crashes when creating an account without a picture, needs proper error handerling. 
2. Age accpets a string in account creation returns users to login page as if the ccount was created, needs to be resolved. 