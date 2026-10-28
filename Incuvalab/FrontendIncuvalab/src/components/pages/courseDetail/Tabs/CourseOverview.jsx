import React from 'react';

const CourseOverview = ({ data }) => {
  return (
    <div className="space-y-6">
      <section>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Acerca de este curso</h2>
        <div className="prose max-w-none text-gray-700">
          <p className="text-base leading-relaxed">{data.description}</p>
        </div>
      </section>
      
      {data.video_preview_url && (
        <section className="mt-8">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Vista previa del curso</h3>
          <div className="aspect-w-16 aspect-h-9 rounded-lg overflow-hidden shadow-md">
            <iframe 
              src={data.video_preview_url} 
              frameBorder="0" 
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
              allowFullScreen
              className="w-full h-full"
            ></iframe>
          </div>
        </section>
      )}
      
      {data.prerequisites && (
        <section className="mt-8">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Requisitos previos</h3>
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
            <p className="text-gray-700">{data.prerequisites}</p>
          </div>
        </section>
      )}
      
      <section className="mt-8 bg-[#8B0D37]/10 rounded-lg p-6">
        <div className="flex items-start">
          <div className="mr-4 flex-shrink-0">
            <svg className="h-6 w-6 text-[#8B0D37]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <h3 className="text-lg font-medium text-[#6E0B2A]">Información importante</h3>
            <div className="mt-2 text-sm text-[#8B0D37]">
              <p>Este curso es ofrecido a través de {data.provider}, una plataforma educativa reconocida.</p>
              <p className="mt-1">Al inscribirte, obtendrás acceso a todos los materiales y recursos del curso.</p>
              {data.has_certificate && (
                <p className="mt-1">
                  <span className="font-medium">Incluye certificado:</span> Recibirás un certificado oficial al completar el curso.
                </p>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default CourseOverview;