"use client";

import SwaggerUI from "swagger-ui-react";
import "swagger-ui-react/swagger-ui.css";

type Props = {
  spec: Record<string, any>;
};

function ReactSwagger({ spec }: Props) {
  return (
    <div className="swagger-ui-container bg-white">
      <SwaggerUI spec={spec} />
      <style dangerouslySetInnerHTML={{ __html: `
        .swagger-ui-container {
          background-color: white !important;
          color: black !important;
        }
        .swagger-ui .info .title, 
        .swagger-ui .info li, 
        .swagger-ui .info p, 
        .swagger-ui .info table, 
        .swagger-ui .opblock-tag, 
        .swagger-ui .opblock .opblock-summary-operation-id, 
        .swagger-ui .opblock .opblock-summary-path, 
        .swagger-ui .opblock .opblock-summary-description {
          color: #3b4151 !important;
        }
        .swagger-ui .scheme-container {
          background: transparent !important;
          box-shadow: none !important;
          border-bottom: 1px solid #ebebeb;
        }
        /* Ensure the UI doesn't look dark if system is in dark mode */
        .swagger-ui {
          filter: none !important;
          background: white !important;
        }
      `}} />
    </div>
  );
}

export default ReactSwagger;
