"use client";

import { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, X, FileText, Image as ImageIcon, Paperclip } from "lucide-react";
import { Attachment } from "../types";
import { formatFileSize } from "../lib/utils";

interface FileUploadProps {
  attachments: Attachment[];
  onAttachmentsChange: (attachments: Attachment[]) => void;
}

export function FileUpload({ attachments, onAttachmentsChange }: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFiles = useCallback(
    (files: FileList | null) => {
      if (!files) return;
      const newFiles: Attachment[] = Array.from(files).map((file) => ({
        id: `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
        name: file.name,
        type: file.type,
        size: file.size,
        url: URL.createObjectURL(file),
      }));
      onAttachmentsChange([...attachments, ...newFiles]);
    },
    [attachments, onAttachmentsChange]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      handleFiles(e.dataTransfer.files);
    },
    [handleFiles]
  );

  const removeAttachment = (id: string) => {
    const attachment = attachments.find((a) => a.id === id);
    if (attachment && attachment.url.startsWith("blob:")) {
      URL.revokeObjectURL(attachment.url);
    }
    onAttachmentsChange(attachments.filter((a) => a.id !== id));
  };

  const isImage = (type: string) => type.startsWith("image/");

  return (
    <div>
      <AnimatePresence>
        {attachments.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="flex gap-2 overflow-x-auto pb-2 px-4"
          >
            {attachments.map((file) => (
              <motion.div
                key={file.id}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                className="relative shrink-0 group"
              >
                {isImage(file.type) ? (
                  <div className="w-16 h-16 rounded-lg overflow-hidden border border-isuzu-gold/20 bg-white">
                    <img
                      src={file.url}
                      alt={file.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="w-16 h-16 rounded-lg border border-isuzu-gold/20 bg-white flex flex-col items-center justify-center p-1">
                    <FileText className="w-5 h-5 text-isuzu-violet" />
                    <span className="text-[8px] text-gray-500 mt-0.5 truncate max-w-[50px]">
                      {file.name}
                    </span>
                  </div>
                )}
                <button
                  onClick={() => removeAttachment(file.id)}
                  className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-500 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"
                >
                  <X className="w-2.5 h-2.5" />
                </button>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <input
        ref={inputRef}
        type="file"
        multiple
        accept="image/*,.pdf,.doc,.docx,.txt,.csv,.json,.md,.js,.ts,.jsx,.tsx,.html,.css"
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
      />

      <button
        onClick={() => inputRef.current?.click()}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`p-2 rounded-lg transition-all duration-300 ${
          isDragging
            ? "bg-isuzu-violet/10 text-isuzu-violet scale-110"
            : "hover:bg-isuzu-bg text-gray-400 hover:text-isuzu-violet"
        }`}
        title="Upload files"
      >
        {attachments.length > 0 ? (
          <div className="relative">
            <Paperclip className="w-5 h-5" />
            <span className="absolute -top-1.5 -right-1.5 w-3.5 h-3.5 rounded-full bg-isuzu-violet text-white text-[9px] flex items-center justify-center">
              {attachments.length}
            </span>
          </div>
        ) : (
          <Upload className="w-5 h-5" />
        )}
      </button>
    </div>
  );
}
