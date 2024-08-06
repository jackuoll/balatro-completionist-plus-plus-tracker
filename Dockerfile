FROM python:3.12.4-alpine3.20

WORKDIR /app
RUN mkdir /app/data

COPY requirements.txt .

RUN pip install --no-cache-dir -r requirements.txt

COPY . .

CMD ["python", "main.py"]