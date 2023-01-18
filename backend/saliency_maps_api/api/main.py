from fastapi import FastAPI, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from api.services.predictor import get_predictions_for_image
import io
import logging
import tempfile


logging.basicConfig(level=logging.DEBUG,
                    format="%(asctime)s [%(levelname)s] %(message)s",
                    handlers=[
                        logging.FileHandler("log_file.log"),
                        logging.StreamHandler()
                    ])

logger = logging.getLogger(__name__)


app = FastAPI(docs_url=None, redoc_url=None)

app.add_middleware(
    CORSMiddleware,
    allow_origins='https://magic-cropping-tool.com/',
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/image", response_class=StreamingResponse)
async def get_image( width: int, height: int, file: bytes = File()) -> StreamingResponse:
    if width < 18 or width > 2048 or height < 18 or height > 2048:
        logger.error(f'Incorrect input dimensions. width: {width}, height: {height}.')
        raise HTTPException(status_code=404, detail='Incorrect input dimensions.')
    else:
        try:
            # Load file in memory as temporary file
            temp_file = tempfile.NamedTemporaryFile(suffix='.jpg')
            temp_file.write(file)
            temp_file.seek(0)
            image_predicted = await get_predictions_for_image(temp_file.name, width, height)

            # Pass data to API in a jpeg format
            cropped_image = io.BytesIO()
            image_predicted.save(cropped_image, 'jpeg')
            cropped_image.seek(0)
            
            # Delete file from memory
            temp_file.close()
            return StreamingResponse(cropped_image, media_type="image/jpg")

        except Exception as e:
            logger.error(f'Could not apply cropping model to input image: {e}.')
            raise e

