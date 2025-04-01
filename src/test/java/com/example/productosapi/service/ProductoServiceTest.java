package com.example.productosapi.service;

import com.example.productosapi.model.Producto;
import com.example.productosapi.repository.ProductoRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import javax.persistence.EntityNotFoundException;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class ProductoServiceTest {

    @Mock
    private ProductoRepository productoRepository;

    @InjectMocks
    private ProductoService productoService;

    private Producto producto;

    @BeforeEach
    void setUp() {
        producto = new Producto();
        producto.setId(1L);
        producto.setPrecio(100.0);
        producto.setStock(10);
        producto.setDescripcion("Producto de prueba");
    }

    @Test
    void findAll_ShouldReturnAllProductos() {
        List<Producto> productos = Arrays.asList(producto);
        when(productoRepository.findAll()).thenReturn(productos);

        List<Producto> result = productoService.findAll();

        assertEquals(productos, result);
        verify(productoRepository).findAll();
    }

    @Test
    void findById_WhenProductoExists_ShouldReturnProducto() {
        when(productoRepository.findById(1L)).thenReturn(Optional.of(producto));

        Optional<Producto> result = productoService.findById(1L);

        assertTrue(result.isPresent());
        assertEquals(producto, result.get());
        verify(productoRepository).findById(1L);
    }

    @Test
    void findById_WhenProductoDoesNotExist_ShouldReturnEmpty() {
        when(productoRepository.findById(1L)).thenReturn(Optional.empty());

        Optional<Producto> result = productoService.findById(1L);

        assertFalse(result.isPresent());
        verify(productoRepository).findById(1L);
    }

    @Test
    void save_ShouldReturnSavedProducto() {
        when(productoRepository.save(any(Producto.class))).thenReturn(producto);

        Producto result = productoService.save(producto);

        assertEquals(producto, result);
        verify(productoRepository).save(producto);
    }

    @Test
    void update_WhenProductoExists_ShouldReturnUpdatedProducto() {
        when(productoRepository.existsById(1L)).thenReturn(true);
        when(productoRepository.save(any(Producto.class))).thenReturn(producto);

        Producto result = productoService.update(1L, producto);

        assertEquals(producto, result);
        verify(productoRepository).existsById(1L);
        verify(productoRepository).save(producto);
    }

    @Test
    void update_WhenProductoDoesNotExist_ShouldThrowException() {
        when(productoRepository.existsById(1L)).thenReturn(false);

        assertThrows(EntityNotFoundException.class, () -> productoService.update(1L, producto));
        verify(productoRepository).existsById(1L);
        verify(productoRepository, never()).save(any(Producto.class));
    }

    @Test
    void deleteById_ShouldDeleteProducto() {
        productoService.deleteById(1L);
        verify(productoRepository).deleteById(1L);
    }
} 