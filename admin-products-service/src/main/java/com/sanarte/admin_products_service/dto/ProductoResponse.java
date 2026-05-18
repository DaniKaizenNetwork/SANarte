package com.sanarte.admin_products_service.dto;



import com.sanarte.admin_products_service.domain.EstadoProducto;

import java.math.BigDecimal;

public record ProductoResponse(
        Long idProducto,
        String nombre,
        String detalle,
        BigDecimal precio,
        String imagenUrl,
        EstadoProducto estado,
        CategoriaResponse categoria
) {
}