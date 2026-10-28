import React from "react";
import { BookOpen, FileText } from "lucide-react";

const SlideContent = ({ title, content }) => {
  if (!content && !title) {
    return (
      <div className="text-center py-8 text-slate-500">
        <FileText className="h-12 w-12 mx-auto mb-3 text-slate-300" />
        <p>No hay contenido disponible para esta lección.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <div className="p-2 bg-[#F8E6ED] rounded-lg">
          <BookOpen className="h-5 w-5 text-[#8B0D37]" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-slate-900">Contenido de la lección</h3>
          <p className="text-sm text-slate-600">Material de estudio</p>
        </div>
      </div>

      {title && (
        <div>
          <h4 className="text-xl font-bold text-slate-900 mb-3">{title}</h4>
        </div>
      )}

      {content && (
        <div className="prose prose-slate max-w-none">
          <div className="text-slate-700 leading-relaxed whitespace-pre-wrap text-base">{content}</div>
        </div>
      )}
    </div>
  );
};

export default SlideContent;