
const pool = require('../config/database');
const path = require('path');
const fs = require('fs');

// Obtener lista de Emprendedores
exports.getMentees = async (req, res) => {
    try {
        const [rows] = await pool.execute(
            'SELECT id, usuario as email, rol FROM usuario WHERE rol = ?',
            ['Emprendedor']
        );
        res.json(rows);
    } catch (error) {
        console.error('Error al obtener mentees:', error);
        res.status(500).json({ message: 'Error del servidor' });
    }
};

// Obtener asignaciones del mentor
exports.getAssignments = async (req, res) => {
    const mentorId = req.user.id;

    try {
        // Unir con tabla usuario para obtener nombre del mentee
        // Solo mostrar asignaciones y archivos con status = 1 (activos)
        const query = `
            SELECT a.*, u.usuario as mentee_name, f.url as file_url
            FROM assignamet a
            LEFT JOIN usuario u ON a.mentee_id = u.id
            LEFT JOIN file f ON a.id = f.assignamet_id AND f.status = 1
            WHERE a.mentor_id = ? AND a.status IN (1, 2)
            ORDER BY a.created_at DESC
        `;
        const [rows] = await pool.execute(query, [mentorId]);

        // Convertir phase numérico a texto
        const phaseMap = {
            1: 'Preincubación',
            2: 'Incubación',
            3: 'Lanzamiento'
        };

        const formattedRows = rows.map(row => ({
            ...row,
            phase: phaseMap[row.phase] || row.phase
        }));

        res.json(formattedRows);
    } catch (error) {
        console.error('Error al obtener asignaciones:', error);
        res.status(500).json({ message: 'Error del servidor' });
    }
};

// Obtener archivos de una asignación específica
exports.getAssignmentFiles = async (req, res) => {
    const userId = req.user.id;
    const assignmentId = req.params.id;

    try {
        // Verificar que la asignación pertenece al mentor o al mentee
        const [assignment] = await pool.execute(
            'SELECT * FROM assignamet WHERE id = ? AND (mentor_id = ? OR mentee_id = ?) AND status IN (1, 2)',
            [assignmentId, userId, userId]
        );

        if (assignment.length === 0) {
            return res.status(404).json({ message: 'Asignación no encontrada' });
        }

        // Obtener todos los archivos activos de la asignación con información del usuario que lo subió
        const query = `
            SELECT f.id, f.url, f.created_at, f.usuario_id, u.usuario as uploader_name, u.rol as uploader_role 
            FROM file f 
            JOIN usuario u ON f.usuario_id = u.id 
            WHERE f.assignamet_id = ? AND f.status = 1 
            ORDER BY f.created_at ASC
        `;
        const [files] = await pool.execute(query, [assignmentId]);

        res.json(files);
    } catch (error) {
        console.error('Error al obtener archivos:', error);
        res.status(500).json({ message: 'Error del servidor' });
    }
};

