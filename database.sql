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

--вывод всех заказов
SELECT o.date, o.time, u.userName AS user_name, m.name AS master_name, c.title AS city_name
FROM orders o
JOIN users u ON o.user_id = u.id
JOIN masters m ON o.master_id = m.id
JOIN cities c ON u.city_id = c.id;