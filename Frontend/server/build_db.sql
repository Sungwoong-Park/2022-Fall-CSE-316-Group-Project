CREATE DATABASE IF NOT EXISTS diary;

USE diary;

CREATE TABLE IF NOT EXISTS users(
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id VARCHAR(256),
    password VARCHAR(256),
    user_name VARCHAR(256),
    user_email VARCHAR(256),
    address_f VARCHAR(256),
    address_l VARCHAR(256),
    img VARCHAR(256)
);

INSERT INTO users (user_id, password, user_name, user_email, address_f, address_l, img)
VALUES ("abc123", "4119f341f23c55ebf02d7bd735946d6a8cf03f390ff6a9c7c1ce6641a5469b16", "JunHyeongPark", 
"abc123@extemp.com", "119 songdo moonwha-ro", "Incheon, Yeonsu-gu, Korea", "");

-- ID: abc123 , pwd: 112980317 password is crypted in SHA256 in crypto-js SHA256


CREATE TABLE IF NOT EXISTS logday(
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id VARCHAR(256),
    date DATE,
    question_set VARCHAR(256)
);

INSERT INTO logday(user_id, date, question_set)
VALUES("abc123", "2022-11-18", "Number of pushups|");

-- today's date can be obtained by DATE_FORMAT(now(), '%Y-%m-%d')
-- question set is question strings that added all of the questions

CREATE TABLE IF NOT EXISTS questions(
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id VARCHAR(256),
    date DATE,
    question_order INT,
    question VARCHAR(256),
    question_value VARCHAR(256),
    question_type VARCHAR(256)
);

INSERT INTO questions(user_id, date, question_order, question, question_value, question_type) VALUES(
    "abc123", "2022-11-18", 0, "Number of pushups", "20", "Number"
);

-- compare with date and user_id and get question and questoion_value
-- we dont need to think about question_type since it is varchar
-- order is the order of question set, if we change the question set, reassemble question set
-- and put into question_set, split the question_set and put index number into order and String into question