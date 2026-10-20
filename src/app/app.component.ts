import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';

type Especialidad = 'Desarrollo' | 'Redes' | 'Inteligencia Artificial';
type Turno = 'Mañana' | 'Noche';
type Modalidad = 'Presencial' | 'Virtual';
type Experiencia = 'Principiante' | 'Intermedio' | 'Avanzado';
type Vista = 'inicio' | 'inscripcion' | 'participantes' | 'resumen' | 'ayuda';

interface Participante {
  id: number;
  nombre: string;
  correo: string;
  especialidad: Especialidad;
  turno: Turno;
  modalidad: Modalidad;
  experiencia: Experiencia;
  entradas: number;
  codigoPromocional: string;
  fecha: string;
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  vista: Vista = 'inicio';
  participantes: Participante[] = [];
  siguienteId = 1;
  mensaje = '';
  tipoMensaje: 'success' | 'error' = 'success';
  busqueda = '';
  filtroTurno: 'Todos' | Turno = 'Todos';
  filtroEspecialidad: 'Todas' | Especialidad = 'Todas';

  nuevo = {
    nombre: '',
    correo: '',
    especialidad: '' as Especialidad | '',
    turno: '' as Turno | '',
    modalidad: '' as Modalidad | '',
    experiencia: '' as Experiencia | '',
    entradas: 1,
    codigoPromocional: ''
  };

  get tituloVista(): string {
    const titulos: Record<Vista, string> = {
      inicio: 'Inicio',
      inscripcion: 'Nueva inscripción',
      participantes: 'Participantes',
      resumen: 'Resumen e informes',
      ayuda: 'Guía de uso'
    };
    return titulos[this.vista];
  }

  ngOnInit(): void {
    try {
      const guardados = localStorage.getItem('aulaLabParticipantes');
      if (guardados) {
        this.participantes = JSON.parse(guardados) as Participante[];
        this.siguienteId = this.participantes.reduce((max, p) => Math.max(max, p.id), 0) + 1;
      }
    } catch {
      this.participantes = [];
    }
  }

  get totalInscritos(): number { return this.participantes.length; }
  get totalManana(): number { return this.participantes.filter(p => p.turno === 'Mañana').length; }
  get totalNoche(): number { return this.participantes.filter(p => p.turno === 'Noche').length; }
  get totalPresencial(): number { return this.participantes.filter(p => p.modalidad === 'Presencial').length; }
  get totalVirtual(): number { return this.participantes.filter(p => p.modalidad === 'Virtual').length; }
  get totalDesarrollo(): number { return this.participantes.filter(p => p.especialidad === 'Desarrollo').length; }
  get totalRedes(): number { return this.participantes.filter(p => p.especialidad === 'Redes').length; }
  get totalIA(): number { return this.participantes.filter(p => p.especialidad === 'Inteligencia Artificial').length; }
  get porcentajeManana(): number { return this.totalInscritos ? Math.round(this.totalManana / this.totalInscritos * 100) : 0; }
  get porcentajeNoche(): number { return this.totalInscritos ? Math.round(this.totalNoche / this.totalInscritos * 100) : 0; }

  get participantesFiltrados(): Participante[] {
    const texto = this.busqueda.trim().toLocaleLowerCase();
    return this.participantes.filter(p => {
      const coincideTexto = !texto || p.nombre.toLocaleLowerCase().includes(texto) ||
        p.correo.toLocaleLowerCase().includes(texto) || p.especialidad.toLocaleLowerCase().includes(texto);
      const coincideTurno = this.filtroTurno === 'Todos' || p.turno === this.filtroTurno;
      const coincideEspecialidad = this.filtroEspecialidad === 'Todas' || p.especialidad === this.filtroEspecialidad;
      return coincideTexto && coincideTurno && coincideEspecialidad;
    });
  }

