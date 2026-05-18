package com.sanarte.admin_products_service.service.impl;

import com.sanarte.admin_products_service.domain.Categoria;
import com.sanarte.admin_products_service.domain.Producto;
import com.sanarte.admin_products_service.dto.CategoriaResponse;
import com.sanarte.admin_products_service.dto.ProductoRequest;
import com.sanarte.admin_products_service.dto.ProductoResponse;
import com.sanarte.admin_products_service.exception.ResourceNotFoundException;
import com.sanarte.admin_products_service.repository.CategoriaRepository;
import com.sanarte.admin_products_service.repository.ProductoRepository;
import com.sanarte.admin_products_service.service.ProductoService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class ProductoServiceImpl implements ProductoService {

    private final ProductoRepository productoRepository;
    private final CategoriaRepository categoriaRepository;

    public ProductoServiceImpl(
            ProductoRepository productoRepository,
            CategoriaRepository categoriaRepository
    ) {
        this.productoRepository = productoRepository;
        this.categoriaRepository = categoriaRepository;
    }

    @Override
    @Transactional
    public ProductoResponse crear(ProductoRequest request) {
        Categoria categoria = findCategoria(request.idCategoria());

        Producto producto = new Producto();
        producto.setNombre(request.nombre());
        producto.setDetalle(request.detalle());
        producto.setPrecio(request.precio());
        producto.setImagenUrl(request.imagenUrl());
        producto.setEstado(request.estado());
        producto.setCategoria(categoria);

        return toResponse(productoRepository.save(producto));
    }

    @Override
    @Transactional(readOnly = true)
    public List<ProductoResponse> listar() {
        return productoRepository.findAll()
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public ProductoResponse buscarPorId(Long id) {
        return toResponse(findProducto(id));
    }

    @Override
    @Transactional
    public ProductoResponse actualizar(Long id, ProductoRequest request) {
        Producto producto = findProducto(id);
        Categoria categoria = findCategoria(request.idCategoria());

        producto.setNombre(request.nombre());
        producto.setDetalle(request.detalle());
        producto.setPrecio(request.precio());
        producto.setImagenUrl(request.imagenUrl());
        producto.setEstado(request.estado());
        producto.setCategoria(categoria);

        return toResponse(productoRepository.save(producto));
    }

    @Override
    @Transactional
    public void eliminar(Long id) {
        Producto producto = findProducto(id);
        productoRepository.delete(producto);
    }

    private Producto findProducto(Long id) {
        return productoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Producto no encontrado con ID: " + id));
    }

    private Categoria findCategoria(Long id) {
        return categoriaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Categoría no encontrada con ID: " + id));
    }

    private ProductoResponse toResponse(Producto producto) {
        return new ProductoResponse(
                producto.getIdProducto(),
                producto.getNombre(),
                producto.getDetalle(),
                producto.getPrecio(),
                producto.getImagenUrl(),
                producto.getEstado(),
                new CategoriaResponse(
                        producto.getCategoria().getIdCategoria(),
                        producto.getCategoria().getNombre(),
                        producto.getCategoria().getDescripcion()
                )
        );
    }
}