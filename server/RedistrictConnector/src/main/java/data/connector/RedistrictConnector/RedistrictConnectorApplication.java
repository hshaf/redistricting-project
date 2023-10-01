package data.connector.RedistrictConnector;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.jdbc.DataSourceAutoConfiguration;


@SpringBootApplication(exclude = {DataSourceAutoConfiguration.class}) //Temporary exclusion without DB?
public class RedistrictConnectorApplication {

	public static void main(String[] args) {
		SpringApplication.run(RedistrictConnectorApplication.class, args);
	}

	

}