  irA(vista: Vista): void {
    this.vista = vista;
    this.mensaje = '';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  registrar(form: NgForm): void {
    if (form.invalid || !this.nuevo.especialidad || !this.nuevo.turno || !this.nuevo.modalidad || !this.nuevo.experiencia) {
      this.tipoMensaje = 'error';
      this.mensaje = 'Revisa los campos obligatorios antes de registrar.';
      form.control.markAllAsTouched();
      return;
    }
    const correo = this.nuevo.correo.trim().toLocaleLowerCase();
    const correoValido = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/.test(correo);
    if (!correoValido) {
      this.tipoMensaje = 'error';
      this.mensaje = 'Ingresa un correo válido con un dominio correcto, por ejemplo nombre@gmail.com.';
      return;
    }
    if (!Number.isInteger(Number(this.nuevo.entradas)) || Number(this.nuevo.entradas) < 1 || Number(this.nuevo.entradas) > 5) {
      this.tipoMensaje = 'error';
      this.mensaje = 'Puedes registrar entre 1 y 5 entradas por persona.';
      return;
    }
    const codigo = this.nuevo.codigoPromocional.trim();
    if (codigo && codigo.length !== 6) {
      this.tipoMensaje = 'error';
      this.mensaje = 'El código promocional es opcional, pero debe tener exactamente 6 caracteres.';
      return;
    }
    if (this.participantes.some(p => p.correo.toLocaleLowerCase() === correo)) {
      this.tipoMensaje = 'error';
      this.mensaje = 'Este correo ya tiene una inscripción registrada.';
      return;
    }

    const participante: Participante = {
      id: this.siguienteId++,
      nombre: this.nuevo.nombre.trim(),
      correo,
      especialidad: this.nuevo.especialidad as Especialidad,
      turno: this.nuevo.turno as Turno,
      modalidad: this.nuevo.modalidad as Modalidad,
      experiencia: this.nuevo.experiencia as Experiencia,
      entradas: Number(this.nuevo.entradas),
      codigoPromocional: codigo,
      fecha: new Date().toLocaleDateString('es-PE')
    };
    this.participantes = [participante, ...this.participantes];
    this.guardar();
    this.limpiarFormulario(form, false);
    this.tipoMensaje = 'success';
    this.mensaje = `Inscripción N.° ${participante.id} registrada correctamente.`;
  }

  eliminar(id: number): void {
    const persona = this.participantes.find(p => p.id === id);
    this.participantes = this.participantes.filter(p => p.id !== id);
    this.guardar();
    this.tipoMensaje = 'success';
    this.mensaje = persona ? `Se eliminó la inscripción de ${persona.nombre}.` : 'Inscripción eliminada.';
  }

  limpiarFormulario(form: NgForm, mostrarMensaje = true): void {
    form.resetForm({ nombre: '', correo: '', especialidad: '', turno: '', modalidad: '', experiencia: '', entradas: 1, codigoPromocional: '' });
    this.nuevo = { nombre: '', correo: '', especialidad: '', turno: '', modalidad: '', experiencia: '', entradas: 1, codigoPromocional: '' };
    if (mostrarMensaje) {
      this.tipoMensaje = 'success';
      this.mensaje = 'Formulario limpiado.';
    }
  }

  cargarEjemplos(): void {
    const ejemplos: Omit<Participante, 'id'>[] = [
      { nombre: 'Ana Torres', correo: 'ana.torres@instituto.edu.pe', especialidad: 'Desarrollo', turno: 'Mañana', modalidad: 'Presencial', experiencia: 'Principiante', entradas: 1, codigoPromocional: '', fecha: new Date().toLocaleDateString('es-PE') },
      { nombre: 'Luis Mendoza', correo: 'luis.mendoza@instituto.edu.pe', especialidad: 'Redes', turno: 'Noche', modalidad: 'Virtual', experiencia: 'Intermedio', entradas: 2, codigoPromocional: '', fecha: new Date().toLocaleDateString('es-PE') },
      { nombre: 'María Rojas', correo: 'maria.rojas@instituto.edu.pe', especialidad: 'Inteligencia Artificial', turno: 'Mañana', modalidad: 'Virtual', experiencia: 'Avanzado', entradas: 1, codigoPromocional: '', fecha: new Date().toLocaleDateString('es-PE') }
    ];
    let agregados = 0;
    for (const ejemplo of ejemplos) {
      if (!this.participantes.some(p => p.correo.toLocaleLowerCase() === ejemplo.correo.toLocaleLowerCase())) {
        this.participantes.unshift({ ...ejemplo, id: this.siguienteId++ });
        agregados++;
      }
    }
    this.guardar();
    this.tipoMensaje = 'success';
    this.mensaje = agregados ? `Se agregaron ${agregados} participantes de demostración.` : 'Los participantes de demostración ya están registrados.';
  }

  borrarTodos(): void {
    this.participantes = [];
    this.siguienteId = 1;
    this.guardar();
    this.tipoMensaje = 'success';
    this.mensaje = 'La lista de participantes quedó vacía.';
  }

  quitarMensaje(): void { this.mensaje = ''; }

  private guardar(): void {
    try {
      localStorage.setItem('aulaLabParticipantes', JSON.stringify(this.participantes));
    } catch {
      this.tipoMensaje = 'error';
      this.mensaje = 'No se pudieron guardar los datos en el navegador.';
    }
  }

  trackById(_index: number, participante: Participante): number { return participante.id; }
}
