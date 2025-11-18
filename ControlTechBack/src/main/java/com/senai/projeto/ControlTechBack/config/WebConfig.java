package com.senai.projeto.ControlTechBack.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**") // Libera todas as rotas
                // CORREÇÃO DEFINITIVA: Deve-se usar 'allowedOriginPatterns' para curingas.
                // Usamos o padrão 'http://*' para cobrir qualquer porta local e garantir que Vercel seja reconhecido.
                .allowedOriginPatterns(
                        "https://control-tech-six.vercel.app", // Sua URL do Front em produção
                        "http://localhost:*",                  // Qualquer porta local (8080, 5502, etc.)
                        "http://127.0.0.1:*",                  // Qualquer porta local
                        "*"                                    // Curinga geral (Use apenas temporariamente para testes)
                )
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS", "HEAD", "TRACE", "CONNECT")
                .allowedHeaders("*")
                .allowCredentials(true);
    }
}