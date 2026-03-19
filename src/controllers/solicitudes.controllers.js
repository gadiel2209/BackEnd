// solicitudes.controller.js
import * as solicitudModelo from '../models/solicitudes.models.js';

// ─────────────────────────────────────────────
//  LECTURA
// ─────────────────────────────────────────────

export const getAllSolicitudes = async (req, res) => {
    try {
        const solicitudes = await solicitudModelo.getAllSolicitudes();
        res.status(200).json(solicitudes);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getSolicitudById = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        if (isNaN(id)) return res.status(400).json({ message: 'ID inválido' });

        const solicitud = await solicitudModelo.getSolicitudById(id);
        if (!solicitud) return res.status(404).json({ message: 'Solicitud no encontrada' });

        res.status(200).json(solicitud);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

/** Devuelve { solicitudes[], stats{}, totalHistorico } del usuario */
export const getSolicitudesByUsuario = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        if (isNaN(id)) return res.status(400).json({ message: 'ID inválido' });

        // Ejecutamos en paralelo: lista, contadores y total histórico (función BD)
        const [solicitudes, stats, totalHistorico] = await Promise.all([
            solicitudModelo.getSolicitudesByUsuario(id),
            solicitudModelo.getStatsByUsuario(id),
            solicitudModelo.totalSolicitudesUsuario(id),   // FUNCIÓN: TotalSolicitudesUsuario
        ]);

        res.status(200).json({ solicitudes, stats, totalHistorico });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// ─────────────────────────────────────────────
//  CREAR SOLICITUD
// ─────────────────────────────────────────────

/**
 * POST /solicitudes
 * Flujo:
 *  1. Valida que lleguen id_usuario e id_equipo.
 *  2. FUNCIÓN TieneSolicitudActiva → bloquea si ya tiene una activa.
 *  3. FUNCIÓN ObtenerEstadoEquipo  → bloquea si el equipo no está disponible.
 *  4. SP RegistrarSolicitud        → inserta la solicitud y auditoría en transacción.
 */
export const registrarSolicitud = async (req, res) => {
    try {
        const { id_usuario, id_equipo } = req.body;

        if (!id_usuario || !id_equipo)
            return res.status(400).json({ message: 'id_usuario e id_equipo son requeridos' });

        // FUNCIÓN: TieneSolicitudActiva
        const activa = await solicitudModelo.tieneSolicitudActiva(id_usuario);
        if (activa)
            return res.status(409).json({ message: 'El usuario ya tiene una solicitud activa (pendiente o aprobada)' });

        // FUNCIÓN: ObtenerEstadoEquipo
        const estadoEquipo = await solicitudModelo.obtenerEstadoEquipo(id_equipo);
        if (estadoEquipo !== 'disponible')
            return res.status(409).json({ message: `El equipo no está disponible (estado actual: ${estadoEquipo})` });

        // SP: RegistrarSolicitud (hace su propia verificación + transacción interna)
        await solicitudModelo.registrarSolicitud(id_usuario, id_equipo);
        res.status(201).json({ message: 'Solicitud registrada correctamente' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// ─────────────────────────────────────────────
//  ACCIONES DE ADMIN
// ─────────────────────────────────────────────

/**
 * PUT /solicitudes/aprobar/:id
 * SP: AprobarSolicitud → aprueba, pone equipo en 'prestado', historial y auditoría.
 * Triggers que se disparan automáticamente en la BD:
 *   - tg_auditoria_solicitudes (cambio de estado solicitud)
 *   - AuditoriaCambioEquipo    (cambio de estado equipo)
 */
export const aprobarSolicitud = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const { id_admin } = req.body;

        if (isNaN(id) || !id_admin)
            return res.status(400).json({ message: 'id de solicitud e id_admin son requeridos' });

        await solicitudModelo.aprobarSolicitud(id, id_admin);
        res.status(200).json({ message: 'Solicitud aprobada correctamente' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

/**
 * PUT /solicitudes/rechazar/:id
 * SP: RechazarSolicitud → rechaza, guarda motivo en historial y auditoría.
 * Triggers que se disparan automáticamente en la BD:
 *   - tg_auditoria_solicitudes (cambio de estado solicitud)
 */
export const rechazarSolicitud = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const { id_admin, motivo } = req.body;

        if (isNaN(id) || !id_admin)
            return res.status(400).json({ message: 'id de solicitud e id_admin son requeridos' });

        await solicitudModelo.rechazarSolicitud(id, id_admin, motivo || 'Sin motivo especificado');
        res.status(200).json({ message: 'Solicitud rechazada correctamente' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

/**
 * PUT /solicitudes/devolver/:id
 * SP: MarcarDevuelta → marca como devuelta, historial y auditoría.
 * Triggers que se disparan automáticamente en la BD:
 *   - ActualizarEquipoDevuelto   → pone el equipo en 'disponible'
 *   - tg_auditoria_solicitudes   → registra cambio de estado solicitud
 *   - AuditoriaCambioEquipo      → registra cambio de estado equipo
 */
export const marcarDevuelta = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const { id_admin } = req.body;

        if (isNaN(id) || !id_admin)
            return res.status(400).json({ message: 'id de solicitud e id_admin son requeridos' });

        await solicitudModelo.marcarDevuelta(id, id_admin);
        res.status(200).json({ message: 'Equipo marcado como devuelto correctamente' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// ─────────────────────────────────────────────
//  DASHBOARD
// ─────────────────────────────────────────────

export const getDashboardStats = async (req, res) => {
    try {
        const stats = await solicitudModelo.getStatsGlobales();
        res.status(200).json(stats);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// ─────────────────────────────────────────────
//  UTILIDADES EXPUESTAS COMO ENDPOINTS
// ─────────────────────────────────────────────

/**
 * GET /solicitudes/verificar/usuario/:id
 * Usa FUNCIÓN TieneSolicitudActiva → útil para validar en el frontend antes de mostrar el botón de solicitar.
 */
export const verificarSolicitudActiva = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        if (isNaN(id)) return res.status(400).json({ message: 'ID inválido' });

        const activa = await solicitudModelo.tieneSolicitudActiva(id);
        res.status(200).json({ tieneActiva: activa });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

/**
 * GET /solicitudes/equipo/:id/estado
 * Usa FUNCIÓN ObtenerEstadoEquipo → devuelve el estado actual del equipo.
 */
export const getEstadoEquipo = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        if (isNaN(id)) return res.status(400).json({ message: 'ID inválido' });

        const estado = await solicitudModelo.obtenerEstadoEquipo(id);
        res.status(200).json({ id_equipo: id, estado });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};