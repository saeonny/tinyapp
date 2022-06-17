# TinyApp Project

TinyApp is a full stack web application built with Node and Express that allows users to shorten long URLs (à la bit.ly).

## Final Product
!["First Page when we logged in"](https://github.com/saeonny/tinyapp/blob/main/docs/url_page(logined).png)
!["Login Error"](https://github.com/saeonny/tinyapp/blob/main/docs/login_error.png)
!["when we create New url"](https://github.com/saeonny/tinyapp/blob/main/docs/url_create.png)

## Dependencies

- Node.js
- Express
- EJS
- bcrypt
- body-parser
- cookie-session


## Getting Started

- Install all dependencies (using the `npm install` command).
  
- Run the development web server using the `node express_server.js` command.
- click http://localhost:8080/urls or copy and paste this link to your webbrowser.

## Features
Main feature of TinyApp is shortening long URLs, allows user to manage all created shortening URLs, and allow to direct to web site using shortURL.
- Register users with email and password (eithe cannot be empty)
- Login/Logout 
- On Create New URL tab, users can create short-URL using long-URL and saved to MY URLs
- On MY URLS (main page), users can manage(edit long-URL or delete) their created short-URL
- Anyone can visit targeted website using short-URL 
  - Form : https://localhost/u/"shot-url"
  - ex) if short-url is b2xVn2   : https://localhost/u/b2xVn2
- Users password and cookies are bcrypted (secured)
- To test TinyApp user can use admin email and password to login
  - email : admin1@mail.com,  password:1234

