package com.sanarte.public_products_service.controller;


import com.sanarte.public_products_service.dto.CategoriaPublicResponse;
import com.sanarte.public_products_service.service.PublicProductoService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/public/categorias")
public class PublicCategoriaController {

    private final PublicProductoService publicProductoService;

    public PublicCategoriaController(PublicProductoService publicProductoService) {
        this.publicProductoService = publicProductoService;
    }

    @GetMapping
    public List<CategoriaPublicResponse> listarCategorias() {
        return publicProductoService.listarCategorias();
    }
}