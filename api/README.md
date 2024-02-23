# how to start
1. create a database in mysql
   mysql -u root -p123456
   CREATE DATABASE movie_db;
   quit
2. populate the database
   mysql -u root -p123456 movie_db < movie_dump.sql
3. run the server