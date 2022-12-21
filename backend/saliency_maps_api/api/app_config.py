from pydantic import BaseSettings, Field
from typing import Union
from pathlib import PurePath

class AppConfig(BaseSettings):
    candidate_crops: Union[str, PurePath]
    fastgaze: Union[str, PurePath]

    class Config:
        env_prefix = 'env_'