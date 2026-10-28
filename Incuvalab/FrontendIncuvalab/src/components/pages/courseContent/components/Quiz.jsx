import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  CheckCircle2,
  XCircle,
  RotateCcw,
  HelpCircle,
  Trophy,
  AlertTriangle,
} from "lucide-react";
import { cn } from "@/lib/utils";

const Quiz = ({ quiz }) => {
  const [selected, setSelected] = useState({});
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);

  const handleSelect = (qIdx, optIdx) => {
    if (showResult) return;
    setSelected({ ...selected, [qIdx]: optIdx });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Contar aciertos
    let correct = 0;
    quiz.forEach((q, i) => {
      if (selected[i] === q.answer) correct++;
    });
    setScore(correct);
    setShowResult(true);
  };

  const handleRetry = () => {
    setSelected({});
    setShowResult(false);
    setScore(0);
  };

  // Deshabilitar submit si no todas las preguntas están respondidas
  const allAnswered =
    quiz.length > 0 && quiz.every((_, i) => typeof selected[i] === "number");
  const percentage = showResult ? Math.round((score / quiz.length) * 100) : 0;

  if (!quiz || quiz.length === 0) {
    return (
      <div className="text-center py-8 text-slate-500">
        <HelpCircle className="h-12 w-12 mx-auto mb-3 text-slate-300" />
        <p>No hay quiz disponible para esta lección.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header del quiz */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-[#F8E6ED] rounded-lg">
            <HelpCircle className="h-5 w-5 text-[#8B0D37]" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-slate-900">
              Quiz de la lección
            </h3>
            <div className="text-sm text-slate-600">
              Pon a prueba tus conocimientos
              <Badge variant="secondary" className="ml-2">
                {quiz.length} pregunta{quiz.length !== 1 ? "s" : ""}
              </Badge>
            </div>
          </div>
        </div>
        {showResult && (
          <Badge
            variant={percentage >= 70 ? "default" : "destructive"}
            className="text-sm flex items-center gap-1"
          >
            {percentage >= 70 ? (
              <Trophy className="h-3 w-3" />
            ) : (
              <AlertTriangle className="h-3 w-3" />
            )}
            {score}/{quiz.length} ({percentage}%)
          </Badge>
        )}
      </div>

      {/* Resultado del quiz */}
      {showResult && (
        <Alert
          className={
            percentage >= 70
              ? "border-green-200 bg-green-50"
              : "border-amber-200 bg-amber-50"
          }
        >
          <div className="flex items-center gap-2">
            {percentage >= 70 ? (
              <CheckCircle2 className="h-4 w-4 text-green-600" />
            ) : (
              <AlertTriangle className="h-4 w-4 text-amber-600" />
            )}
            <AlertDescription
              className={percentage >= 70 ? "text-green-800" : "text-amber-800"}
            >
              {percentage >= 70
                ? "¡Excelente trabajo! Has demostrado un buen dominio del tema."
                : "Puedes mejorar. Te recomendamos revisar el contenido y volver a intentarlo."}
            </AlertDescription>
          </div>
        </Alert>
      )}

      {/* Formulario del quiz */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {quiz.map((q, i) => {
          const userAnswer = selected[i];
          const isCorrect = showResult && userAnswer === q.answer;
          const isIncorrect =
            showResult && userAnswer !== q.answer && userAnswer !== undefined;
          const wasNotAnswered = showResult && userAnswer === undefined;

          return (
            <Card
              key={i}
              className={cn(
                "transition-all duration-200",
                showResult && isCorrect && "border-green-200 bg-green-50",
                showResult && isIncorrect && "border-red-200 bg-red-50",
                showResult && wasNotAnswered && "border-amber-200 bg-amber-50"
              )}
            >
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-[#8B0D37] text-white flex items-center justify-center text-sm font-medium flex-shrink-0 mt-0.5">
                      {i + 1}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-slate-900 mb-4">
                        {q.question}
                      </h4>
                      <div className="space-y-2">
                        {q.options.map((option, j) => {
                          const isSelected = userAnswer === j;
                          const isCorrectOption = showResult && j === q.answer;
                          const isWrongSelection =
                            showResult && isSelected && j !== q.answer;

                          return (
                            <button
                              key={j}
                              type="button"
                              onClick={() => handleSelect(i, j)}
                              disabled={showResult}
                              className={cn(
                                "w-full text-left p-3 rounded-lg border transition-all duration-200 flex items-center gap-3",
                                !showResult &&
                                  "hover:bg-slate-50 hover:border-slate-300 cursor-pointer",
                                isSelected &&
                                  !showResult &&
                                  "border-[#8B0D37] bg-[#F8E6ED]",
                                isCorrectOption &&
                                  "border-green-500 bg-green-50",
                                isWrongSelection && "border-red-500 bg-red-50",
                                !isSelected &&
                                  !isCorrectOption &&
                                  showResult &&
                                  "opacity-60",
                                showResult && "cursor-default"
                              )}
                            >
                              <div
                                className={cn(
                                  "w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0",
                                  isSelected &&
                                    !showResult &&
                                    "border-[#8B0D37] bg-[#8B0D37]",
                                  isCorrectOption &&
                                    "border-green-500 bg-green-500",
                                  isWrongSelection &&
                                    "border-red-500 bg-red-500",
                                  !isSelected &&
                                    !isCorrectOption &&
                                    !showResult &&
                                    "border-slate-300"
                                )}
                              >
                                {isSelected && !showResult && (
                                  <div className="w-2 h-2 bg-white rounded-full" />
                                )}
                                {isCorrectOption && (
                                  <CheckCircle2 className="w-3 h-3 text-white" />
                                )}
                                {isWrongSelection && (
                                  <XCircle className="w-3 h-3 text-white" />
                                )}
                              </div>
                              <span className="flex-1">{option}</span>
                              {showResult && isCorrectOption && (
                                <span className="text-green-600 text-sm font-medium">
                                  Correcta
                                </span>
                              )}
                              {showResult && isWrongSelection && (
                                <span className="text-red-600 text-sm font-medium">
                                  Incorrecta
                                </span>
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                  {showResult && wasNotAnswered && (
                    <div className="ml-9 text-amber-600 text-sm flex items-center gap-1">
                      <AlertTriangle className="h-4 w-4" />
                      No respondiste esta pregunta.
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}

        {/* Botones de acción */}
        <div className="flex items-center justify-between pt-4">
          {!showResult ? (
            <div className="space-y-2">
              <Button
                type="submit"
                disabled={!allAnswered}
                className="bg-[#8B0D37] hover:bg-[#6E0B2A]"
              >
                Comprobar respuestas
              </Button>
              {!allAnswered && (
                <p className="text-red-600 text-sm flex items-center gap-1">
                  <AlertTriangle className="h-4 w-4" />
                  Responde todas las preguntas antes de enviar.
                </p>
              )}
            </div>
          ) : (
            <div className="flex items-center justify-between w-full">
              <div className="text-sm text-slate-600">
                <span className="font-medium">
                  Resultado: {score} de {quiz.length} respuestas correctas
                </span>
              </div>
              <Button
                type="button"
                variant="outline"
                onClick={handleRetry}
                className="flex items-center gap-2"
              >
                <RotateCcw className="h-4 w-4" />
                Intentar de nuevo
              </Button>
            </div>
          )}
        </div>
      </form>
    </div>
  );
};

export default Quiz;