// Actualizar asignación
exports.updateAssignment = async (req, res) => {
    const mentorId = req.user.id;
    const assignmentId = req.params.id;
    const { mentee_id, title, phase, description, links, deletedFileIds } = req.body;
    const files = req.files || [];

    if (!mentee_id || !title || !phase || !description) {
        return res.status(400).json({ message: 'Todos los campos son obligatorios' });
    }

    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();

        // Verificar que la asignación pertenece al mentor
        const [assignment] = await connection.execute(
            'SELECT * FROM assignamet WHERE id = ? AND mentor_id = ? AND status IN (1, 2)',
            [assignmentId, mentorId]
        );

        if (assignment.length === 0) {
            await connection.rollback();
            return res.status(404).json({ message: 'Asignación no encontrada o no autorizado' });
        }

        // 1. Actualizar datos de la asignación
        await connection.execute(
            'UPDATE assignamet SET mentee_id = ?, title = ?, phase = ?, description = ? WHERE id = ?',
            [mentee_id, title, phase, description, assignmentId]
        );

        // 2. Marcar archivos eliminados como status = 0 (soft delete)
        if (deletedFileIds) {
            const fileIdsArray = JSON.parse(deletedFileIds);
            for (const fileId of fileIdsArray) {
                await connection.execute(
                    'UPDATE file SET status = 0, updated_at = NOW() WHERE id = ? AND assignamet_id = ?',
                    [fileId, assignmentId]
                );
            }
        }

        // 3. Agregar nuevos archivos
        for (const file of files) {
            const fileExt = path.extname(file.originalname);
            const newFileName = `${assignmentId}_${Date.now()}_${Math.random().toString(36).substring(7)}${fileExt}`;
            const targetPath = path.join(__dirname, '../../Files', newFileName);

            fs.renameSync(file.path, targetPath);

            const fileUrl = `/Files/${newFileName}`;

            await connection.execute(
                'INSERT INTO file (assignamet_id, url, usuario_id, status, created_at, updated_at) VALUES (?, ?, ?, ?, NOW(), NOW())',
                [assignmentId, fileUrl, mentorId, 1]
            );
        }

        // 4. Agregar nuevos links
        if (links) {
            const linksArray = JSON.parse(links);
            for (const linkUrl of linksArray) {
                await connection.execute(
                    'INSERT INTO file (assignamet_id, url, usuario_id, status, created_at, updated_at) VALUES (?, ?, ?, ?, NOW(), NOW())',
                    [assignmentId, linkUrl, mentorId, 1]
                );
            }
        }

        await connection.commit();
        res.json({ message: 'Asignación actualizada exitosamente', id: assignmentId });

    } catch (error) {
        await connection.rollback();
        // Borrar archivos nuevos si falló la actualización
        if (files && files.length > 0) {
            files.forEach(file => {
                if (fs.existsSync(file.path)) {
                    fs.unlinkSync(file.path);
                }
            });
        }
        console.error('Error al actualizar asignación:', error);
        res.status(500).json({ message: 'Error al actualizar la asignación' });
    } finally {
        connection.release();
    }
};

// Crear asignación con múltiples archivos y links
exports.createAssignment = async (req, res) => {
    const mentorId = req.user.id;
    const { mentee_id, title, phase, description, links } = req.body;
    const files = req.files || []; // Array de archivos

    if (!mentee_id || !title || !phase || !description) {
        return res.status(400).json({ message: 'Todos los campos son obligatorios' });
    }

    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();

        // 1. Insertar Asignación
        const [result] = await connection.execute(
            'INSERT INTO assignamet (mentor_id, mentee_id, title, phase, description, status, created_at) VALUES (?, ?, ?, ?, ?, ?, NOW())',
            [mentorId, mentee_id, title, phase, description, 1]
        );

        const assignmentId = result.insertId;

        // 2. Manejar Archivos
        for (const file of files) {
            const fileExt = path.extname(file.originalname);
            const newFileName = `${assignmentId}_${Date.now()}_${Math.random().toString(36).substring(7)}${fileExt}`;
            const targetPath = path.join(__dirname, '../../Files', newFileName);

            // Mover archivo de temp a Files con nombre nuevo
            fs.renameSync(file.path, targetPath);

            const fileUrl = `/Files/${newFileName}`;

            // Insertar registro de archivo
            await connection.execute(
                'INSERT INTO file (assignamet_id, url, usuario_id, status, created_at, updated_at) VALUES (?, ?, ?, ?, NOW(), NOW())',
                [assignmentId, fileUrl, mentorId, 1]
            );
        }

        // 3. Manejar Links
        if (links) {
            const linksArray = JSON.parse(links);
            for (const linkUrl of linksArray) {
                await connection.execute(
                    'INSERT INTO file (assignamet_id, url, usuario_id, status, created_at, updated_at) VALUES (?, ?, ?, ?, NOW(), NOW())',
                    [assignmentId, linkUrl, mentorId, 1]
                );
            }
        }

        await connection.commit();
        res.status(201).json({ message: 'Asignación creada exitosamente', id: assignmentId });

    } catch (error) {
        await connection.rollback();
        // Borrar archivos si se subieron pero falló la DB
        if (files && files.length > 0) {
            files.forEach(file => {
                if (fs.existsSync(file.path)) {
                    fs.unlinkSync(file.path);
                }
            });
        }
        console.error('Error al crear asignación:', error);
        res.status(500).json({ message: 'Error al crear la asignación' });
    } finally {
        connection.release();
    }
};

