package com.senai.projeto.ControlTechBack.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.EnableWebMvc;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
@EnableWebMvc
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**") // Aplica a todos os endpoints da API
                .allowedOrigins(
                        "http://localhost:3000",        // Para seu ambiente de desenvolvimento
                        "http://localhost:8080",        // Para seu ambiente de teste local
                        "https://control-tech-six.vercel.app" // ESSA É A CHAVE: Permite o Front-End da Vercel
                )
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                .allowCredentials(true); // Se você usa cookies ou sessões
    }
}