package com.talentconnect.backend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.ComponentScan;

@SpringBootApplication
@ComponentScan(basePackages = "com.talentconnect.backend")
public class TalentconnectBackendApplication {
	public static void main(String[] args) {
		SpringApplication.run(TalentconnectBackendApplication.class, args);
	}
}
