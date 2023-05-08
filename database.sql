create TABLE city(
	id SERIAL PRIMARY KEY,
	title VARCHAR(255) NOT NULL
);

create TABLE master(
	id SERIAL PRIMARY KEY,
	name VARCHAR(255),	
	city_id INTEGER,
	FOREIGN KEY (city_id) REFERENCES city (id)
);

create TABLE users(
	id SERIAL PRIMARY KEY,
	userName VARCHAR(30),
	email VARCHAR(30),
	date VARCHAR(100),
	time VARCHAR(100),
	city_id INTEGER,
	FOREIGN KEY (city_id) REFERENCES city (id)
);