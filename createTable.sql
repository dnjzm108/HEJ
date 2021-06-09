create database HEJ;
use HEJ;

create table user(
userid VARCHAR(100) NOT NULL,
userpw VARCHAR(100) NOT NULL,
username VARCHAR(100) NOT NULL,
gender VARCHAR(100) NOT NULL,
user_email VARCHAR(100) NOT NULL,
user_address VARCHAR(100) NOT NULL,
user_number VARCHAR(100) NOT NULL,
user_birth VARCHAR(100) NOT NULL
);

create table qanda(
id int(11) primary key not NULL auto_increment,
write_name VARCHAR(100) NOT NULL,
gender VARCHAR(100) NOT NULL,
age VARCHAR(10) NOT NULL,
email VARCHAR(100) NOT NULL,
pone_number VARCHAR(100) NOT NULL,
content VARCHAR(100) NOT NULL
);
create table comment(
    id int(11) primary key not NULL auto_increment,
    userid VARCHAR(20) NOT NULL,
    content VARCHAR(100) NOT NULL,
    idx int(11)
)charset=utf8mb4;

create table board(
title VARCHAR(100) NOT NULL,
userid VARCHAR(20) NOT NULL,
write_date datetime default current_timestamp,
content text NOT NULL,
board_image VARCHAR(100),
hit int(11) not null,
idx int(11) not null auto_increment primary key,
write_type VARCHAR(50) NOT NULL
)auto_increment=1 default charset=utf8mb4;

create table information(
info_image VARCHAR(100) NOT NULL,
title VARCHAR(100) NOT NULL,
conent VARCHAR(100) NOT NULL
);

alter database HEJ default character set UTF8;