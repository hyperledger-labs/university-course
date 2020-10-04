FROM python:3.8.5

ENV VIRTUAL_ENV=/opt/venv
RUN python3 -m venv $VIRTUAL_ENV
ENV PATH="$VIRTUAL_ENV/bin:$PATH"

#Setting flask env vars
ENV FLASK_APP=node.py
ENV FLASK_ENV=development
ENV node_port 5000
ENV host 0.0.0.0
ENV miner_address default_address

# Install dependencies:
COPY requirements.txt .
RUN pip install -r requirements.txt


# Copy and run the application:
COPY . .
CMD ["sh", "-c", "python3 app.py -p ${node_port} -a ${miner_address} -ho ${host}"]
