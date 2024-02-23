## A. How to Start Server

1. **Create a Database in MySQL**
    - Open a MySQL session:
        ```bash
        mysql -u root -p123456
        ```
    - Create a database:
        ```sql
        CREATE DATABASE movie_db;
        ```
    - Quit the MySQL session:
        ```sql
        quit
        ```

2. **Import the Database**
    - Execute the following command:
        ```bash
        mysql -u root -p123456 movie_db < movie_db.sql
        ```

3. **Start the Server**
    - Install dependencies:
        ```bash
        npm install
        ```
    - Generate Prisma client:
        ```bash
        npx prisma generate
        ```
    - Start the server using nodemon:
        ```bash
        npx nodemon app.js
        ```
