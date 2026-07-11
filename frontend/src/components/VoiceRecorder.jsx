import { useState, useRef, useCallback } from 'react';
import { voiceAPI } from '../api/apiService';

export default function VoiceRecorder({ onTranscription }) {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [transcription, setTranscription] = useState('');
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);

  const startRecording = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: MediaRecorder.isTypeSupported('audio/webm') ? 'audio/webm' : 'audio/mp4',
      });
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(chunksRef.current, { type: 'audio/webm' });
        stream.getTracks().forEach((track) => track.stop());
        setIsProcessing(true);

        try {
          const res = await voiceAPI.transcribe(audioBlob);
          const text = res.data.transcription;
          setTranscription(text);
          onTranscription?.(text);
        } catch (err) {
          console.error('Transcription failed:', err);
          setTranscription('Transcription failed. Please try again.');
        } finally {
          setIsProcessing(false);
        }
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (err) {
      console.error('Microphone access denied:', err);
      alert('Please allow microphone access to use voice input.');
    }
  }, [onTranscription]);

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  }, [isRecording]);

  return (
    <div className="glass-card p-4">
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-sm font-semibold text-slate-300 flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
          </svg>
          Voice Input
        </h4>

        {isRecording && (
          <div className="voice-wave">
            <span></span><span></span><span></span><span></span><span></span>
          </div>
        )}
      </div>

      <div className="flex gap-3">
        {!isRecording ? (
          <button
            onClick={startRecording}
            disabled={isProcessing}
            className="btn-gradient flex items-center gap-2 text-sm disabled:opacity-50"
          >
            <span className="flex items-center gap-2">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="6" />
              </svg>
              {isProcessing ? 'Processing...' : 'Start Recording'}
            </span>
          </button>
        ) : (
          <button
            onClick={stopRecording}
            className="bg-red-500/20 text-red-400 border border-red-500/30 font-semibold px-4 py-2.5 rounded-xl flex items-center gap-2 text-sm recording-pulse cursor-pointer transition-all hover:bg-red-500/30"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <rect x="6" y="6" width="12" height="12" rx="2" />
            </svg>
            Stop Recording
          </button>
        )}
      </div>

      {transcription && (
        <div className="mt-3 p-3 rounded-lg bg-white/5 border border-white/10 text-sm text-slate-300">
          <p className="text-xs text-slate-500 mb-1 font-medium">Transcription:</p>
          {transcription}
        </div>
      )}
    </div>
  );
}
