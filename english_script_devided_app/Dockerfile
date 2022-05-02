FROM python:3.9-alpine

WORKDIR /usr/src/app

COPY requirements.txt ./
RUN apk --no-cache add build-base
RUN apk --no-cache add postgresql-dev
RUN pip install --no-cache-dir -r requirements.txt
RUN apk add vim

COPY . .


CMD [ "python", "manage.py", "runserver", "0.0.0.0:8000"]