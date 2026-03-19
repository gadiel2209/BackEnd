// solicitudes.routes.js
import { Router } from 'express';
import * as ctrl from '../controllers/solicitudes.controllers.js';

const router = Router();

// ── Dashboard ──────────────────────────────────────────────
// GET /solicitudes/stats/global
// Estadísticas globales para el dashboard del admin
router.get('/stats/global', ctrl.getDashboardStats);

// ── Utilidades de verificación (funciones de BD) ───────────
// GET /solicitudes/verificar/usuario/:id
// Usa FUNCIÓN TieneSolicitudActiva → saber si un usuario puede solicitar
router.get('/verificar/usuario/:id', ctrl.verificarSolicitudActiva);

// GET /solicitudes/equipo/:id/estado
// Usa FUNCIÓN ObtenerEstadoEquipo → saber si un equipo está disponible
router.get('/equipo/:id/estado', ctrl.getEstadoEquipo);

// ── Consultas generales ────────────────────────────────────
// GET /solicitudes
// Todas las solicitudes (vista admin)
router.get('/', ctrl.getAllSolicitudes);

// GET /solicitudes/usuario/:id
// Solicitudes + stats + totalHistórico de un usuario
// Usa FUNCIÓN TotalSolicitudesUsuario
router.get('/usuario/:id', ctrl.getSolicitudesByUsuario);

// GET /solicitudes/:id
// Una solicitud por ID
router.get('/:id', ctrl.getSolicitudById);

// ── Crear ──────────────────────────────────────────────────
// POST /solicitudes
// Usa FUNCIÓN TieneSolicitudActiva + FUNCIÓN ObtenerEstadoEquipo + SP RegistrarSolicitud
router.post('/', ctrl.registrarSolicitud);

// ── Acciones de admin (SPs + Triggers automáticos) ─────────
// PUT /solicitudes/aprobar/:id
// SP AprobarSolicitud → triggers: tg_auditoria_solicitudes, AuditoriaCambioEquipo
router.put('/aprobar/:id', ctrl.aprobarSolicitud);

// PUT /solicitudes/rechazar/:id
// SP RechazarSolicitud → trigger: tg_auditoria_solicitudes
router.put('/rechazar/:id', ctrl.rechazarSolicitud);

// PUT /solicitudes/devolver/:id
// SP MarcarDevuelta → triggers: ActualizarEquipoDevuelto, tg_auditoria_solicitudes, AuditoriaCambioEquipo
router.put('/devolver/:id', ctrl.marcarDevuelta);

export default router;