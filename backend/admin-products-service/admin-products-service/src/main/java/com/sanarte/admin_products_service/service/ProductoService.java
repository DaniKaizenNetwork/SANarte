package com.sanarte.admin_products_service.service;

import com.sanarte.admin_products_service.dto.ProductoRequest;
import com.sanarte.admin_products_service.dto.ProductoResponse;

import java.util.List;

public interface ProductoService {

    ProductoResponse crear(ProductoRequest request);

    List<ProductoResponse> listar();

    ProductoResponse buscarPorId(Long id);

    ProductoResponse actualizar(Long id, ProductoRequest request);

    void eliminar(Long id);
}