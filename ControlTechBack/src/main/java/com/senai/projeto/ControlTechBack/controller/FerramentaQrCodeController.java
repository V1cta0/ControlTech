package com.senai.projeto.ControlTechBack.controller;

import com.senai.projeto.ControlTechBack.DTO.*;
import com.senai.projeto.ControlTechBack.QrCode.QRCodeGenerator;
import com.senai.projeto.ControlTechBack.entity.Ferramenta;
import com.senai.projeto.ControlTechBack.entity.Usuario;
import com.senai.projeto.ControlTechBack.service.FerramentaService;
import com.senai.projeto.ControlTechBack.service.HistoricoService;
import com.senai.projeto.ControlTechBack.service.UsuarioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/ferramentas")
// Removida anotação @CrossOrigin - confiamos no WebConfig para CORS
public class FerramentaQrCodeController {

    @Autowired
    private FerramentaService ferramentaService;

    @Autowired
    private UsuarioService usuarioService;

    @Autowired
    private HistoricoService historicoService;

    // ✅ Listar todas (GET /api/ferramentas)
    @GetMapping
    public List<FerramentaDTO> listarTodas() {
        return ferramentaService.listarTodas();
    }

    // ✅ Buscar por ID (GET /api/ferramentas/{id})
    @GetMapping("/{id}")
    public ResponseEntity<FerramentaDTO> buscarPorId(@PathVariable Long id) {
        FerramentaDTO dto = ferramentaService.buscarPorId(id);
        return dto != null ? ResponseEntity.ok(dto) : ResponseEntity.notFound().build();
    }

    // ✅ Criar ferramenta (POST /api/ferramentas) - Unificado para JSON
    @PostMapping
    public ResponseEntity<?> criarFerramenta(@RequestBody FerramentaDTO dto) {
        try {
            FerramentaDTO criado = ferramentaService.salvar(dto);
            return ResponseEntity.status(HttpStatus.CREATED).body(criado);
        } catch (Exception e) {
            e.printStackTrace();
            // Retorna um JSON de erro para o Front-end
            return ResponseEntity.badRequest().body(Map.of("erro", "Erro ao cadastrar ferramenta: " + e.getMessage()));
        }
    }

    // O antigo método com @PostMapping("/post") e o método complexo com MultipartFile foram substituídos por um POST simples e limpo.

