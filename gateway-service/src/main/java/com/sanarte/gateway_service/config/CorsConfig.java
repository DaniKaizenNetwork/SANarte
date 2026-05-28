package com.sanarte.gateway_service.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.reactive.UrlBasedCorsConfigurationSource;

import org.springframework.web.cors.reactive.CorsWebFilter;

import java.util.Arrays;
import java.util.List;

@Configuration
public class CorsConfig {

        @Value("${cors.allowed.origins:http://localhost:4200,http://localhost:4201}")
        private String allowedOriginsStr;

        @Bean
        public CorsWebFilter corsWebFilter() {

                CorsConfiguration config = new CorsConfiguration();

                List<String> origins = Arrays.asList(allowedOriginsStr.split(","));
                config.setAllowedOrigins(origins);

                config.setAllowedMethods(List.of(
                                "GET",
                                "POST",
                                "PUT",
                                "DELETE",
                                "OPTIONS"));

                config.setAllowedHeaders(List.of("*"));

                config.setAllowCredentials(true);

                UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();

                source.registerCorsConfiguration("/**", config);

                return new CorsWebFilter(source);
        }
}