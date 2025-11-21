"use client";

import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Progress } from "@/components/ui/progress";
import { FileText, Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

interface FileUploaderProps {
  onFileSelect?: (file: File | null) => void;
  accept?: string;
}

export function FileUploader({ onFileSelect, accept }: FileUploaderProps) {
  const [file, setFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const { toast } = useToast();

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const selectedFile = acceptedFiles[0];

      if (selectedFile.size > 5 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Please upload a file smaller than 5MB",
          variant: "destructive",
        });
        return;
      }

      if (
        ![
          "application/pdf",
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        ].includes(selectedFile.type)
      ) {
        toast({
          title: "Invalid file type",
          description: "Please upload a PDF or DOCX file",
          variant: "destructive",
        });
        return;
      }

      setFile(selectedFile);
      onFileSelect?.(selectedFile); // Notify parent component
      simulateUpload();
    },
    [toast, onFileSelect]
  );

  const simulateUpload = () => {
    setUploadProgress(0);
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 10;
      });
    }, 200);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: accept
      ? { [accept]: [] }
      : {
          "application/pdf": [".pdf"],
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
            [".docx"],
        },
    maxFiles: 1,
  });

  const removeFile = () => {
    setFile(null);
    setUploadProgress(0);
    onFileSelect?.(null); // Notify parent component of file removal
  };

  return (
    <div className="space-y-4">
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
          ${isDragActive ? "border-primary bg-primary/10" : "border-border"}
          ${file ? "border-success bg-success/10" : ""}`}
      >
        <input {...getInputProps()} />
        {!file && (
          <div className="flex flex-col items-center space-y-4">
            <Upload className="h-12 w-12 text-muted-foreground" />
            <div className="space-y-2">
              <p className="text-lg font-medium">
                {isDragActive
                  ? "Drop your CV here"
                  : "Drag & drop your CV here"}
              </p>
              <p className="text-sm text-muted-foreground">
                Supports PDF and DOCX files up to 5MB
              </p>
            </div>
            <Button type="button" variant="secondary">
              Browse Files
            </Button>
          </div>
        )}
        {file && (
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center space-x-4">
              <FileText className="h-8 w-8 text-primary" />
              <div className="space-y-1">
                <p className="text-sm font-medium">{file.name}</p>
                <p className="text-xs text-muted-foreground">
                  {(file.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                removeFile();
              }}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>
      {file && uploadProgress < 100 && (
        <Progress value={uploadProgress} className="h-2" />
      )}
    </div>
  );
}