    // ✅ Atualizar ferramenta (PUT /api/ferramentas/{id})
    @PutMapping("/{id}")
    public ResponseEntity<FerramentaDTO> atualizar(@PathVariable Long id, @RequestBody FerramentaDTO dto) {
        try {
            FerramentaDTO atualizado = ferramentaService.atualizar(id, dto);
            return ResponseEntity.ok(atualizado);
        } catch (RuntimeException e) {
            // Captura exceção de "Ferramenta não encontrada"
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

    // ✅ Deletar ferramenta (DELETE /api/ferramentas/{id})
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Long id) {
        ferramentaService.deletar(id);
        return ResponseEntity.noContent().build();
    }

    // ✅ Gerar QR Code da ferramenta (GET /api/ferramentas/{id}/qrcode)
    @GetMapping("/{id}/qrcode")
    public ResponseEntity<byte[]> gerarQrCode(@PathVariable Long id) {
        try {
            FerramentaDTO dto = ferramentaService.buscarPorId(id);
            if (dto == null) return ResponseEntity.notFound().build();

            // O QR Code é o ID da ferramenta
            String qrText = String.valueOf(dto.getId());
            byte[] qrImage = QRCodeGenerator.gerarQRCodeBytes(qrText, 400, 400);

            return ResponseEntity.ok()
                    .header("Content-Type", "image/png")
                    .body(qrImage);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    // ✅ Associar usuário (POST /api/ferramentas/associar/{id})
    @PostMapping("/associar/{id}")
    public ResponseEntity<Map<String, Object>> associarUsuario(
            @PathVariable Long id,
            @RequestBody UsuarioAssociarDTO body) {

        Long usuarioId = body.getUsuarioId();

        if (usuarioId == null) {
            return ResponseEntity.badRequest()
                    .body(Map.of("erro", "usuarioId não pode ser nulo"));
        }

        // Buscar ferramenta e usuário
        Optional<Ferramenta> optFerramenta = ferramentaService.buscarEntidadePorId(id);
        Optional<Usuario> optUsuario = usuarioService.buscarEntidadePorId(usuarioId);

        if (optFerramenta.isEmpty() || optUsuario.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("erro", "Usuário ou ferramenta não encontrados"));
        }

        Ferramenta ferramenta = optFerramenta.get();
        Usuario usuario = optUsuario.get();

        try {
            ferramentaService.associarUsuario(ferramenta, usuario);

            return ResponseEntity.ok(Map.of(
                    "mensagem", "Associado com sucesso!",
                    "ferramentaId", ferramenta.getId(),
                    "ferramentaNome", ferramenta.getNome(),
                    "usuarioId", usuario.getId(),
                    "usuarioNome", usuario.getNome(),
                    "dataAssociacao", ferramenta.getDataAssociacao() // Retorna o LocalDateTime
            ));

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("erro", "Erro ao associar: " + e.getMessage()));
        }
    }

    // ✅ Status do Usuário da Ferramenta (GET /api/ferramentas/{id}/usuario)
    @GetMapping("/{id}/usuario")
    public ResponseEntity<UsuarioStatusDTO> usuarioDaFerramenta(@PathVariable Long id) {
        Optional<Ferramenta> ferrOpt = ferramentaService.buscarEntidadePorId(id);
        if (ferrOpt.isEmpty()) return ResponseEntity.notFound().build();

        Ferramenta ferramenta = ferrOpt.get();
        Usuario usuario = ferramenta.getUsuario();

        if (usuario == null) {
            // Retorna DTO com campos nulos e dataAssociacao nula
            return ResponseEntity.ok(new UsuarioStatusDTO(null, null, null, null));
        }

        // Retorna DTO com dados do usuário e a data de associação
        UsuarioStatusDTO dto = new UsuarioStatusDTO(
                usuario.getId(),
                usuario.getNome(),
                usuario.getTurma(), // Turma é lida do objeto Usuario
                ferramenta.getDataAssociacao() // Data de associação é lida do objeto Ferramenta
        );
        return ResponseEntity.ok(dto);
    }


    // ✅ Listar usuários associados a ferramentas (GET /api/ferramentas/usuarios/associacao)
    @GetMapping("/usuarios/associacao")
    public ResponseEntity<List<UsuarioOutputDTO>> listarUsuariosAssociados() {
        List<UsuarioOutputDTO> usuarios = usuarioService.listarUsuariosAssociados();
        return ResponseEntity.ok(usuarios);
    }

    // ✅ Listar ferramentas por ID de usuário (GET /api/ferramentas/usuario/{usuarioId})
    @GetMapping("/usuario/{usuarioId}")
    public ResponseEntity<List<FerramentaUsuarioDTO>> listarFerramentasDoUsuario(@PathVariable Long usuarioId) {
        List<FerramentaUsuarioDTO> lista = ferramentaService.listarFerramentasPorUsuario(usuarioId);
        return ResponseEntity.ok(lista);
    }

    // ✅ Devolver ferramenta (POST /api/ferramentas/{id}/devolver)
    @PostMapping("/{id}/devolver")
    public ResponseEntity<String> devolver(@PathVariable Long id,
                                           @RequestParam(required = false) String observacoes) {

        Optional<Ferramenta> ferrOpt = ferramentaService.buscarEntidadePorId(id);
        if (ferrOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Ferramenta não encontrada");
        }

        Ferramenta ferramenta = ferrOpt.get();
        Usuario usuario = ferramenta.getUsuario();

        if (usuario == null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Ferramenta não está associada a nenhum usuário");
        }

        // 1. Registrar no histórico de devolução
        historicoService.registrarDevolucao(ferramenta, usuario, observacoes);

        // 2. Desassociar ferramenta do usuário e limpar datas de associação
        ferramenta.setUsuario(null);
        ferramenta.setDataDevolucao(null);
        ferramenta.setDataAssociacao(null);
        ferramentaService.salvarOuAtualizar(ferramenta);

        // 3. Resposta com codificação UTF-8
        return ResponseEntity.ok()
                .contentType(MediaType.valueOf("text/plain;charset=UTF-8"))
                .body("Devolução realizada com sucesso");
    }

    // ✅ Listar ferramentas por código de crachá (GET /api/ferramentas/usuario/cracha/{cracha})
    @GetMapping("/usuario/cracha/{cracha}")
    public ResponseEntity<List<FerramentaUsuarioDTO>> listarFerramentasDoUsuarioPorCracha(@PathVariable String cracha) {
        List<FerramentaUsuarioDTO> lista = ferramentaService.listarFerramentasPorCracha(cracha);
        return ResponseEntity.ok(lista);
    }
}