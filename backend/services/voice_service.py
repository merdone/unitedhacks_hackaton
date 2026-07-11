from fastapi import UploadFile


async def transcribe_audio(audio: UploadFile) -> str:
    """
    Mock voice transcription service.

    In production, this would:
    1. Read the audio blob
    2. Send it to OpenAI Whisper API or similar STT service
    3. Return the transcribed text

    For now, returns a mock response indicating the audio was received.
    """
    audio_data = await audio.read()
    audio_size = len(audio_data)

    return (
        f"[Mock transcription] Audio received ({audio_size} bytes). "
        "In production, this would be transcribed using Whisper API. "
        "Example: 'I felt a slight pain in my left shoulder during overhead press.'"
    )
