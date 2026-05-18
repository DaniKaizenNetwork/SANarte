package com.sanarte.public_products_service.service.impl;



import com.sanarte.public_products_service.domain.Categoria;
import com.sanarte.public_products_service.domain.EstadoProducto;
import com.sanarte.public_products_service.domain.Producto;
import com.sanarte.public_products_service.dto.CategoriaPublicResponse;
import com.sanarte.public_products_service.dto.ProductoPublicResponse;
import com.sanarte.public_products_service.exception.ResourceNotFoundException;
import com.sanarte.public_products_service.repository.CategoriaRepository;
import com.sanarte.public_products_service.repository.ProductoRepository;
import com.sanarte.public_products_service.service.PublicProductoService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class PublicProductoServiceImpl implements PublicProductoService {

    private final ProductoRepository productoRepository;
    private final CategoriaRepository categoriaRepository;

    public PublicProductoServiceImpl(
            ProductoRepository productoRepository,
            CategoriaRepository categoriaRepository
    ) {
        this.productoRepository = productoRepository;
        this.categoriaRepository = categoriaRepository;
    }

    @Override
    @Transactional(readOnly = true)
    public List<ProductoPublicResponse> listarDisponibles() {
        return productoRepository.findByEstado(EstadoProducto.DISPONIBLE)
                .stream()
                .map(this::toProductoResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public ProductoPublicResponse buscarDisponiblePorId(Long id) {
        Producto producto = productoRepository.findById(id)
                .filter(p -> p.getEstado() == EstadoProducto.DISPONIBLE)
                .orElseThrow(() -> new ResourceNotFoundException("Producto disponible no encontrado con ID: " + id));

        return toProductoResponse(producto);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ProductoPublicResponse> listarPorCategoria(Long idCategoria) {
        if (!categoriaRepository.existsById(idCategoria)) {
            throw new ResourceNotFoundException("Categoría no encontrada con ID: " + idCategoria);
        }

        return productoRepository
                .findByCategoria_IdCategoriaAndEstado(idCategoria, EstadoProducto.DISPONIBLE)
                .stream()
                .map(this::toProductoResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<CategoriaPublicResponse> listarCategorias() {
        return categoriaRepository.findAll()
                .stream()
                .map(this::toCategoriaResponse)
                .toList();
    }

    private ProductoPublicResponse toProductoResponse(Producto producto) {
        return new ProductoPublicResponse(
                producto.getIdProducto(),
                producto.getNombre(),
                producto.getDetalle(),
                producto.getPrecio(),
                producto.getImagenUrl(),
                producto.getEstado(),
                toCategoriaResponse(producto.getCategoria())
        );
    }

    private CategoriaPublicResponse toCategoriaResponse(Categoria categoria) {
        return new CategoriaPublicResponse(
                categoria.getIdCategoria(),
                categoria.getNombre(),
                categoria.getDescripcion()
        );
    }
}
