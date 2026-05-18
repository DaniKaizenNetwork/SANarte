package com.sanarte.admin_products_service.service;



import com.sanarte.admin_products_service.dto.CategoriaRequest;
import com.sanarte.admin_products_service.dto.CategoriaResponse;

import java.util.List;

public interface CategoriaService {

    CategoriaResponse crear(CategoriaRequest request);

    List<CategoriaResponse> listar();

    CategoriaResponse buscarPorId(Long id);

    CategoriaResponse actualizar(Long id, CategoriaRequest request);

    void eliminar(Long id);
}