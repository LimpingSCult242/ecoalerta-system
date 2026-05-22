package com.ecoalerta.ecoalertaapi.repository;

import com.ecoalerta.ecoalertaapi.model.Reporte;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ReporteRepository extends JpaRepository<Reporte, Long> {

    List<Reporte> findByStatus(String status);

    List<Reporte> findByCategoria(String categoria);
}