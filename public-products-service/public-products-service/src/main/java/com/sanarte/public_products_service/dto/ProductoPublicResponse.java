package com.sanarte.public_products_service.dto;



import com.sanarte.public_products_service.domain.EstadoProducto;
import java.math.BigDecimal;

public record ProductoPublicResponse(
        Long idProducto,
        String nombre,
        String detalle,
        BigDecimal precio,
        String imagenUrl,
        EstadoProducto estado,
        CategoriaPublicResponse categoria
) {
}