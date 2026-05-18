package com.sanarte.admin_products_service.dto;


public record CategoriaResponse(
        Long idCategoria,
        String nombre,
        String descripcion
) {
}