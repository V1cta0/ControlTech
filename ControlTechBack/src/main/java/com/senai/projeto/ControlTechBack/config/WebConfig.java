package com.senai.projeto.ControlTechBack.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        // CORRIGIDO: Removido o problemático allowedOriginPatterns("*") e adicionadas as origens explícitas.
        registry.addMapping("/**")
                .allowedOrigins(
                        "https://control-tech-six.vercel.app",  // Domínio do seu Front-end
                        "https://controltech.up.railway.app",   // Domínio do seu Back-end (Garantia)
                        "http://localhost:3000",                // Desenvolvimento local
                        "http://localhost:8080"                 // Desenvolvimento local
                )
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                .allowedHeaders("*")
                .allowCredentials(true)
                .maxAge(3600);
    }
}