// Eliminar asignación (soft delete)
exports.deleteAssignment = async (req, res) => {
    const mentorId = req.user.id;
    const assignmentId = req.params.id;

    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();

        // Verificar que la asignación pertenece al mentor y está activa
        const [assignment] = await connection.execute(
            'SELECT * FROM assignamet WHERE id = ? AND mentor_id = ? AND status IN (1, 2)',
            [assignmentId, mentorId]
        );

        if (assignment.length === 0) {
            await connection.rollback();
            return res.status(404).json({ message: 'Asignación no encontrada o no autorizado' });
        }

        // Soft delete: Cambiar status a 0 en archivos
        await connection.execute('UPDATE file SET status = 0, updated_at = NOW() WHERE assignamet_id = ?', [assignmentId]);

        // Soft delete: Cambiar status a 0 en asignación
        await connection.execute('UPDATE assignamet SET status = 0 WHERE id = ?', [assignmentId]);

        await connection.commit();
        res.json({ message: 'Asignación eliminada exitosamente' });

    } catch (error) {
        await connection.rollback();
        console.error('Error al eliminar asignación:', error);
        res.status(500).json({ message: 'Error al eliminar la asignación' });
    } finally {
        connection.release();
    }
};

// Obtener asignaciones del mentee (emprendedor logueado)
exports.getMenteeAssignments = async (req, res) => {
    const menteeId = req.user.id;

    try {
        const query = `
            SELECT a.*, u.usuario as mentor_name
            FROM assignamet a
            LEFT JOIN usuario u ON a.mentor_id = u.id
            WHERE a.mentee_id = ? AND a.status IN (1, 2)
            ORDER BY a.phase ASC, a.created_at DESC
        `;
        const [rows] = await pool.execute(query, [menteeId]);

        const phaseMap = {
            1: 'Preincubación',
            2: 'Incubación',
            3: 'Lanzamiento'
        };

        const formattedRows = rows.map(row => ({
            ...row,
            phase: phaseMap[row.phase] || row.phase
        }));

        res.json(formattedRows);
    } catch (error) {
        console.error('Error al obtener asignaciones del mentee:', error);
        res.status(500).json({ message: 'Error del servidor' });
    }
};

