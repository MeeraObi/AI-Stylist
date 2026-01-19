"use client";

import { useStylistStore } from "@/store/use-stylist-store";
import { Camera, Video, X, RefreshCw } from "lucide-react";
import { useState, useRef } from "react";
import Image from "next/image";

export default function StylistUpload() {
    const { userBlob, setUserBlob, setScreen, setLoading, setPreliminaryResults } = useStylistStore();
    const [isCameraActive, setIsCameraActive] = useState(false);
    const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    const startCamera = async () => {
        setIsCameraActive(true);
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' } });
            setCameraStream(stream);
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
            }
        } catch (err) {
            console.error("Camera access error:", err);
            alert("Could not access camera. Please check permissions.");
            setIsCameraActive(false);
        }
    };

    const stopCamera = () => {
        if (cameraStream) {
            cameraStream.getTracks().forEach(track => track.stop());
            setCameraStream(null);
        }
        setIsCameraActive(false);
    };

    const capturePhoto = () => {
        if (videoRef.current && canvasRef.current) {
            const video = videoRef.current;
            const canvas = canvasRef.current;
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            const ctx = canvas.getContext('2d');
            if (ctx) {
                ctx.drawImage(video, 0, 0);
                canvas.toBlob((blob) => {
                    if (blob) {
                        const file = new File([blob], "capture.jpg", { type: "image/jpeg" });
                        setUserBlob(file);
                        stopCamera();
                    }
                }, 'image/jpeg');
            }
        }
    };

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setUserBlob(file);
    };

    const submitAnalysis = async () => {
        if (!userBlob) return;
        setLoading(true, "Comprehensive Scan...");

        const fd = new FormData();
        fd.append("files", userBlob);

        try {
            const res = await fetch("/api/analyze-preliminary", {
                method: "POST",
                body: fd,
            });
            const data = await res.json();
            setPreliminaryResults(data);
            setScreen("initial-check");
        } catch (error) {
            console.error(error);
            alert("Error analyzing photo. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="screen">
            <h2 className="text-2xl font-bold mb-2">Stylist&apos;s Eye</h2>
            <p className="text-gray-500 mb-8 leading-relaxed">We need a clear photo to analyze your facial structure and body proportions.</p>

            {!isCameraActive && !userBlob && (
                <div className="relative group">
                    <div className="tile border-2 border-dashed border-gray-200 bg-gray-50/50 py-16 flex flex-col items-center justify-center transition-all group-hover:bg-gray-50 group-hover:border-gray-300">
                        <div className="bg-white p-4 rounded-full shadow-sm mb-4">
                            <Camera className="h-8 w-8 text-gray-400" />
                        </div>
                        <p className="text-sm font-medium text-gray-600 mb-10 text-center">Front facing, good lighting<br /><span className="text-xs text-gray-400">Avoid hats, glasses, or busy backgrounds</span></p>

                        <div className="flex flex-col gap-3 w-full px-4">
                            <button className="btn-nia flex items-center justify-center gap-2" onClick={startCamera}>
                                <Video size={18} /> Live Camera
                            </button>
                            <label className="btn-nia-outline flex items-center justify-center gap-2 bg-white cursor-pointer">
                                <span>Upload Photo</span>
                                <input type="file" accept="image/*" className="hidden" onChange={handleUpload} />
                            </label>
                        </div>
                    </div>
                </div>
            )}

            {isCameraActive && (
                <div className="tile p-4 overflow-hidden bg-black flex flex-col items-center">
                    <video ref={videoRef} autoPlay playsInline className="w-full max-h-[400px] rounded-xl mb-6 bg-gray-900 object-cover" />
                    <canvas ref={canvasRef} className="hidden" />
                    <div className="flex gap-4 w-full">
                        <button className="btn-nia bg-red-500 text-white flex-1" onClick={stopCamera}>
                            <X size={18} />
                        </button>
                        <button className="btn-nia bg-white text-black flex-[2]" onClick={capturePhoto}>
                            Capture
                        </button>
                    </div>
                </div>
            )}

            {userBlob && !isCameraActive && (
                <div className="animate-in zoom-in-95 duration-300">
                    <div className="tile bg-gray-50 flex flex-col items-center py-10">
                        <div className="relative h-64 w-48 rounded-2xl overflow-hidden border-8 border-white shadow-xl mb-8">
                            <Image
                                src={URL.createObjectURL(userBlob)}
                                alt="Upload Preview"
                                fill
                                className="object-cover"
                            />
                        </div>
                        <div className="flex gap-4 w-full px-4">
                            <button className="btn-nia-outline flex-1 flex items-center justify-center gap-2 bg-white" onClick={() => setUserBlob(null)}>
                                <RefreshCw size={16} /> Retake
                            </button>
                            <button className="btn-nia flex-1" onClick={submitAnalysis}>
                                Analyze Style
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
