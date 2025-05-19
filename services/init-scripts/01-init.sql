CREATE DATABASE IF NOT EXISTS auth_service;
CREATE DATABASE IF NOT EXISTS game_service;

CREATE USER IF NOT EXISTS 'auth_user'@'%' IDENTIFIED WITH mysql_native_password BY 'auth_pass';
GRANT ALL PRIVILEGES ON auth_service.* TO 'auth_user'@'%';

CREATE USER IF NOT EXISTS 'game_user'@'%' IDENTIFIED WITH mysql_native_password BY 'game_pass';
GRANT ALL PRIVILEGES ON game_service.* TO 'game_user'@'%';

FLUSH PRIVILEGES;