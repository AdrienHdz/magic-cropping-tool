FROM python:3.7.15

WORKDIR /app

RUN groupadd app \
    && useradd -r -s /bin/false -N -g app app

RUN chown app:app /app

COPY ./requirements/dev-requirements.txt /app/dev-requirements.txt

RUN pip install pip-tools

RUN pip-sync /app/dev-requirements.txt

RUN apt-get update
RUN apt-get install ffmpeg libsm6 libxext6  -y

COPY ./api /app/api

EXPOSE 8080

USER app

CMD ["uvicorn", "api.main:app", "--host", "0.0.0.0", "--port", "8080"]