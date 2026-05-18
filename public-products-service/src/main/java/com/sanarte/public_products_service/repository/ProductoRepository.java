package com.sanarte.public_products_service.repository;


import com.sanarte.public_products_service.domain.EstadoProducto;
import com.sanarte.public_products_service.domain.Producto;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ProductoRepository extends JpaRepository<Producto, Long> {

    List<Producto> findByEstado(EstadoProducto estado);

    List<Producto> findByCategoria_IdCategoriaAndEstado(
            Long idCategoria,
            EstadoProducto estado
    );
}
