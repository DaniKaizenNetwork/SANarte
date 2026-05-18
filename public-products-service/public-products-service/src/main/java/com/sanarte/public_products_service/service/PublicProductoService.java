package com.sanarte.public_products_service.service;


import com.sanarte.public_products_service.dto.CategoriaPublicResponse;
import com.sanarte.public_products_service.dto.ProductoPublicResponse;

import java.util.List;

public interface PublicProductoService {

    List<ProductoPublicResponse> listarDisponibles();

    ProductoPublicResponse buscarDisponiblePorId(Long id);

    List<ProductoPublicResponse> listarPorCategoria(Long idCategoria);

    List<CategoriaPublicResponse> listarCategorias();
}