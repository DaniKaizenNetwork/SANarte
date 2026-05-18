package com.sanarte.admin_products_service.repository;


import com.sanarte.admin_products_service.domain.Producto;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProductoRepository extends JpaRepository<Producto, Long> {
}