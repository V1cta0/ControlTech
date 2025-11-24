package com.senai.projeto.ControlTechBack.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;

import java.util.Arrays;

@Configuration
public class WebConfig {

    @Bean
    public CorsFilter corsFilter() {
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        CorsConfiguration config = new CorsConfiguration();

        // 1. Permite Credenciais (se precisar de login/cookies no futuro)
        config.setAllowCredentials(true);

        // 2. Permite TUDO (qualquer site, qualquer header, qualquer método)
        config.addAllowedOriginPattern("*");
        config.addAllowedHeader("*");
        config.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS", "HEAD", "PATCH"));

        // 3. Aplica essa configuração para TODAS as rotas
        source.registerCorsConfiguration("/**", config);
        return new CorsFilter(source);
    }
}