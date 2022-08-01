USE IRRIGA;

CREATE TABLE cities_weather (
	city_id INT NOT NULL,
	datetime DATETIME NOT NULL,
	temp DECIMAL(5,2) NOT NULL,
	max_temp DECIMAL(5,2) NOT NULL,
	min_temp DECIMAL(5,2) NOT NULL,
	vel_vento DECIMAL(5,2) NOT NULL,
	nascer_sol DATETIME NOT NULL,
	por_sol DATETIME NOT NULL,
	qtd_chuva INT NOT NULL,
	FOREIGN KEY (city_id) REFERENCES cities(id)
);
