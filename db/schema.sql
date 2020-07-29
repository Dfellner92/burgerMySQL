Drop database if exists burgers_db;
Create database burgers_db;
Use burgers_db;

create table burgers (
    id int auto_increment primary key,
    burger_name varchar(220) not null,
    devoured boolean not null 
);

