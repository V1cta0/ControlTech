package com.senai.projeto.ControlTechBack.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**") // Libera todas as rotas
                // CORREÇÃO: Usamos allowedOriginPatterns para aceitar qualquer porta local, como 5502
                .allowedOriginPatterns(
                        "https://control-tech-six.vercel.app", // URL do Front em produção
                        "http://localhost:*",                  // Aceita qualquer porta local (ex: 8080, 5502, 3000)
                        "http://127.0.0.1:*"                   // Aceita qualquer porta local (incluindo 5502)
                )
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS", "HEAD", "TRACE", "CONNECT")
                .allowedHeaders("*")
                .allowCredentials(true);
    }
}