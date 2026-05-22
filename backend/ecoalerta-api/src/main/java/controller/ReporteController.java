package com.ecoalerta.ecoalertaapi.controller;

import com.ecoalerta.ecoalertaapi.model.Reporte;
import com.ecoalerta.ecoalertaapi.model.Usuario;
import com.ecoalerta.ecoalertaapi.repository.ReporteRepository;
import com.ecoalerta.ecoalertaapi.repository.UsuarioRepository;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/reportes")
@CrossOrigin
public class ReporteController {

    private final ReporteRepository reporteRepository;
    private final UsuarioRepository usuarioRepository;

    public ReporteController(ReporteRepository reporteRepository, UsuarioRepository usuarioRepository) {
        this.reporteRepository = reporteRepository;
        this.usuarioRepository = usuarioRepository;
    }

    @GetMapping
    public List<Reporte> listar() {
        return reporteRepository.findAll();
    }

    @PostMapping
    public Reporte criar(@RequestBody Reporte reporte) {
        reporte.setStatus("EM_ANALISE");
        reporte.setDataEnvio(LocalDateTime.now());

        String protocolo = "EA-" + System.currentTimeMillis();
        reporte.setProtocolo(protocolo);

        Long usuarioId = reporte.getUsuario().getId();

        Usuario usuario = usuarioRepository.findById(usuarioId)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));

        reporte.setUsuario(usuario);

        return reporteRepository.save(reporte);
    }


    @GetMapping("/status/{status}")
    public List<Reporte> buscarPorStatus(@PathVariable String status) {
        return reporteRepository.findByStatus(status);
    }

    @GetMapping("/categoria/{categoria}")
    public List<Reporte> buscarPorCategoria(@PathVariable String categoria) {
        return reporteRepository.findByCategoria(categoria);
    }

    @PutMapping("/{id}/status")
    public Reporte atualizarStatus(@PathVariable Long id, @RequestBody Reporte dados) {
        Reporte reporte = reporteRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Reporte não encontrado"));

        reporte.setStatus(dados.getStatus());

        return reporteRepository.save(reporte);
    }

    @DeleteMapping("/{id}")
    public void deletar(@PathVariable Long id) {
        reporteRepository.deleteById(id);
    }
}