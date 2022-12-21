from api.services.image_prediction import SaliencyPrediction, ImagePrediction
from api.app_config import AppConfig

async def get_predictions_for_image(img_input: str, widht: int, height: int):
    model = SaliencyPrediction(config=AppConfig())
    return model.image_predictions(img_input, widht, height)

