package com.sanarte.admin_products_service.dto;

import com.sanarte.admin_products_service.domain.EstadoProducto;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;

public record ProductoRequest(

        @NotBlank(message = "El nombre es obligatorio")
        String nombre,

        @NotBlank(message = "El detalle es obligatorio")
        String detalle,

        @NotNull(message = "El precio es obligatorio")
        @DecimalMin(value = "0.0", inclusive = false)
        BigDecimal precio,

        String imagenUrl,

        @NotNull(message = "El estado es obligatorio")
        EstadoProducto estado,

        @NotNull(message = "La categoría es obligatoria")
        Long idCategoria
) {
}