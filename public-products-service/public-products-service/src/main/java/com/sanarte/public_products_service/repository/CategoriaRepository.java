package com.sanarte.public_products_service.repository;


import com.sanarte.public_products_service.domain.Categoria;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CategoriaRepository extends JpaRepository<Categoria, Long> {
}