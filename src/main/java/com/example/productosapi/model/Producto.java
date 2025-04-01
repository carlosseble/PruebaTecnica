package com.example.productosapi.model;

import lombok.Getter;
import lombok.Setter;
import javax.persistence.*;

@Getter
@Setter 
@Entity
public class Producto {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private String nombre;
    
    @Column(nullable = false)
    private String descripcion;
    
    @Column(nullable = false)
    private Double precio;
    
    @Column(nullable = false)
    private Integer stock;

    /* SI USAMOS JPA DEBERÍAMOS DE HACER USO DE @Id, @GeneratedValue, @Column, @PrePersist, @PreUpdate */
} 