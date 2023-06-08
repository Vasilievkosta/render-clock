create TABLE masters(
	id SERIAL PRIMARY KEY,
	name VARCHAR(255) NOT NULL
);

create TABLE cities(
	id SERIAL PRIMARY KEY,
	title VARCHAR(255) NOT NULL
);

create TABLE master_cities(
	master_id INTEGER,
	city_id INTEGER,
	FOREIGN KEY (master_id) REFERENCES masters (id),	
	FOREIGN KEY (city_id) REFERENCES cities (id)	
);

create TABLE users(
	id SERIAL PRIMARY KEY,
	userName VARCHAR(30),
	email VARCHAR(30),
	date VARCHAR(100),
	time VARCHAR(100),
	city_id INTEGER,
	FOREIGN KEY (city_id) REFERENCES cities (id)
);
