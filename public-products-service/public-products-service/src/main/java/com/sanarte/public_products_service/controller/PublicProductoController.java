package com.sanarte.public_products_service.controller;


import com.sanarte.public_products_service.dto.ProductoPublicResponse;
import com.sanarte.public_products_service.service.PublicProductoService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/public/productos")
public class PublicProductoController {

    private final PublicProductoService publicProductoService;

    public PublicProductoController(PublicProductoService publicProductoService) {
        this.publicProductoService = publicProductoService;
    }

    @GetMapping
    public List<ProductoPublicResponse> listarDisponibles() {
        return publicProductoService.listarDisponibles();
    }

    @GetMapping("/{id}")
    public ProductoPublicResponse buscarPorId(@PathVariable Long id) {
        return publicProductoService.buscarDisponiblePorId(id);
    }

    @GetMapping("/categoria/{idCategoria}")
    public List<ProductoPublicResponse> listarPorCategoria(
            @PathVariable Long idCategoria
    ) {
        return publicProductoService.listarPorCategoria(idCategoria);
    }
}
