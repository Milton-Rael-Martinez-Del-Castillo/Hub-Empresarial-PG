import React from "react";
import { BookOpen, Play, HelpCircle, Download, CheckCircle2, Clock, Star, X, FileText, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

const Sidebar = ({ slides, currentSlide, setCurrentSlide, isOpen, onClose, course }) => {
  const completedSlides = currentSlide + 1;
  const totalSlides = slides.length;
  const progressPercentage = (completedSlides / totalSlides) * 100;

  return (
    <>
      {/* Overlay para móvil */}
      {isOpen && <div className="fixed inset-0 bg-black/50 z-40 md:hidden" onClick={onClose} />}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed top-0 left-0 h-full w-80 bg-white border-r border-slate-200 shadow-xl z-50 transform transition-transform duration-300 md:static md:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        {/* Header del sidebar */}
        <div className="p-6 border-b border-slate-200 bg-gradient-to-r from-[#8B0D37] to-[#6E0B2A] text-white">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/20 rounded-lg">
                <BookOpen className="h-5 w-5 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-white">Contenido del curso</h3>
                <p className="text-sm text-white/80">{totalSlides} lecciones</p>
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose} className="md:hidden text-white hover:bg-white/20">
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Progreso general */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-white/80">Progreso</span>
              <span className="font-medium text-white">{Math.round(progressPercentage)}%</span>
            </div>
            <Progress value={progressPercentage} className="h-2 bg-white/20" />
            <p className="text-xs text-white/70">
              {completedSlides} de {totalSlides} lecciones completadas
            </p>
          </div>
        </div>

        {/* Lista de lecciones */}
        <ScrollArea className="h-[calc(100vh-280px)]">
          <div className="p-4 space-y-2">
            {slides.map((slide, idx) => {
              const isActive = idx === currentSlide;
              const isCompleted = idx < currentSlide;
              const isCurrent = idx === currentSlide;

              return (
                <Card
                  key={slide.id || idx}
                  className={cn(
                    "cursor-pointer transition-all duration-200 hover:shadow-md",
                    isActive && "ring-2 ring-[#8B0D37] bg-[#F8E6ED] border-[#E2B6C6]",
                    !isActive && "hover:bg-slate-50 border-slate-200",
                  )}
                  onClick={() => {
                    setCurrentSlide(idx);
                    onClose();
                  }}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div
                        className={cn(
                          "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium flex-shrink-0",
                          isCompleted && "bg-green-100 text-green-600",
                          isCurrent && "bg-[#8B0D37] text-white",
                          !isCompleted && !isCurrent && "bg-slate-100 text-slate-600",
                        )}
                      >
                        {isCompleted ? <CheckCircle2 className="h-4 w-4" /> : idx + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm text-slate-900 truncate">
                          {slide.title || `Lección ${idx + 1}`}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          {slide.videoUrl && (
                            <div className="flex items-center gap-1">
                              <Play className="h-3 w-3 text-slate-400" />
                              <span className="text-xs text-slate-500">Video</span>
                            </div>
                          )}
                          {slide.embedUrl && (
                            <div className="flex items-center gap-1">
                              <FileText className="h-3 w-3 text-slate-400" />
                              <span className="text-xs text-slate-500">Slides</span>
                            </div>
                          )}
                          {slide.quiz && slide.quiz.length > 0 && (
                            <div className="flex items-center gap-1">
                              <HelpCircle className="h-3 w-3 text-slate-400" />
                              <span className="text-xs text-slate-500">{slide.quiz.length} quiz</span>
                            </div>
                          )}
                          {slide.resources && slide.resources.length > 0 && (
                            <div className="flex items-center gap-1">
                              <Download className="h-3 w-3 text-slate-400" />
                              <span className="text-xs text-slate-500">{slide.resources.length}</span>
                            </div>
                          )}
                        </div>
                      </div>
                      {isActive && <div className="w-2 h-2 bg-[#8B0D37] rounded-full flex-shrink-0" />}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </ScrollArea>

        {/* Footer del sidebar con info del curso */}
        {course && (
          <div className="p-4 border-t border-slate-200 bg-slate-50">
            <div className="space-y-3">
              <h4 className="font-medium text-sm text-slate-900 truncate">{course.title}</h4>
              <div className="flex items-center gap-4 text-xs text-slate-500">
                {course.duration && (
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    <span>{course.duration}</span>
                  </div>
                )}
                {course.rating && (
                  <div className="flex items-center gap-1">
                    <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                    <span>{course.rating}</span>
                  </div>
                )}
                {course.has_certificate && (
                  <div className="flex items-center gap-1">
                    <Award className="h-3 w-3" />
                    <span>Certificado</span>
                  </div>
                )}
              </div>
              {course.provider && <p className="text-xs text-slate-500">Por {course.provider}</p>}
            </div>
          </div>
        )}
      </aside>
    </>
  );
};

export default Sidebar;