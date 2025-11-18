package com.senai.projeto.ControlTechBack.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**") // Libera todas as rotas
                // CORRIGIDO: Usando allowedOriginPatterns para aceitar qualquer porta local
                .allowedOriginPatterns(
                        "https://control-tech-six.vercel.app", // URL do Front em produção
                        "http://localhost:*",                  // Para testes locais (aceita porta 8080, 5500, etc.)
                        "http://127.0.0.1:*",                  // Para testes locais
                        "*"                                    // Curinga geral para maior flexibilidade
                )
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS", "HEAD", "TRACE", "CONNECT")
                .allowedHeaders("*")
                .allowCredentials(true);
    }
}