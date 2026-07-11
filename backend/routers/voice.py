from fastapi import APIRouter, Depends, UploadFile, File

from ..models import User
from ..auth import get_current_user
from ..services.voice_service import transcribe_audio

router = APIRouter(prefix="/voice", tags=["Voice"])


@router.post("/transcribe")
async def transcribe(
    audio: UploadFile = File(...),
    current_user: User = Depends(get_current_user),
):
    """Receive an audio blob, send to STT service, return transcribed text."""
    text = await transcribe_audio(audio)
    return {"transcription": text}
