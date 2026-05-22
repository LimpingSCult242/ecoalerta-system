package com.ecoalerta.ecoalertaapi.model;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "reportes")
public class Reporte {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String titulo;

    private String descricao;

    private String categoria;

    private String gravidade;

    private String cidade;

    private String bairro;

    private String rua;

    private String cep;

    private String gps;

    private String status;

    private String protocolo;

    @Column(name = "data_ocorrencia")
    private String dataOcorrencia;

    @Column(name = "hora_ocorrencia")
    private String horaOcorrencia;

    @Column(name = "data_envio")
    private LocalDateTime dataEnvio;

    @ManyToOne
    @JoinColumn(name = "usuario_id")
    private Usuario usuario;
}