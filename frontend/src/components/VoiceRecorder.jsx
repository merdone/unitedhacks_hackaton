import { useCallback, useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { voiceAPI } from '../api/apiService';
import AppIcon from './AppIcon';

export default function VoiceRecorder({ onTranscription }) {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [transcription, setTranscription] = useState('');
  const [error, setError] = useState('');
  const mediaRecorderRef = useRef(null);
  const activeStreamRef = useRef(null);
  const chunksRef = useRef([]);

  const stopTracks = useCallback(() => {
    activeStreamRef.current?.getTracks().forEach((track) => track.stop());
    activeStreamRef.current = null;
  }, []);

  useEffect(() => stopTracks, [stopTracks]);

  const startRecording = useCallback(async () => {
    if (!navigator.mediaDevices?.getUserMedia || typeof MediaRecorder === 'undefined') {
      setError('Voice notes are not supported by this browser. You can still write a note below.');
      return;
    }

    setError('');
    setTranscription('');

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      activeStreamRef.current = stream;
      const supportsWebm =
        typeof MediaRecorder.isTypeSupported === 'function' &&
        MediaRecorder.isTypeSupported('audio/webm');
      const mediaRecorder = supportsWebm
        ? new MediaRecorder(stream, { mimeType: 'audio/webm' })
        : new MediaRecorder(stream);

      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) chunksRef.current.push(event.data);
      };

      mediaRecorder.onstop = async () => {
        const mimeType = mediaRecorder.mimeType || 'audio/webm';
        const audioBlob = new Blob(chunksRef.current, { type: mimeType });
        stopTracks();
        setIsProcessing(true);

        try {
          const response = await voiceAPI.transcribe(audioBlob);
          const text = response.data.transcription?.trim();

          if (!text) {
            setError('We could not detect any speech. Try recording a short note again.');
            return;
          }

          setTranscription(text);
          onTranscription?.(text);
        } catch (err) {
          console.error('Transcription failed:', err);
          setError('The voice note could not be transcribed. You can try again or type it below.');
        } finally {
          setIsProcessing(false);
        }
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (err) {
      console.error('Microphone access failed:', err);
      stopTracks();
      setError('Microphone access was not granted. You can change the browser permission and try again.');
    }
  }, [onTranscription, stopTracks]);

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  }, [isRecording]);

  return (
    <div className="app-panel-soft p-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-3">
          <span className="grid size-9 shrink-0 place-items-center rounded-xl border border-cyan-300/15 bg-cyan-300/[0.08] text-cyan-100">
            <AppIcon name="mic" className="h-[18px] w-[18px]" />
          </span>
          <div>
            <h3 className="text-sm font-bold text-slate-200">Add a voice note</h3>
            <p className="mt-1 text-xs leading-5 text-slate-500">Useful for quick context when typing feels slow.</p>
          </div>
        </div>

        {isRecording ? (
          <motion.div
            className="flex items-center gap-1.5 text-xs font-bold text-rose-200"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {[0, 1, 2, 3, 4].map((bar) => (
              <motion.span
                key={bar}
                className="block w-1 rounded-full bg-rose-300"
                animate={{ height: [7, 18, 9, 14, 7] }}
                transition={{ duration: 0.8, delay: bar * 0.09, repeat: Infinity, ease: 'easeInOut' }}
              />
            ))}
            Recording
          </motion.div>
        ) : null}
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-3">
        {isRecording ? (
          <motion.button
            type="button"
            onClick={stopRecording}
            className="inline-flex min-h-10 items-center gap-2 rounded-xl border border-rose-300/25 bg-rose-400/[0.1] px-4 text-sm font-bold text-rose-100 transition hover:bg-rose-400/[0.16]"
            whileTap={{ scale: 0.97 }}
          >
            <span className="size-2.5 rounded-sm bg-rose-200" />
            Stop recording
          </motion.button>
        ) : (
          <motion.button
            type="button"
            onClick={startRecording}
            disabled={isProcessing}
            className="app-button-secondary min-h-10 px-4 text-sm"
            whileTap={{ scale: 0.97 }}
          >
            <AppIcon name={isProcessing ? 'spark' : 'mic'} className="h-4 w-4" />
            {isProcessing ? 'Transcribing…' : 'Record voice note'}
          </motion.button>
        )}
        {!isRecording && !isProcessing ? (
          <span className="text-xs text-slate-600">The microphone is used only while recording.</span>
        ) : null}
      </div>

      {error ? (
        <motion.p
          role="alert"
          className="mt-4 rounded-xl border border-rose-300/15 bg-rose-400/[0.06] px-3 py-2.5 text-xs leading-5 text-rose-100"
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {error}
        </motion.p>
      ) : null}

      {transcription ? (
        <motion.div
          className="mt-4 rounded-xl border border-emerald-300/15 bg-emerald-300/[0.06] p-3"
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <p className="flex items-center gap-2 text-[0.65rem] font-bold uppercase tracking-[0.13em] text-emerald-200">
            <AppIcon name="check" className="h-3.5 w-3.5" strokeWidth={2.3} />
            Added to your note
          </p>
          <p className="mt-2 text-sm leading-6 text-slate-300">{transcription}</p>
        </motion.div>
      ) : null}
    </div>
  );
}
