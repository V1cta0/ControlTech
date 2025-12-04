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
        registry.addMapping("/**")
                .allowedOrigins(
                        // ORIGENS PERMITIDAS
                        "http://localhost:3000",
                        "http://localhost:8080",
                        "https://control-tech-six.vercel.app", // Domínio do Front-end (Vercel)
                        "https://controltech.up.railway.app"  // CORRIGIDO: Domínio do Back-end Railway (necessário em alguns casos)
                )
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                .allowedHeaders("*")
                .allowCredentials(true); // Adicionado para compatibilidade com autenticação futura
    }
}