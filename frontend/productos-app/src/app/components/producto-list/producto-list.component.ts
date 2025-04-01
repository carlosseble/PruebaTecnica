import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { ProductoService } from '../../services/producto.service';
import { Producto } from '../../models/producto.model';
import { MatSnackBar } from '@angular/material/snack-bar';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-producto-list',
  templateUrl: './producto-list.component.html',
  styleUrls: ['./producto-list.component.scss']
})
export class ProductoListComponent implements OnInit {
  displayedColumns: string[] = ['id', 'nombre', 'descripcion', 'precio', 'stock', 'acciones'];
  dataSource: MatTableDataSource<Producto>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private productoService: ProductoService,
    private snackBar: MatSnackBar
  ) {
    this.dataSource = new MatTableDataSource();
  }

  ngOnInit(): void {
    this.loadProductos();
    // Configurar la función personalizada de filtrado
    this.dataSource.filterPredicate = (data: Producto, filter: string) => {
      const filterValue = filter.toLowerCase();
      
      // Buscar en nombre y descripción
      const textMatch = data.nombre.toLowerCase().includes(filterValue) || 
                       data.descripcion.toLowerCase().includes(filterValue);
      
      // Buscar en precio (convertir precio a string para la comparación)
      const precioStr = data.precio.toString();
      const precioMatch = precioStr.includes(filterValue);
      
      return textMatch || precioMatch;
    };
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.paginator._intl.itemsPerPageLabel = 'Elementos por página:';
    this.paginator._intl.nextPageLabel = 'Siguiente página';
    this.paginator._intl.previousPageLabel = 'Página anterior';
    this.paginator._intl.firstPageLabel = 'Primera página';
    this.paginator._intl.lastPageLabel = 'Última página';
    this.paginator._intl.getRangeLabel = this.getRangeLabel;
  }

  getRangeLabel = (page: number, pageSize: number, length: number) => {
    if (length === 0 || pageSize === 0) {
      return `0 de ${length}`;
    }
    length = Math.max(length, 0);
    const startIndex = page * pageSize;
    const endIndex = startIndex < length ? Math.min(startIndex + pageSize, length) : startIndex + pageSize;
    return `${startIndex + 1} - ${endIndex} de ${length}`;
  }

  loadProductos(): void {
    this.productoService.getProductos().subscribe({
      next: (productos) => {
        this.dataSource.data = productos;
      },
      error: (error) => {
        this.showErrorMessage('Error al cargar los productos');
      }
    });
  }

  deleteProducto(id: number): void {
    Swal.fire({
      title: '¿Está seguro?',
      text: 'Esta acción eliminará el producto permanentemente',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.productoService.deleteProducto(id).subscribe({
          next: () => {
            this.loadProductos();
            this.showSuccessMessage('Producto eliminado correctamente');
          },
          error: (error) => {
            this.showErrorMessage('Error al eliminar el producto');
          }
        });
      }
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  private showSuccessMessage(message: string): void {
    Swal.fire({
      title: '¡Éxito!',
      text: message,
      icon: 'success',
      timer: 2000,
      showConfirmButton: false
    });
  }

  private showErrorMessage(message: string): void {
    Swal.fire({
      title: 'Error',
      text: message,
      icon: 'error',
      confirmButtonText: 'Aceptar'
    });
  }
} 