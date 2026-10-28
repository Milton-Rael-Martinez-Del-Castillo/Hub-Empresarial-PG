import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Download, FileText, ExternalLink } from "lucide-react";

const Resources = ({ resources }) => {
  const handleDownload = (url, name) => {
    window.open(url, "_blank");
  };

  if (!resources || resources.length === 0) {
    return (
      <div className="text-center py-8 text-slate-500">
        <Download className="h-12 w-12 mx-auto mb-3 text-slate-300" />
        <p>No hay recursos disponibles para esta lección.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <div className="p-2 bg-[#F8E6ED] rounded-lg">
          <Download className="h-5 w-5 text-[#8B0D37]" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-slate-900">
            Recursos para descargar
          </h3>
          <div className="text-sm text-slate-600">
            Materiales adicionales para complementar tu aprendizaje
            <Badge variant="secondary" className="ml-2">
              {resources.length} recurso{resources.length !== 1 ? "s" : ""}
            </Badge>
          </div>
        </div>
      </div>

      <div className="grid gap-3">
        {resources.map((resource, index) => (
          <Card
            key={index}
            className="hover:shadow-md transition-all duration-200 border-slate-200"
          >
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div className="p-2 bg-blue-50 rounded-lg">
                    <FileText className="h-4 w-4 text-blue-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-slate-900 truncate">
                      {resource.name}
                    </h4>
                    <p className="text-sm text-slate-500 flex items-center gap-1">
                      <ExternalLink className="h-3 w-3" />
                      Recurso descargable
                    </p>
                  </div>
                </div>
                <Button
                  onClick={() => handleDownload(resource.url, resource.name)}
                  size="sm"
                  className="bg-[#8B0D37] hover:bg-[#6E0B2A] flex items-center gap-2 shadow-sm"
                >
                  <Download className="h-4 w-4" />
                  Descargar
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Resources;
