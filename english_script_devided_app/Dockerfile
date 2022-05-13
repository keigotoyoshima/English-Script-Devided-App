FROM python:3.9-alpine

WORKDIR /usr/src/app

# print出力用
ENV PYTHONUNBUFFERED 1

COPY requirements.txt ./
RUN apk --no-cache add build-base
RUN apk --no-cache add postgresql-dev
RUN pip install --upgrade pip
RUN pip install --no-cache-dir -r requirements.txt
RUN apk add vim

COPY . .

