package com.talentconnect.backend.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.*;

@Configuration
public class WebConfig {
    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/**")
                        .allowedOrigins(
                                "http://localhost:5173",
                                "http://talent-connect.s3-website-ap-southeast-2.amazonaws.com",
                                "http://d2s57y3bv04cxg.cloudfront.net", "https://d2s57y3bv04cxg.cloudfront.net")
                        .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                        .allowCredentials(true);
                System.out.println("✅ CORS config applied by WebConfig!");
            }
        };
    }
}
