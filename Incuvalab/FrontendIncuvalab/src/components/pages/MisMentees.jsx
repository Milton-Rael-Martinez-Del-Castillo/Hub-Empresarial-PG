import React, { useState, useEffect } from "react";
import axios from 'axios';
import Toast from '../common/Toast';
import ConfirmModal from '../common/ConfirmModal';

const MisMentees = () => {
    const [assignments, setAssignments] = useState([]);
    const [mentees, setMentees] = useState([]);
    const [filteredMentees, setFilteredMentees] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [showForm, setShowForm] = useState(false);
    const [loading, setLoading] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [formData, setFormData] = useState({
        mentee_id: "",
        title: "",
        phase: "Preincubación",
        description: ""
    });
    const [attachments, setAttachments] = useState([]);
    const [existingFiles, setExistingFiles] = useState([]); // Archivos ya existentes en la DB
    const [deletedFileIds, setDeletedFileIds] = useState([]); // IDs de archivos a eliminar
    const [linkInput, setLinkInput] = useState("");
    const [assignmentSearch, setAssignmentSearch] = useState("");

    // Estados para el modal de archivos
    const [showFilesModal, setShowFilesModal] = useState(false);
    const [selectedAssignment, setSelectedAssignment] = useState(null);
    const [assignmentFiles, setAssignmentFiles] = useState([]);
    const [loadingFiles, setLoadingFiles] = useState(false);

    // Estados para Toast
    const [toast, setToast] = useState(null);

    // Estados para Modal de Confirmación
    const [confirmModal, setConfirmModal] = useState({
        isOpen: false,
        assignmentId: null
    });

    const API_URL = 'http://localhost:8000/api';

    const showToast = (message, type = 'success') => {
        setToast({ message, type });
    };

    const closeToast = () => {
        setToast(null);
    };

    useEffect(() => {
        loadMentees();
        loadAssignments();
    }, []);

    useEffect(() => {
        if (searchTerm.trim() === "") {
            setFilteredMentees(mentees);
        } else {
            const filtered = mentees.filter(m =>
                m.email && m.email.toLowerCase().includes(searchTerm.toLowerCase())
            );
            setFilteredMentees(filtered);
        }
    }, [searchTerm, mentees]);

    const loadMentees = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`${API_URL}/mentees`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setMentees(response.data);
            setFilteredMentees(response.data);
        } catch (error) {
            console.error('Error al cargar mentees:', error);
            showToast('Error al cargar la lista de emprendedores', 'error');
        }
    };

    const loadAssignments = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`${API_URL}/assignments`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            const uniqueAssignments = [];
            const seenIds = new Set();

            response.data.forEach(item => {
                if (!seenIds.has(item.id)) {
                    seenIds.add(item.id);
                    uniqueAssignments.push(item);
                }
            });

            setAssignments(uniqueAssignments);
        } catch (error) {
            console.error('Error al cargar asignaciones:', error);
            showToast('Error al cargar las asignaciones', 'error');
        }
    };

    const loadAssignmentFiles = async (assignmentId) => {
        setLoadingFiles(true);
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`${API_URL}/assignments/${assignmentId}/files`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setAssignmentFiles(response.data);
            return response.data;
        } catch (error) {
            console.error('Error al cargar archivos:', error);
            showToast('Error al cargar los archivos', 'error');
            return [];
        } finally {
            setLoadingFiles(false);
        }
    };

    const handleViewFiles = async (assignment) => {
        setSelectedAssignment(assignment);
        setShowFilesModal(true);
        await loadAssignmentFiles(assignment.id);
    };

    const handleEdit = async (assignment) => {
        setEditMode(true);
        setEditingId(assignment.id);
        setShowForm(true);

        // Mapear phase de texto a valor para el select
        setFormData({
            mentee_id: assignment.mentee_id,
            title: assignment.title,
            phase: assignment.phase,
            description: assignment.description
        });

        // Cargar archivos existentes
        const files = await loadAssignmentFiles(assignment.id);
        setExistingFiles(files);
        setAttachments([]);
        setDeletedFileIds([]);
    };

    const handleCancelEdit = () => {
        setEditMode(false);
        setEditingId(null);
        setShowForm(false);
        setFormData({ mentee_id: "", title: "", phase: "Preincubación", description: "" });
        setAttachments([]);
        setExistingFiles([]);
        setDeletedFileIds([]);
        setSearchTerm("");
    };

    const removeExistingFile = (fileId) => {
        setDeletedFileIds([...deletedFileIds, fileId]);
        setExistingFiles(existingFiles.filter(f => f.id !== fileId));
    };

    const isImageFile = (url) => {
        const ext = url.split('.').pop().toLowerCase();
        return ['png', 'jpg', 'jpeg', 'gif'].includes(ext);
    };

    const isLink = (url) => {
        return url.startsWith('http://') || url.startsWith('https://');
    };

    const getFileIcon = (url) => {
        if (isLink(url)) return '🔗';
        const ext = url.split('.').pop().toLowerCase();
        if (['png', 'jpg', 'jpeg', 'gif'].includes(ext)) return '🖼️';
        if (['pdf'].includes(ext)) return '📄';
        if (['doc', 'docx'].includes(ext)) return '📝';
        if (['xls', 'xlsx'].includes(ext)) return '📊';
        if (['ppt', 'pptx'].includes(ext)) return '📽️';
        if (['mp4'].includes(ext)) return '🎥';
        return '📎';
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleFileSelect = (e) => {
        const files = Array.from(e.target.files);
        const allowedExtensions = ['png', 'jpg', 'jpeg', 'gif', 'pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'mp4'];

        const validFiles = files.filter(file => {
            const fileExtension = file.name.split('.').pop().toLowerCase();
            if (!allowedExtensions.includes(fileExtension)) {
                showToast(`Archivo ${file.name} no permitido`, 'error');
                return false;
            }
            return true;
        });

        const newAttachments = validFiles.map(file => ({
            type: 'file',
            data: file,
            name: file.name,
            size: file.size
        }));

        setAttachments([...attachments, ...newAttachments]);
        e.target.value = '';
    };

    const handleAddLink = () => {
        if (!linkInput.trim()) {
            showToast('Por favor ingresa un link válido', 'error');
            return;
        }

        try {
            new URL(linkInput);
        } catch {
            showToast('Por favor ingresa una URL válida (debe comenzar con http:// o https://)', 'error');
            return;
        }

        setAttachments([...attachments, {
            type: 'link',
            data: linkInput,
            name: linkInput
        }]);
        setLinkInput("");
        showToast('Link agregado correctamente', 'success');
    };

    const removeAttachment = (index) => {
        setAttachments(attachments.filter((_, i) => i !== index));
    };

    const formatFileSize = (bytes) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.mentee_id || !formData.title || !formData.phase || !formData.description) {
            showToast('Por favor completa todos los campos obligatorios', 'error');
            return;
        }

        if (!editMode && attachments.length === 0) {
            showToast('Por favor adjunta al menos un archivo o link', 'error');
            return;
        }

        setLoading(true);

        try {
            const token = localStorage.getItem('token');
            const formDataToSend = new FormData();

            formDataToSend.append('mentee_id', formData.mentee_id);
            formDataToSend.append('title', formData.title);

            const phaseMap = {
                'Preincubación': 1,
                'Incubación': 2,
                'Lanzamiento': 3
            };
            formDataToSend.append('phase', phaseMap[formData.phase]);

            formDataToSend.append('description', formData.description);

            const files = attachments.filter(a => a.type === 'file');
            const links = attachments.filter(a => a.type === 'link');

            files.forEach(attachment => {
                formDataToSend.append('files', attachment.data);
            });

            if (links.length > 0) {
                formDataToSend.append('links', JSON.stringify(links.map(l => l.data)));
            }

            if (editMode) {
                // Agregar IDs de archivos eliminados
                if (deletedFileIds.length > 0) {
                    formDataToSend.append('deletedFileIds', JSON.stringify(deletedFileIds));
                }

                await axios.put(`${API_URL}/assignments/${editingId}`, formDataToSend, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'multipart/form-data'
                    }
                });

                showToast('¡Asignación actualizada exitosamente!', 'success');
            } else {
                await axios.post(`${API_URL}/assignments`, formDataToSend, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'multipart/form-data'
                    }
                });

                showToast('¡Asignación creada exitosamente!', 'success');
            }

            handleCancelEdit();
            loadAssignments();
        } catch (error) {
            console.error('Error al guardar asignación:', error);
            showToast('Error al guardar la asignación: ' + (error.response?.data?.message || error.message), 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteClick = (id) => {
        setConfirmModal({
            isOpen: true,
            assignmentId: id
        });
    };

    const handleConfirmDelete = async () => {
        try {
            const token = localStorage.getItem('token');
            await axios.delete(`${API_URL}/assignments/${confirmModal.assignmentId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            showToast('Asignación eliminada correctamente', 'success');
            loadAssignments();
        } catch (error) {
            console.error('Error al eliminar:', error);
            showToast('Error al eliminar la asignación', 'error');
        }
    };

    return (
        <div className="max-w-6xl mx-auto py-10 px-4">
            {/* Toast */}
            {toast && <Toast message={toast.message} type={toast.type} onClose={closeToast} />}

            {/* Modal de Confirmación */}
            <ConfirmModal
                isOpen={confirmModal.isOpen}
                onClose={() => setConfirmModal({ isOpen: false, assignmentId: null })}
                onConfirm={handleConfirmDelete}
                title="¿Eliminar asignación?"
                message="Esta acción marcará la asignación como eliminada. ¿Estás seguro de continuar?"
                confirmText="Sí, eliminar"
                cancelText="Cancelar"
            />

            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-[#8B0D37]">Gestión de Mentees</h1>
                <button
                    onClick={() => {
                        if (showForm) {
                            handleCancelEdit();
                        } else {
                            setShowForm(true);
                        }
                    }}
                    className="bg-[#8B0D37] text-white px-4 py-2 rounded hover:bg-[#6E0B2A] font-semibold transition-colors"
                >
                    {showForm ? "Ver Lista" : "+ Nueva Asignación"}
                </button>
            </div>

            {showForm ? (
                <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 mb-8 max-w-3xl mx-auto">
                    <h2 className="text-xl font-semibold mb-4 text-gray-800">
                        {editMode ? 'Editar Asignación' : 'Nueva Asignación para Mentee'}
                    </h2>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-gray-700 font-medium mb-1">Seleccionar Emprendedor</label>
                            <input
                                type="text"
                                placeholder="Buscar por email..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full border border-gray-300 rounded px-3 py-2 mb-2 focus:outline-none focus:ring-2 focus:ring-[#8B0D37]"
                            />
                            <select
                                name="mentee_id"
                                value={formData.mentee_id}
                                onChange={handleInputChange}
                                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#8B0D37]"
                                required
                            >
                                <option value="">-- Seleccionar Emprendedor --</option>
                                {filteredMentees.map(mentee => (
                                    <option key={mentee.id} value={mentee.id}>
                                        {mentee.email}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-gray-700 font-medium mb-1">Título de la Tarea</label>
                                <input
                                    type="text"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleInputChange}
                                    className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#8B0D37]"
                                    placeholder="Ej: Plan Financiero"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-gray-700 font-medium mb-1">Fase del Proyecto</label>
                                <select
                                    name="phase"
                                    value={formData.phase}
                                    onChange={handleInputChange}
                                    className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#8B0D37]"
                                >
                                    <option value="Preincubación">Preincubación</option>
                                    <option value="Incubación">Incubación</option>
                                    <option value="Lanzamiento">Lanzamiento</option>
                                </select>
                            </div>
                        </div>

                        <div>
                            <label className="block text-gray-700 font-medium mb-1">Descripción / Instrucciones</label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleInputChange}
                                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#8B0D37]"
                                rows="4"
                                placeholder="Describe detalladamente lo que el mentee debe realizar..."
                                required
                            ></textarea>
                        </div>

                        <div className="border-t pt-4">
                            <label className="block text-gray-700 font-medium mb-3">Adjuntar Recursos</label>

                            {/* Archivos Existentes (solo en modo edición) */}
                            {editMode && existingFiles.length > 0 && (
                                <div className="mb-4">
                                    <p className="text-sm font-medium text-gray-700 mb-2">Archivos actuales ({existingFiles.length}):</p>
                                    <div className="space-y-2">
                                        {existingFiles.map((file) => (
                                            <div key={file.id} className="flex items-center justify-between bg-blue-50 border border-blue-200 rounded-lg p-3">
                                                <div className="flex items-center space-x-3 flex-1 min-w-0">
                                                    <span className="text-2xl flex-shrink-0">
                                                        {getFileIcon(file.url)}
                                                    </span>
                                                    <div className="flex-1 min-w-0">
                                                        <p className="text-sm font-medium text-gray-900 truncate">
                                                            {isLink(file.url) ? file.url : file.url.split('/').pop()}
                                                        </p>
                                                        <p className="text-xs text-gray-500">
                                                            {isLink(file.url) ? 'Link externo' : 'Archivo existente'}
                                                        </p>
                                                    </div>
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={() => removeExistingFile(file.id)}
                                                    className="ml-3 text-red-500 hover:text-red-700 flex-shrink-0"
                                                    title="Eliminar"
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                    </svg>
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <div className="mb-4">
                                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
                                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                        <svg className="w-10 h-10 mb-3 text-[#8B0D37]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                        </svg>
                                        <p className="mb-2 text-sm text-gray-700">
                                            <span className="font-semibold text-[#8B0D37]">Click para subir</span> o arrastrar y soltar
                                        </p>
                                        <p className="text-xs text-gray-500">PNG, JPG, PDF, Word, Excel, PowerPoint, MP4 (MAX. 50MB)</p>
                                    </div>
                                    <input
                                        type="file"
                                        className="hidden"
                                        onChange={handleFileSelect}
                                        accept=".png,.jpg,.jpeg,.gif,.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.mp4"
                                        multiple
                                    />
                                </label>
                            </div>

                            <div className="flex gap-2 mb-4">
                                <input
                                    type="url"
                                    value={linkInput}
                                    onChange={(e) => setLinkInput(e.target.value)}
                                    className="flex-1 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#8B0D37]"
                                    placeholder="https://ejemplo.com/recurso"
                                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddLink())}
                                />
                                <button
                                    type="button"
                                    onClick={handleAddLink}
                                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                                >
                                    + Agregar Link
                                </button>
                            </div>

                            {attachments.length > 0 && (
                                <div className="space-y-2">
                                    <p className="text-sm font-medium text-gray-700 mb-2">Nuevos recursos ({attachments.length}):</p>
                                    {attachments.map((attachment, index) => (
                                        <div key={index} className="flex items-center justify-between bg-green-50 border border-green-200 rounded-lg p-3 hover:bg-green-100 transition-colors">
                                            <div className="flex items-center space-x-3 flex-1 min-w-0">
                                                <span className="text-2xl flex-shrink-0">
                                                    {attachment.type === 'link' ? '🔗' : getFileIcon(attachment.name)}
                                                </span>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm font-medium text-gray-900 truncate" title={attachment.name}>
                                                        {attachment.name}
                                                    </p>
                                                    <p className="text-xs text-gray-500">
                                                        {attachment.type === 'file' ? formatFileSize(attachment.size) : 'Link externo'}
                                                    </p>
                                                </div>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => removeAttachment(index)}
                                                className="ml-3 text-red-500 hover:text-red-700 flex-shrink-0"
                                                title="Eliminar"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                </svg>
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className="flex justify-end gap-3 pt-4">
                            <button
                                type="button"
                                onClick={handleCancelEdit}
                                className="px-5 py-2 text-gray-600 bg-gray-100 rounded hover:bg-gray-200 font-medium"
                            >
                                Cancelar
                            </button>
                            <button
                                type="submit"
                                disabled={loading}
                                className="px-5 py-2 text-white bg-[#8B0D37] rounded hover:bg-[#6E0B2A] font-medium shadow-md disabled:opacity-50"
                            >
                                {loading ? (editMode ? 'Actualizando...' : 'Creando...') : (editMode ? 'Actualizar Tarea' : 'Asignar Tarea')}
                            </button>
                        </div>
                    </form>
                </div>
            ) : (
                <div className="bg-white rounded-lg shadow overflow-hidden">
                    <div className="p-4 border-b border-gray-100 flex justify-end">
                        <div className="relative w-full md:w-64">
                            <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </span>
                            <input
                                type="text"
                                placeholder="Buscar"
                                value={assignmentSearch}
                                onChange={(e) => setAssignmentSearch(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#8B0D37] text-sm"
                            />
                        </div>
                    </div>
                    <table className="w-full">
                        <thead className="bg-[#8B0D37] text-white">
                            <tr>
                                <th className="py-3 px-4 text-left">Emprendedor</th>
                                <th className="py-3 px-4 text-left">Título</th>
                                <th className="py-3 px-4 text-left">Fase</th>
                                <th className="py-3 px-4 text-left">Descripción</th>
                                <th className="py-3 px-4 text-left">Fecha</th>
                                <th className="py-3 px-4 text-left">Estado</th>
                                <th className="py-3 px-4 text-left">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {assignments
                                .filter(assign =>
                                    (assign.mentee_name && assign.mentee_name.toLowerCase().includes(assignmentSearch.toLowerCase())) ||
                                    (assign.title && assign.title.toLowerCase().includes(assignmentSearch.toLowerCase()))
                                )
                                .map((assign) => (
                                    <tr key={assign.id} className="hover:bg-gray-50">
                                        <td className="py-3 px-4 font-medium text-gray-900">{assign.mentee_name}</td>
                                        <td className="py-3 px-4 font-semibold text-[#8B0D37]">{assign.title}</td>
                                        <td className="py-3 px-4">
                                            <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded">
                                                {assign.phase}
                                            </span>
                                        </td>
                                        <td className="py-3 px-4 text-gray-500 max-w-xs truncate" title={assign.description}>
                                            {assign.description}
                                        </td>
                                        <td className="py-3 px-4 text-gray-500">
                                            {assign.created_at ? new Date(assign.created_at).toLocaleDateString() : '-'}
                                        </td>
                                        <td className="py-3 px-4">
                                            <span className={`text-xs font-semibold px-2.5 py-0.5 rounded ${assign.status === 2
                                                ? 'bg-green-100 text-green-800'
                                                : 'bg-yellow-100 text-yellow-800'
                                                }`}>
                                                {assign.status === 2 ? 'Entregada' : 'Pendiente'}
                                            </span>
                                        </td>
                                        <td className="py-3 px-4 flex gap-2">
                                            <button
                                                onClick={() => handleEdit(assign)}
                                                className="text-green-500 hover:text-green-700"
                                                title="Editar"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                </svg>
                                            </button>
                                            <button
                                                onClick={() => handleViewFiles(assign)}
                                                className="text-blue-500 hover:text-blue-700"
                                                title="Ver archivos"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                </svg>
                                            </button>
                                            <button
                                                onClick={() => handleDeleteClick(assign.id)}
                                                className="text-gray-500 hover:text-red-600"
                                                title="Eliminar"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                </svg>
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                        </tbody>
                    </table>
                    {assignments.length === 0 ? (
                        <div className="p-8 text-center text-gray-500">
                            No hay asignaciones registradas.
                        </div>
                    ) : assignments.filter(assign =>
                        assign.mentee_name &&
                        assign.mentee_name.toLowerCase().includes(assignmentSearch.toLowerCase())
                    ).length === 0 && (
                        <div className="p-8 text-center text-gray-500">
                            No se encontraron asignaciones para "{assignmentSearch}".
                        </div>
                    )}
                </div>
            )}

            {/* Modal de Archivos */}
            {showFilesModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
                        <div className="bg-[#8B0D37] text-white px-6 py-4 flex justify-between items-center">
                            <h3 className="text-xl font-semibold">
                                Archivos de: {selectedAssignment?.title}
                            </h3>
                            <button
                                onClick={() => setShowFilesModal(false)}
                                className="text-white hover:text-gray-200"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        <div className="p-6 overflow-y-auto max-h-[calc(90vh-80px)]">
                            {loadingFiles ? (
                                <div className="text-center py-8">
                                    <p className="text-gray-500">Cargando archivos...</p>
                                </div>
                            ) : assignmentFiles.length === 0 ? (
                                <div className="text-center py-8">
                                    <p className="text-gray-500">No hay archivos adjuntos</p>
                                </div>
                            ) : (
                                <div className="space-y-8">
                                    {/* Sección: Recursos del Mentor */}
                                    <div>
                                        <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 border-b pb-2">
                                            Recursos del Mentor
                                        </h4>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {assignmentFiles.filter(f => f.uploader_role === 'Mentor').length === 0 ? (
                                                <p className="text-gray-400 text-sm italic col-span-full pl-2">No hay recursos adjuntos por el mentor.</p>
                                            ) : (
                                                assignmentFiles.filter(f => f.uploader_role === 'Mentor').map(file => (
                                                    <div key={file.id} className="border border-gray-200 rounded-lg p-3 hover:shadow-md transition-shadow bg-gray-50">
                                                        <div className="flex items-center gap-3">
                                                            <span className="text-2xl flex-shrink-0">{getFileIcon(file.url)}</span>
                                                            <div className="flex-1 min-w-0">
                                                                <p className="text-sm font-medium text-gray-900 truncate mb-1">
                                                                    {isLink(file.url) ? 'Enlace' : file.url.split('/').pop()}
                                                                </p>
                                                                {isLink(file.url) ? (
                                                                    <a href={file.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 text-xs font-semibold">Abrir enlace 🔗</a>
                                                                ) : (
                                                                    <a href={`http://localhost:8000${file.url}`} download className="text-[#8B0D37] hover:text-[#6E0B2A] text-xs font-bold flex items-center gap-1">
                                                                        Descargar
                                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                                                        </svg>
                                                                    </a>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))
                                            )}
                                        </div>
                                    </div>

                                    {/* Sección: Entregas del Mentee */}
                                    <div>
                                        <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 border-b pb-2">
                                            Entrega del Mentee
                                        </h4>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {assignmentFiles.filter(f => f.uploader_role === 'Emprendedor').length === 0 ? (
                                                <div className="col-span-full bg-yellow-50 border border-yellow-100 rounded-lg p-4 text-center">
                                                    <p className="text-yellow-700 text-sm font-medium">El mentee aún no ha enviado su entrega.</p>
                                                </div>
                                            ) : (
                                                assignmentFiles.filter(f => f.uploader_role === 'Emprendedor').map(file => (
                                                    <div key={file.id} className="border border-green-200 rounded-lg p-3 hover:shadow-md transition-shadow bg-green-50">
                                                        <div className="flex items-center gap-3">
                                                            <span className="text-2xl flex-shrink-0">{getFileIcon(file.url)}</span>
                                                            <div className="flex-1 min-w-0">
                                                                <p className="text-sm font-medium text-gray-900 truncate mb-1">
                                                                    {isLink(file.url) ? 'Enlace de entrega' : file.url.split('/').pop()}
                                                                </p>
                                                                {isLink(file.url) ? (
                                                                    <a href={file.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 text-xs font-semibold">Abrir enlace 🔗</a>
                                                                ) : (
                                                                    <a href={`http://localhost:8000${file.url}`} download className="text-green-700 hover:text-green-900 text-xs font-bold flex items-center gap-1">
                                                                        Descargar Entrega
                                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                                                        </svg>
                                                                    </a>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MisMentees;
