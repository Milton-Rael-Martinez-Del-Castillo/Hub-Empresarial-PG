import React, { useState, useEffect, useRef } from "react";
import axios from 'axios';
import Toast from '../common/Toast';
import { useAuth } from '../login/AuthContext';

const MyTasks = () => {
    const { user } = useAuth();
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [toast, setToast] = useState(null);
    const [activeTab, setActiveTab] = useState("Preincubación");
    const [selectedTask, setSelectedTask] = useState(null);

    // Estados para la entrega
    const [filesToUpload, setFilesToUpload] = useState([]);
    const [linksToUpload, setLinksToUpload] = useState([]);
    const [linkInput, setLinkInput] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [taskFiles, setTaskFiles] = useState([]);
    const [loadingFiles, setLoadingFiles] = useState(false);
    const [filesToDelete, setFilesToDelete] = useState([]);

    const fileInputRef = useRef(null);
    const API_URL = 'http://localhost:8000/api';

    const showToast = (message, type = 'success') => {
        setToast({ message, type });
    };

    const closeToast = () => {
        setToast(null);
    };

    useEffect(() => {
        loadTasks();
    }, []);

    const loadTasks = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`${API_URL}/mentee-assignments`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setTasks(response.data);
        } catch (error) {
            console.error('Error al cargar tareas:', error);
            showToast('Error al cargar tus tareas', 'error');
        } finally {
            setLoading(false);
        }
    };

    const loadTaskFiles = async (taskId) => {
        setLoadingFiles(true);
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`${API_URL}/assignments/${taskId}/files`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setTaskFiles(response.data);
        } catch (error) {
            console.error('Error al cargar archivos:', error);
            showToast('Error al cargar los materiales de referencia', 'error');
        } finally {
            setLoadingFiles(false);
        }
    };

    const handleTaskClick = async (task) => {
        setSelectedTask(task);
        setFilesToUpload([]);
        setLinksToUpload([]);
        setFilesToDelete([]);
        await loadTaskFiles(task.id);
    };

    const handleBackToList = () => {
        setSelectedTask(null);
        setFilesToUpload([]);
        setLinksToUpload([]);
    };

    const handleFileSelect = (e) => {
        const files = Array.from(e.target.files);
        setFilesToUpload([...filesToUpload, ...files]);
        e.target.value = ''; // Reset input
    };

    const handleRemoveFile = (index) => {
        setFilesToUpload(filesToUpload.filter((_, i) => i !== index));
    };

    const handleAddLink = () => {
        if (!linkInput.trim()) return;
        setLinksToUpload([...linksToUpload, linkInput]);
        setLinkInput("");
    };

    const handleRemoveLink = (index) => {
        setLinksToUpload(linksToUpload.filter((_, i) => i !== index));
    };

    const handleQueueDeleteFile = (fileId) => {
        setFilesToDelete([...filesToDelete, fileId]);
    };

    const handleSubmitDelivery = async () => {
        // Permitir envío si hay nuevos archivos/links O si hay archivos para eliminar (actualización de entrega)
        if (filesToUpload.length === 0 && linksToUpload.length === 0 && filesToDelete.length === 0) {
            showToast('Debes adjuntar un archivo/enlace o eliminar uno existente para actualizar.', 'error');
            return;
        }

        setIsSubmitting(true);
        try {
            const token = localStorage.getItem('token');
            const formData = new FormData();

            filesToUpload.forEach(file => {
                formData.append('files', file);
            });

            if (linksToUpload.length > 0) {
                formData.append('links', JSON.stringify(linksToUpload));
            }

            if (filesToDelete.length > 0) {
                formData.append('deletedFileIds', JSON.stringify(filesToDelete));
            }

            await axios.post(`${API_URL}/assignments/${selectedTask.id}/deliver`, formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data'
                }
            });

            showToast('¡Tarea entregada exitosamente!', 'success');
            handleBackToList();
            loadTasks(); // Recargar lista para actualizar estado
        } catch (error) {
            console.error('Error al entregar tarea:', error);
            showToast('Error al enviar la entrega', 'error');
        } finally {
            setIsSubmitting(false);
        }
    };

    const [searchTerm, setSearchTerm] = useState("");

    // Filtrar tareas por fase activa y término de búsqueda
    const filteredTasks = tasks.filter(task => {
        const matchesPhase = task.phase === activeTab;
        const searchLower = searchTerm.toLowerCase();
        const matchesSearch = task.title.toLowerCase().includes(searchLower) ||
            (task.mentor_name && task.mentor_name.toLowerCase().includes(searchLower));
        return matchesPhase && matchesSearch;
    });

    // Helper para iconos
    const getFileIcon = (fileName) => {
        const ext = fileName.split('.').pop().toLowerCase();
        if (['pdf'].includes(ext)) return '📄';
        if (['doc', 'docx'].includes(ext)) return '📝';
        if (['xls', 'xlsx'].includes(ext)) return '📊';
        if (['jpg', 'jpeg', 'png'].includes(ext)) return '🖼️';
        return '📎';
    };

    return (
        <div className="max-w-5xl mx-auto py-10 px-4 min-h-screen bg-white">
            {toast && <Toast message={toast.message} type={toast.type} onClose={closeToast} />}

            <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Tareas Asignadas</h1>

            </div>

            {/* Buscador */}
            <div className="flex justify-center mb-6">
                <div className="relative w-full max-w-md">
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </span>
                    <input
                        type="text"
                        placeholder="Buscar por título o mentor..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-[#8B0D37] text-sm shadow-sm"
                    />
                </div>
            </div>

            {/* Tabs */}
            <div className="flex justify-center mb-8 border-b border-gray-200">
                {["Preincubación", "Incubación", "Lanzamiento"].map((tab) => (
                    <button
                        key={tab}
                        onClick={() => { setActiveTab(tab); setSelectedTask(null); }}
                        className={`px-8 py-3 text-lg font-medium transition-all duration-200 ${activeTab === tab
                            ? "text-[#8B0D37] border-b-2 border-[#8B0D37]"
                            : "text-gray-500 hover:text-gray-700"
                            }`}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            {loading ? (
                <div className="flex justify-center p-10">
                    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#8B0D37]"></div>
                </div>
            ) : selectedTask ? (
                /* VISTA DE DETALLE (Inspirada en Figma) */
                <div className="bg-gray-50 rounded-xl p-8 border border-gray-200 shadow-sm animate-fadeIn">
                    <button onClick={handleBackToList} className="mb-4 text-gray-500 hover:text-[#8B0D37] flex items-center gap-1 text-sm">
                        ← Volver a la lista
                    </button>

                    <div className="mb-8">
                        <p className="text-gray-500 text-sm mb-1">(Tarea)</p>
                        <h2 className="text-2xl font-bold text-gray-900 mb-6">{selectedTask.title}</h2>

                        <p className="text-gray-500 text-sm mb-1">(Instrucciones)</p>
                        <div className="bg-white p-4 rounded-lg border border-gray-100 text-gray-700 whitespace-pre-wrap">
                            {selectedTask.description}
                        </div>
                    </div>

                    {/* Materiales de Referencia */}
                    <div className="mb-8">
                        <h3 className="font-bold text-lg text-gray-900 mb-4">Materiales de referencia</h3>
                        {loadingFiles ? (
                            <p className="text-sm text-gray-500">Cargando materiales...</p>
                        ) : taskFiles.filter(f => f.uploader_role === 'Mentor').length > 0 ? (
                            <div className="space-y-3">
                                {taskFiles.filter(f => f.uploader_role === 'Mentor').map((file) => (
                                    <div key={file.id} className="flex items-center justify-between bg-[#2F3E46] text-white p-3 rounded-md">
                                        <div className="flex items-center gap-3 overflow-hidden">
                                            <span className="text-xl">{getFileIcon(file.url)}</span>
                                            <span className="truncate text-sm">{file.url.split('/').pop()}</span>
                                        </div>
                                        {file.url.startsWith('http') && !file.url.includes('localhost') ? (
                                            <a href={file.url} target="_blank" rel="noreferrer" className="text-gray-300 hover:text-white p-2" title="Abrir enlace">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                                </svg>
                                            </a>
                                        ) : (
                                            <a
                                                href={`http://localhost:8000${file.url}`}
                                                download
                                                className="text-gray-300 hover:text-white p-2"
                                                title="Descargar archivo"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                                </svg>
                                            </a>
                                        )}
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-sm text-gray-400 italic">No hay materiales de referencia.</p>
                        )}
                    </div>

                    {/* Archivos Enviados Anteriormente */}
                    {taskFiles.filter(f => f.uploader_role === 'Emprendedor' && !filesToDelete.includes(f.id)).length > 0 && (
                        <div className="mb-8">
                            <h3 className="font-bold text-lg text-gray-900 mb-4">Mis Entregas Anteriores</h3>
                            <div className="space-y-3">
                                {taskFiles.filter(f => f.uploader_role === 'Emprendedor' && !filesToDelete.includes(f.id)).map((file) => (
                                    <div key={file.id} className="flex items-center justify-between bg-green-600 text-white p-3 rounded-md">
                                        <div className="flex items-center gap-3 overflow-hidden">
                                            <span className="text-xl">{getFileIcon(file.url)}</span>
                                            <span className="truncate text-sm">{file.url.split('/').pop()}</span>
                                            <span className="text-xs bg-green-700 px-2 py-0.5 rounded">Enviado</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            {file.url.startsWith('http') && !file.url.includes('localhost') ? (
                                                <a href={file.url} target="_blank" rel="noreferrer" className="text-gray-200 hover:text-white p-1" title="Abrir enlace">
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                                    </svg>
                                                </a>
                                            ) : (
                                                <a
                                                    href={`http://localhost:8000${file.url}`}
                                                    download
                                                    className="text-gray-200 hover:text-white p-1"
                                                    title="Descargar archivo"
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                                    </svg>
                                                </a>
                                            )}
                                            <button
                                                onClick={() => handleQueueDeleteFile(file.id)}
                                                className="text-red-300 hover:text-red-100 p-1"
                                                title="Eliminar de la entrega"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                </svg>
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Mi Tarea (Upload Section) */}
                    <div className="mb-8">
                        <h3 className="font-bold text-lg text-gray-900 mb-4">Mi Tarea</h3>

                        <div className="border p-6 rounded-lg bg-white shadow-sm">
                            {(filesToUpload.length > 0 || linksToUpload.length > 0) && (
                                <div className="space-y-3 mb-6">
                                    <h4 className="text-sm font-medium text-gray-700 mb-2">Archivos listos para enviar:</h4>
                                    {filesToUpload.map((file, idx) => (
                                        <div key={idx} className="flex items-center justify-between bg-blue-50 border border-blue-200 rounded-lg p-3">
                                            <div className="flex items-center gap-3 overflow-hidden">
                                                <span className="text-2xl">{getFileIcon(file.name)}</span>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm font-medium text-gray-900 truncate">{file.name}</p>
                                                    <p className="text-xs text-gray-500">{(file.size / 1024).toFixed(2)} KB</p>
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => handleRemoveFile(idx)}
                                                className="text-red-500 hover:text-red-700 p-1"
                                                title="Eliminar"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                </svg>
                                            </button>
                                        </div>
                                    ))}
                                    {linksToUpload.map((link, idx) => (
                                        <div key={idx} className="flex items-center justify-between bg-purple-50 border border-purple-200 rounded-lg p-3">
                                            <div className="flex items-center gap-3 overflow-hidden">
                                                <span className="text-2xl">🔗</span>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm font-medium text-gray-900 truncate">{link}</p>
                                                    <p className="text-xs text-gray-500">Enlace externo</p>
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => handleRemoveLink(idx)}
                                                className="text-red-500 hover:text-red-700 p-1"
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

                            <div className="mb-6">
                                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
                                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                        <svg className="w-10 h-10 mb-3 text-[#8B0D37]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                        </svg>
                                        <p className="mb-2 text-sm text-gray-700">
                                            <span className="font-semibold text-[#8B0D37]">Click para subir</span> o arrastrar y soltar
                                        </p>
                                        <p className="text-xs text-gray-500">Documentos, Imágenes, Videos (MAX. 50MB)</p>
                                    </div>
                                    <input
                                        type="file"
                                        ref={fileInputRef}
                                        onChange={handleFileSelect}
                                        className="hidden"
                                        multiple
                                    />
                                </label>
                            </div>

                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={linkInput}
                                    onChange={(e) => setLinkInput(e.target.value)}
                                    placeholder="Pegar enlace aquí (ej: https://drive.google.com/...)"
                                    className="flex-1 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#8B0D37] text-sm"
                                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddLink())}
                                />
                                <button
                                    onClick={handleAddLink}
                                    className="bg-blue-600 text-white px-4 py-2 rounded text-sm font-medium hover:bg-blue-700 transition-colors"
                                >
                                    + Agregar Link
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 mt-4">
                        <button
                            onClick={handleBackToList}
                            className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
                        >
                            Cancelar
                        </button>
                        <button
                            onClick={handleSubmitDelivery}
                            disabled={isSubmitting || (filesToUpload.length === 0 && linksToUpload.length === 0 && filesToDelete.length === 0)}
                            className="bg-[#8B0D37] text-white px-8 py-2 rounded-lg font-bold hover:bg-[#6E0B2A] transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
                        >
                            {isSubmitting ? 'Enviando...' : (filesToDelete.length > 0 && filesToUpload.length === 0 && linksToUpload.length === 0) ? 'Actualizar Entrega' : 'Entregar Tarea'}
                        </button>
                    </div>

                </div>
            ) : (
                /* LISTA DE TAREAS (Vista inicial por Fase) */
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {filteredTasks.length === 0 ? (
                        <div className="col-span-full text-center py-20 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
                            <p className="text-gray-400 text-lg">No hay tareas asignadas en esta etapa.</p>
                        </div>
                    ) : (
                        filteredTasks.map((task) => (
                            <div
                                key={task.id}
                                onClick={() => handleTaskClick(task)}
                                className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg hover:border-[#8B0D37] transition-all cursor-pointer group relative overflow-hidden"
                            >
                                <div className={`absolute top-0 left-0 w-1 h-full ${task.status === 2 ? 'bg-green-500' : 'bg-yellow-500'}`}></div>
                                <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-[#8B0D37]">{task.title}</h3>
                                <p className="text-gray-500 text-sm line-clamp-2 mb-4">{task.description}</p>
                                <div className="flex justify-between items-center mt-auto">
                                    <span className="text-sm text-gray-400">Asignado por: {task.mentor_name}</span>
                                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${task.status === 2 ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                                        }`}>
                                        {task.status === 2 ? 'Entregada' : 'Pendiente'}
                                    </span>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            )}

            <style>{`
                .animate-fadeIn {
                    animation: fadeIn 0.4s ease-out;
                }
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
            `}</style>
        </div>
    );
};

export default MyTasks;
