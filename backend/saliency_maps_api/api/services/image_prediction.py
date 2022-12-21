from abc import ABC
from pathlib import Path

import PIL
from api.services.crop_api import ImageSaliencyModel

import logging

from api.app_config import AppConfig

logging.basicConfig(level=logging.ERROR)


class ImagePrediction(ABC):
    def __init__(self) -> None:
        self._initialize()

    def _initialize(self):
        pass

    def _load_model(self):
        pass

class SaliencyPrediction(ImagePrediction):
    def __init__(self, config: AppConfig) -> None:
        self.config = config
        super().__init__()

    def _initialize(self):
        self._model = self._load_model(self.config.candidate_crops, self.config.fastgaze)

    def _load_model(self, crop_binary_path: str, crop_model_path: str) -> ImageSaliencyModel:
        return ImageSaliencyModel(
            crop_binary_path=crop_binary_path,
            crop_model_path=crop_model_path)

    def image_predictions(self, img_input: str, width: int, height: int) -> PIL.Image.Image:
        return self._model.plot_img_crops(Path(img_input), selected_width=width, selected_height=height)
