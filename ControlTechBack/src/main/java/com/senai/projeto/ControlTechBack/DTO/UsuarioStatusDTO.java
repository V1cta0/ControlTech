package com.senai.projeto.ControlTechBack.DTO;

// NOVA IMPORTAÇÃO: Importa a anotação Jackson
import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UsuarioStatusDTO {
    private Long id;
    private String nome;
    private String perfil;

    // NOVO: Formata LocalDateTime no padrão ISO-8601 (ex: 2025-11-27T17:39:00)
    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime dataAssociacao;
}