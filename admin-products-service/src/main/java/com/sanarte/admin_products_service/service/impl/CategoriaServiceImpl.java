package com.sanarte.admin_products_service.service.impl;

import com.sanarte.admin_products_service.domain.Categoria;
import com.sanarte.admin_products_service.dto.CategoriaRequest;
import com.sanarte.admin_products_service.dto.CategoriaResponse;
import com.sanarte.admin_products_service.exception.BusinessException;
import com.sanarte.admin_products_service.exception.ResourceNotFoundException;
import com.sanarte.admin_products_service.repository.CategoriaRepository;
import com.sanarte.admin_products_service.service.CategoriaService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class CategoriaServiceImpl implements CategoriaService {

    private final CategoriaRepository categoriaRepository;

    public CategoriaServiceImpl(CategoriaRepository categoriaRepository) {
        this.categoriaRepository = categoriaRepository;
    }

    @Override
    @Transactional
    public CategoriaResponse crear(CategoriaRequest request) {
        if (categoriaRepository.existsByNombreIgnoreCase(request.nombre())) {
            throw new BusinessException("Ya existe una categoría con ese nombre");
        }

        Categoria categoria = new Categoria();
        categoria.setNombre(request.nombre());
        categoria.setDescripcion(request.descripcion());

        Categoria guardada = categoriaRepository.save(categoria);

        return toResponse(guardada);
    }

    @Override
    @Transactional(readOnly = true)
    public List<CategoriaResponse> listar() {
        return categoriaRepository.findAll()
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public CategoriaResponse buscarPorId(Long id) {
        return toResponse(findCategoria(id));
    }

    @Override
    @Transactional
    public CategoriaResponse actualizar(Long id, CategoriaRequest request) {
        Categoria categoria = findCategoria(id);

        categoria.setNombre(request.nombre());
        categoria.setDescripcion(request.descripcion());

        return toResponse(categoriaRepository.save(categoria));
    }

    @Override
    @Transactional
    public void eliminar(Long id) {
        Categoria categoria = findCategoria(id);

        if (!categoria.getProductos().isEmpty()) {
            throw new BusinessException("No se puede eliminar una categoría con productos asociados");
        }

        categoriaRepository.delete(categoria);
    }

    private Categoria findCategoria(Long id) {
        return categoriaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Categoría no encontrada con ID: " + id));
    }

    private CategoriaResponse toResponse(Categoria categoria) {
        return new CategoriaResponse(
                categoria.getIdCategoria(),
                categoria.getNombre(),
                categoria.getDescripcion()
        );
    }
}