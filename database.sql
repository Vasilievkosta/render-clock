create TABLE ratings(
	id SERIAL PRIMARY KEY,
	rating INTEGER NOT NULL	
);

create TABLE masters(
	id SERIAL PRIMARY KEY,
	name VARCHAR(255) NOT NULL,
	rating_id INTEGER,
	FOREIGN KEY (rating_id) REFERENCES ratings (id)
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
	email VARCHAR(50),	
	city_id INTEGER,
	FOREIGN KEY (city_id) REFERENCES cities (id)
);

create TABLE orders(
	id SERIAL PRIMARY KEY,
	date VARCHAR(100),
	time VARCHAR(100),
	duration INTEGER,
	user_id INTEGER,
	master_id INTEGER,
	FOREIGN KEY (user_id) REFERENCES users (id),
	FOREIGN KEY (master_id) REFERENCES masters (id)
);
