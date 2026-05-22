package com.ecoalerta.ecoalertaapi.controller;

import com.ecoalerta.ecoalertaapi.model.Usuario;
import com.ecoalerta.ecoalertaapi.repository.UsuarioRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/usuarios")
@CrossOrigin
public class UsuarioController {

    private final UsuarioRepository repository;

    public UsuarioController(UsuarioRepository repository) {
        this.repository = repository;
    }

    @GetMapping
    public List<Usuario> listar() {
        return repository.findAll();
    }

    @PostMapping
    public Usuario cadastrar(@RequestBody Usuario usuario) {
        return repository.save(usuario);
    }

    @PostMapping("/login")
    public Usuario login(@RequestBody Usuario usuario) {
        return repository.findByEmailAndSenha(usuario.getEmail(), usuario.getSenha())
                .orElse(null);
    }
}