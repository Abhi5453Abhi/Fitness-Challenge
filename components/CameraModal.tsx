'use client'

import React, { useRef, useState, useCallback } from 'react';
import Webcam from 'react-webcam';
import { X, Video, SwitchCamera, Check, Play, User as UserIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface CameraModalProps {
    isOpen: boolean;
    onClose: () => void;
    onVideoRecorded: (videoBlob: Blob) => void;
}

export function CameraModal({ isOpen, onClose, onVideoRecorded }: CameraModalProps) {
    const webcamRef = useRef<Webcam>(null);
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const [capturing, setCapturing] = useState(false);
    const [recordedChunks, setRecordedChunks] = useState<Blob[]>([]);
    const [facingMode, setFacingMode] = useState<'user' | 'environment'>('user');
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    const handleStartCaptureClick = useCallback(() => {
        setCapturing(true);
        setRecordedChunks([]);
        if (webcamRef.current && webcamRef.current.stream) {
            mediaRecorderRef.current = new MediaRecorder(webcamRef.current.stream, {
                mimeType: "video/webm"
            });
            mediaRecorderRef.current.addEventListener(
                "dataavailable",
                handleDataAvailable
            );
            mediaRecorderRef.current.start();
        }
    }, [webcamRef, setCapturing, setRecordedChunks]);

    const handleDataAvailable = useCallback(
        ({ data }: BlobEvent) => {
            if (data.size > 0) {
                setRecordedChunks((prev) => prev.concat(data));
            }
        },
        [setRecordedChunks]
    );

    const handleStopCaptureClick = useCallback(() => {
        if (mediaRecorderRef.current) {
            mediaRecorderRef.current.stop();
        }
        setCapturing(false);
    }, [mediaRecorderRef, setCapturing]);

    const handleRetry = () => {
        setPreviewUrl(null);
        setRecordedChunks([]);
    };

    const handleConfirm = useCallback(() => {
        if (recordedChunks.length) {
            const blob = new Blob(recordedChunks, {
                type: "video/webm"
            });
            onVideoRecorded(blob);
        }
        setPreviewUrl(null);
        setRecordedChunks([]);
    }, [recordedChunks, onVideoRecorded]);

    // Generate preview when recording stops
    React.useEffect(() => {
        if (!capturing && recordedChunks.length > 0) {
            const blob = new Blob(recordedChunks, {
                type: "video/webm"
            });
            const url = URL.createObjectURL(blob);
            setPreviewUrl(url);
        }
    }, [capturing, recordedChunks]);

    const toggleFacingMode = () => {
        setFacingMode(prev => prev === 'user' ? 'environment' : 'user');
    }

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 bg-black flex flex-col"
            >
                {/* Header */}
                <div className="absolute top-0 left-0 right-0 p-4 z-20 flex justify-between items-center bg-gradient-to-b from-black/50 to-transparent">
                    <button onClick={onClose} className="p-2 bg-black/40 rounded-full text-white backdrop-blur-md">
                        <X className="w-6 h-6" />
                    </button>
                    {!previewUrl && (
                        <button onClick={toggleFacingMode} className="p-2 bg-black/40 rounded-full text-white backdrop-blur-md">
                            <SwitchCamera className="w-6 h-6" />
                        </button>
                    )}
                </div>

                {/* Camera / Preview Area */}
                <div className="flex-1 relative bg-black flex items-center justify-center overflow-hidden">
                    {previewUrl ? (
                        <video
                            src={previewUrl}
                            controls
                            className="w-full h-full object-cover"
                            autoPlay
                            loop
                        />
                    ) : (
                        <Webcam
                            audio={false}
                            ref={webcamRef}
                            videoConstraints={{
                                facingMode: facingMode
                            }}
                            className="w-full h-full object-cover"
                        />
                    )}
                </div>

                {/* Controls */}
                <div className="absolute bottom-0 left-0 right-0 p-8 pb-12 bg-gradient-to-t from-black/80 to-transparent flex justify-center items-center gap-8">
                    {previewUrl ? (
                        <>
                            <button
                                onClick={handleRetry}
                                className="px-6 py-3 rounded-full bg-white/20 text-white font-bold backdrop-blur-md"
                            >
                                Retry
                            </button>
                            <button
                                onClick={handleConfirm}
                                className="px-8 py-3 rounded-full bg-[var(--color-primary)] text-white font-bold shadow-lg shadow-blue-500/30 flex items-center gap-2"
                            >
                                <Check className="w-5 h-5" />
                                Submit
                            </button>
                        </>
                    ) : (
                        <div className="relative">
                            {capturing ? (
                                <button
                                    onClick={handleStopCaptureClick}
                                    className="w-20 h-20 rounded-full border-4 border-white flex items-center justify-center transition-all transform scale-110"
                                >
                                    <div className="w-8 h-8 bg-red-500 rounded-sm animate-pulse" />
                                </button>
                            ) : (
                                <button
                                    onClick={handleStartCaptureClick}
                                    className="w-20 h-20 rounded-full border-4 border-white flex items-center justify-center hover:scale-105 transition-transform"
                                >
                                    <div className="w-16 h-16 bg-red-500 rounded-full" />
                                </button>
                            )}
                        </div>
                    )}
                </div>
            </motion.div>
        </AnimatePresence>
    );
}
