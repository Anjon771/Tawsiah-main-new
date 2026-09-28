package com.basira.tawsiah;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;


@SpringBootApplication
@EnableScheduling
public class TawsiahApplication {

	public static void main(String[] args) {
		SpringApplication.run(TawsiahApplication.class, args);
	}

}
