package com.senai.projeto.ControlTechBack.controller;// Conteúdo dentro de com.senai.projeto.ControlTechBack.controller.FerramentaController.java (Assumido)

import com.senai.projeto.ControlTechBack.DTO.FerramentaDTO;
import com.senai.projeto.ControlTechBack.service.FerramentaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/ferramentas")
public class FerramentaController {

    @Autowired
    private FerramentaService ferramentaService;


    @PutMapping("/{id}") // Mapeia requisições PUT para /api/ferramentas/{id}
    public ResponseEntity<FerramentaDTO> atualizarFerramenta(
            @PathVariable Long id,
            @RequestBody FerramentaDTO ferramentaDTO) {

        try {
            FerramentaDTO atualizada = ferramentaService.atualizar(id, ferramentaDTO);
            return ResponseEntity.ok(atualizada);
        } catch (RuntimeException e) {
            // Retorna 404 se a ferramenta não for encontrada ou 400 em caso de erro
            return ResponseEntity.notFound().build();
        }
    }
}