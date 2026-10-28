import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';

const AdminMenteeReport = () => {
    const [mentees, setMentees] = useState([]);
    const [selectedMentee, setSelectedMentee] = useState(null);
    const [assignments, setAssignments] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [loadingAssignments, setLoadingAssignments] = useState(false);

    // Modal state
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedPhaseForModal, setSelectedPhaseForModal] = useState(null);

    // Fetch Mentees on mount
    useEffect(() => {
        const fetchMentees = async () => {
            try {
                const token = localStorage.getItem('token');
                // Ensure we have a route for this or reuse an existing one. 
                // Using existing /api/mentees endpoint if available (checked assignmentRoutes.js, it exists)
                const response = await axios.get('http://localhost:8000/api/mentees', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setMentees(response.data);
            } catch (error) {
                console.error("Error fetching mentees", error);
            }
        };
        fetchMentees();
    }, []);

    // Fetch assignments when a mentee is selected
    useEffect(() => {
        if (selectedMentee) {
            setLoadingAssignments(true);
            const fetchAssignments = async () => {
                try {
                    const token = localStorage.getItem('token');
                    const response = await axios.get(`http://localhost:8000/api/mentee-assignments/${selectedMentee.id}`, {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    setAssignments(response.data);
                } catch (error) {
                    console.error("Error fetching assignments", error);
                } finally {
                    setLoadingAssignments(false);
                }
            };
            fetchAssignments();
        } else {
            setAssignments([]);
        }
    }, [selectedMentee]);

    // Calculate Report Data
    const reportData = useMemo(() => {
        const phases = ['Preincubación', 'Incubación', 'Lanzamiento'];

        return phases.map(phase => {
            const phaseTasks = assignments.filter(a => a.phase === phase);
            const total = phaseTasks.length;
            const completed = phaseTasks.filter(a => a.status === 2).length;
            const pending = phaseTasks.filter(a => a.status === 1).length;
            // "Avance %" = Completed / Total (if Total > 0)
            const progress = total > 0 ? Math.round((completed / total) * 100) : 0;

            return {
                phase,
                progress,
                completed,
                pending, // "Asignadas (Pendientes/Total)" - User asked for "asignadas numero de status 1". Let's show Status 1 count.
                tasks: phaseTasks
            };
        });
    }, [assignments]);

    const filteredMentees = mentees.filter(m =>
        m.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleSelectMentee = (mentee) => {
        setSelectedMentee(mentee);
        setSearchTerm(mentee.email);
        setIsDropdownOpen(false);
    };

    const openModal = (phaseData) => {
        setSelectedPhaseForModal(phaseData);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedPhaseForModal(null);
    };

    // Helper for file icons
    const getFileIcon = (url) => {
        if (!url) return '📄';
        if (url.includes('.pdf')) return '📄';
        if (url.includes('.doc')) return '📝';
        if (url.includes('.xls')) return '📊';
        if (url.includes('.jpg') || url.includes('.png')) return '🖼️';
        return '📎';
    };

    return (
        <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold text-[#8B0D37] mb-6">Reporte Mentee</h2>

            {/* Combobox Search */}
            <div className="relative mb-8 max-w-md">
                <label className="block text-sm font-medium text-gray-700 mb-1">Seleccionar Mentee</label>
                <div className="relative">
                    <input
                        type="text"
                        className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-[#8B0D37] focus:border-transparent"
                        placeholder="Buscar mentee..."
                        value={searchTerm}
                        onChange={(e) => {
                            setSearchTerm(e.target.value);
                            setIsDropdownOpen(true);
                            if (selectedMentee && e.target.value !== selectedMentee.email) setSelectedMentee(null);
                        }}
                        onFocus={() => setIsDropdownOpen(true)}
                    />
                    {isDropdownOpen && (filteredMentees.length > 0) && (
                        <ul className="absolute z-10 w-full bg-white border border-gray-300 rounded-md mt-1 max-h-60 overflow-y-auto shadow-lg">
                            {filteredMentees.map(mentee => (
                                <li
                                    key={mentee.id}
                                    className="px-3 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                                    onClick={() => handleSelectMentee(mentee)}
                                >
                                    {mentee.email}
                                </li>
                            ))}
                            {filteredMentees.length === 0 && (
                                <li className="px-3 py-2 text-gray-500 text-sm">No se encontraron resultados</li>
                            )}
                        </ul>
                    )}
                </div>
            </div>

            {/* Report Table */}
            {selectedMentee && (
                <div className="overflow-x-auto">
                    <table className="min-w-full bg-white border border-gray-200">
                        <thead className="bg-[#8B0D37] text-white">
                            <tr>
                                <th className="py-3 px-4 text-left font-semibold text-sm">Fase</th>
                                <th className="py-3 px-4 text-center font-semibold text-sm">Avance %</th>
                                <th className="py-3 px-4 text-center font-semibold text-sm">Tareas Entregadas</th>
                                <th className="py-3 px-4 text-center font-semibold text-sm">Asignadas Pendientes</th>
                                <th className="py-3 px-4 text-center font-semibold text-sm">Detalles</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {reportData.map((row) => (
                                <tr key={row.phase} className="hover:bg-gray-50 transition-colors">
                                    <td className="py-3 px-4 text-gray-900 font-medium">{row.phase}</td>
                                    <td className="py-3 px-4 text-center">
                                        <div className="flex items-center justify-center gap-2">
                                            <span className="text-sm font-semibold text-gray-700">{row.progress}%</span>
                                            <div className="w-24 bg-gray-200 rounded-full h-2.5">
                                                <div
                                                    className="bg-green-600 h-2.5 rounded-full"
                                                    style={{ width: `${row.progress}%` }}
                                                ></div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="py-3 px-4 text-center text-gray-700 font-medium">{row.completed}</td>
                                    <td className="py-3 px-4 text-center text-gray-700 font-medium">{row.pending}</td>
                                    <td className="py-3 px-4 text-center">
                                        <button
                                            onClick={() => openModal(row)}
                                            className="text-[#8B0D37] hover:text-[#6E0B2A] font-medium text-sm underline"
                                        >
                                            Ver Tareas
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {loadingAssignments && <p className="text-gray-500 mt-4">Cargando reporte...</p>}

            {/* Modal */}
            {isModalOpen && selectedPhaseForModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto p-6 md:p-8 relative">
                        <button
                            onClick={closeModal}
                            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>

                        <h3 className="text-2xl font-bold text-[#8B0D37] mb-2">{selectedPhaseForModal.phase}</h3>
                        <p className="text-gray-500 mb-6">Detalle de tareas del mentee: <span className="font-semibold text-gray-700">{selectedMentee?.email}</span></p>

                        <div className="space-y-6">
                            {selectedPhaseForModal.tasks.length > 0 ? (
                                selectedPhaseForModal.tasks.map(task => {
                                    const mentorFiles = task.files.filter(f => f.uploader_role === 'Mentor');
                                    const menteeFiles = task.files.filter(f => f.uploader_role === 'Emprendedor');

                                    return (
                                        <div key={task.id} className="border border-gray-200 rounded-lg p-5 bg-gray-50">
                                            <div className="flex justify-between items-start mb-3">
                                                <div>
                                                    <h4 className="text-lg font-bold text-gray-900">{task.title}</h4>
                                                    <p className="text-sm text-gray-500">Mentor: <span className="font-medium">{task.mentor_name}</span></p>
                                                </div>
                                                <span className={`px-2 py-1 rounded text-xs font-semibold ${task.status === 2 ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                                    {task.status === 2 ? 'Completada' : 'Pendiente'}
                                                </span>
                                            </div>

                                            <div className="mb-4">
                                                <p className="text-sm font-semibold text-gray-700 mb-1">Instrucciones:</p>
                                                <p className="text-sm text-gray-600 bg-white p-3 rounded border border-gray-200 whitespace-pre-wrap">{task.description}</p>
                                            </div>

                                            <div className="grid md:grid-cols-2 gap-4">
                                                {/* Mentor Files */}
                                                <div>
                                                    <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Archivos del Mentor</p>
                                                    {mentorFiles.length > 0 ? (
                                                        <ul className="space-y-2">
                                                            {mentorFiles.map(file => (
                                                                <li key={file.id} className="flex items-center gap-2 text-sm text-gray-700 bg-white p-2 rounded border border-gray-200">
                                                                    <span>{getFileIcon(file.url)}</span>
                                                                    {file.url.startsWith('http') && !file.url.includes('localhost') ? (
                                                                        <a href={file.url} target="_blank" rel="noreferrer" className="truncate hover:text-[#8B0D37] hover:underline">
                                                                            {file.url.split('/').pop()}
                                                                        </a>
                                                                    ) : (
                                                                        <a href={`http://localhost:8000${file.url}`} target="_blank" rel="noreferrer" className="truncate hover:text-[#8B0D37] hover:underline">
                                                                            {file.url.split('/').pop()}
                                                                        </a>
                                                                    )}
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    ) : (
                                                        <p className="text-xs text-gray-400 italic">Sin archivos adjuntos</p>
                                                    )}
                                                </div>

                                                {/* Mentee Files */}
                                                <div>
                                                    <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Respuesta del Mentee</p>
                                                    {menteeFiles.length > 0 ? (
                                                        <ul className="space-y-2">
                                                            {menteeFiles.map(file => (
                                                                <li key={file.id} className="flex items-center gap-2 text-sm text-gray-700 bg-green-50 p-2 rounded border border-green-200">
                                                                    <span>{getFileIcon(file.url)}</span>
                                                                    {file.url.startsWith('http') && !file.url.includes('localhost') ? (
                                                                        <a href={file.url} target="_blank" rel="noreferrer" className="truncate hover:text-green-700 hover:underline">
                                                                            {file.url.split('/').pop()}
                                                                        </a>
                                                                    ) : (
                                                                        <a href={`http://localhost:8000${file.url}`} target="_blank" rel="noreferrer" className="truncate hover:text-green-700 hover:underline">
                                                                            {file.url.split('/').pop()}
                                                                        </a>
                                                                    )}
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    ) : (
                                                        <p className="text-xs text-gray-400 italic">Sin respuesta adjunta</p>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })
                            ) : (
                                <p className="text-center text-gray-500 py-8 italic">No hay tareas asignadas en esta fase.</p>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminMenteeReport;
