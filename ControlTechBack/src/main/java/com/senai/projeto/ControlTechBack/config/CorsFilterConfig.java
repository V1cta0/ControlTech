package com.senai.projeto.ControlTechBack.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;

@Configuration
public class CorsFilterConfig {
    @Bean
    public CorsFilter corsFilter() {
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        CorsConfiguration config = new CorsConfiguration();

        config.setAllowCredentials(true);
        config.addAllowedOrigin("https://control-tech-six.vercel.app");
        config.addAllowedOrigin("http://localhost:3000"); // Local

        config.addAllowedMethod("*"); // Permite GET, POST, etc.
        config.addAllowedHeader("*"); // Permite todos os cabeçalhos

        source.registerCorsConfiguration("/**", config);

        return new CorsFilter(source);
    }
}