// Entregar una asignación (cambiar status a 2 y subir archivos)
exports.deliverAssignment = async (req, res) => {
    const menteeId = req.user.id;
    const assignmentId = req.params.id;
    const files = req.files || [];
    const { links } = req.body;

    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();

        // 1. Verificar que la asignación le pertenece al mentee y está activa (status 1 o 2)
        const [assignment] = await connection.execute(
            'SELECT * FROM assignamet WHERE id = ? AND mentee_id = ? AND status IN (1, 2)',
            [assignmentId, menteeId]
        );

        if (assignment.length === 0) {
            await connection.rollback();
            return res.status(404).json({ message: 'Asignación no encontrada' });
        }

        // 2. Marcar como entregada (status 2)
        await connection.execute(
            'UPDATE assignamet SET status = 2, updated_at = NOW() WHERE id = ?',
            [assignmentId]
        );

        // 3. Procesar archivos eliminados (Si el mentee quiere quitar una entrega anterior)
        const { deletedFileIds } = req.body;
        if (deletedFileIds) {
            const filesToDelete = JSON.parse(deletedFileIds);
            for (const fileId of filesToDelete) {
                // Verificar que el archivo pertenece a la asignación y fue subido por el mentee
                await connection.execute(
                    'UPDATE file SET status = 0, updated_at = NOW() WHERE id = ? AND assignamet_id = ? AND usuario_id = ?',
                    [fileId, assignmentId, menteeId]
                );
            }
        }

        // 4. Subir archivos de la entrega
        for (const file of files) {
            const fileExt = path.extname(file.originalname);
            const newFileName = `delivery_${assignmentId}_${Date.now()}_${Math.random().toString(36).substring(7)}${fileExt}`;
            const targetPath = path.join(__dirname, '../../Files', newFileName);

            fs.renameSync(file.path, targetPath);

            const fileUrl = `/Files/${newFileName}`;

            await connection.execute(
                'INSERT INTO file (assignamet_id, url, usuario_id, status, created_at, updated_at) VALUES (?, ?, ?, ?, NOW(), NOW())',
                [assignmentId, fileUrl, menteeId, 1]
            );
        }

        // 4. Agregar links de la entrega
        if (links) {
            const linksArray = JSON.parse(links);
            for (const linkUrl of linksArray) {
                await connection.execute(
                    'INSERT INTO file (assignamet_id, url, usuario_id, status, created_at, updated_at) VALUES (?, ?, ?, ?, NOW(), NOW())',
                    [assignmentId, linkUrl, menteeId, 1]
                );
            }
        }

        await connection.commit();
        res.json({ message: 'Asignación entregada exitosamente' });

    } catch (error) {
        await connection.rollback();
        if (files && files.length > 0) {
            files.forEach(file => {
                if (fs.existsSync(file.path)) {
                    fs.unlinkSync(file.path);
                }
            });
        }
        console.error('Error al entregar asignación:', error);
        res.status(500).json({ message: 'Error al entregar la asignación' });
    } finally {
        connection.release();
    }
};

// Obtener asignaciones por ID del mentee (Para Admin)
exports.getAssignmentsByMenteeId = async (req, res) => {
    const menteeId = req.params.id;

    try {
        const query = `
            SELECT a.*, u.usuario as mentor_name, f.id as file_id, f.url as file_url, f.usuario_id as uploader_id, u2.rol as uploader_role
            FROM assignamet a
            LEFT JOIN usuario u ON a.mentor_id = u.id
            LEFT JOIN file f ON a.id = f.assignamet_id AND f.status = 1
            LEFT JOIN usuario u2 ON f.usuario_id = u2.id
            WHERE a.mentee_id = ? AND a.status IN (1, 2)
            ORDER BY a.phase ASC, a.created_at DESC
        `;
        const [rows] = await pool.execute(query, [menteeId]);

        const phaseMap = {
            1: 'Preincubación',
            2: 'Incubación',
            3: 'Lanzamiento'
        };

        // Agrupar resultados por asignación (ya que el JOIN puede duplicar filas si hay múltiples archivos)
        const assignmentsMap = {};

        rows.forEach(row => {
            if (!assignmentsMap[row.id]) {
                assignmentsMap[row.id] = {
                    id: row.id,
                    mentor_id: row.mentor_id,
                    mentee_id: row.mentee_id,
                    title: row.title,
                    description: row.description,
                    phase: phaseMap[row.phase] || row.phase,
                    status: row.status, // 1: Pendiente, 2: Entregada
                    created_at: row.created_at,
                    updated_at: row.updated_at,
                    mentor_name: row.mentor_name,
                    files: []
                };
            }

            if (row.file_id) {
                assignmentsMap[row.id].files.push({
                    id: row.file_id,
                    url: row.file_url,
                    uploader_id: row.uploader_id,
                    uploader_role: row.uploader_role
                });
            }
        });

        const formattedAssignments = Object.values(assignmentsMap);

        res.json(formattedAssignments);
    } catch (error) {
        console.error('Error al obtener asignaciones del mentee:', error);
        res.status(500).json({ message: 'Error del servidor' });
    }
};

