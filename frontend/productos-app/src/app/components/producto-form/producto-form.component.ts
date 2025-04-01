import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductoService } from '../../services/producto.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-producto-form',
  templateUrl: './producto-form.component.html',
  styleUrls: ['./producto-form.component.scss']
})
export class ProductoFormComponent implements OnInit {
  productoForm: FormGroup;
  isEditMode = false;
  productoId: number | null = null;

  constructor(
    private fb: FormBuilder,
    private productoService: ProductoService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.productoForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(3)]],
      descripcion: ['', [Validators.required, Validators.minLength(10)]],
      precio: ['', [Validators.required, Validators.min(0)]],
      stock: ['', [Validators.required, Validators.min(0)]]
    });
  }

  ngOnInit(): void {
    this.productoId = Number(this.route.snapshot.paramMap.get('id'));
    if (this.productoId) {
      this.isEditMode = true;
      this.loadProducto();
    }
  }

  loadProducto(): void {
    if (this.productoId) {
      Swal.fire({
        title: 'Cargando...',
        text: 'Obteniendo información del producto',
        icon: 'info',
        allowOutsideClick: false,
        showConfirmButton: false,
        willOpen: () => {
          Swal.showLoading();
        }
      });

      this.productoService.getProducto(this.productoId).subscribe({
        next: (producto) => {
          this.productoForm.patchValue(producto);
          Swal.close();
        },
        error: (error) => {
          Swal.fire({
            title: 'Error',
            text: 'Error al cargar el producto',
            icon: 'error',
            confirmButtonText: 'Aceptar'
          }).then(() => {
            this.router.navigate(['/productos']);
          });
        }
      });
    }
  }

  onSubmit(): void {
    if (this.productoForm.valid) {
      const producto = this.productoForm.value;

      Swal.fire({
        title: 'Guardando...',
        text: this.isEditMode ? 'Actualizando producto' : 'Creando nuevo producto',
        icon: 'info',
        allowOutsideClick: false,
        showConfirmButton: false,
        willOpen: () => {
          Swal.showLoading();
        }
      });

      if (this.isEditMode && this.productoId) {
        this.productoService.updateProducto(this.productoId, producto).subscribe({
          next: () => {
            Swal.fire({
              title: '¡Éxito!',
              text: 'Producto actualizado correctamente',
              icon: 'success',
              timer: 2000,
              showConfirmButton: false
            }).then(() => {
              this.router.navigate(['/productos']);
            });
          },
          error: (error) => {
            Swal.fire({
              title: 'Error',
              text: 'Error al actualizar el producto',
              icon: 'error',
              confirmButtonText: 'Aceptar'
            });
          }
        });
      } else {
        this.productoService.createProducto(producto).subscribe({
          next: () => {
            Swal.fire({
              title: '¡Éxito!',
              text: 'Producto creado correctamente',
              icon: 'success',
              timer: 2000,
              showConfirmButton: false
            }).then(() => {
              this.router.navigate(['/productos']);
            });
          },
          error: (error) => {
            Swal.fire({
              title: 'Error',
              text: 'Error al crear el producto',
              icon: 'error',
              confirmButtonText: 'Aceptar'
            });
          }
        });
      }
    } else {
      // Mostrar mensaje de validación
      Swal.fire({
        title: 'Formulario inválido',
        text: 'Por favor, complete correctamente todos los campos requeridos',
        icon: 'warning',
        confirmButtonText: 'Entendido'
      });
    }
  }

  getErrorMessage(field: string): string {
    const control = this.productoForm.get(field);
    if (control?.hasError('required')) {
      return 'Este campo es requerido';
    }
    if (control?.hasError('minlength')) {
      return `Mínimo ${control.errors?.['minlength'].requiredLength} caracteres`;
    }
    if (control?.hasError('min')) {
      return 'El valor debe ser mayor o igual a 0';
    }
    return '';
  }

  confirmarCancelar(): void {
    if (this.productoForm.dirty) {
      Swal.fire({
        title: '¿Abandonar cambios?',
        text: 'Los cambios no guardados se perderán',
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí, abandonar',
        cancelButtonText: 'No, continuar editando'
      }).then((result) => {
        if (result.isConfirmed) {
          this.router.navigate(['/productos']);
        }
      });
    } else {
      this.router.navigate(['/productos']);
    }
  }
} 