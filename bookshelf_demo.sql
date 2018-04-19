DROP DATABASE IF EXISTS bookshelf_db;
DROP USER IF EXISTS bookshelf_user;
CREATE USER bookshelf_user WITH ENCRYPTED PASSWORD 'password';
CREATE DATABASE bookshelf_db OWNER bookshelf_user;
\c bookshelf_db;
SET ROLE bookshelf_user;