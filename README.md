# LocalStack SNS SMS Viewer

A simple web viewer for SMS messages sent via LocalStack SNS.

![Screenshot](screenshot.png)

## Features

- View all SMS messages sent through LocalStack SNS
- Auto-refresh with configurable polling interval
- Clear all messages with one click
- Shows message details including phone number, timestamp, region, and account ID
- Clean, responsive UI

## Quick Start

### Using Docker (Recommended)

```bash
docker build -t sms-viewer .
docker run --rm -e LOCALSTACK_HOST=http://localstack:4566 -p 3006:3006 sms-viewer
```

Open http://localhost:3006 in your browser.

### Using Docker Compose

Add to your `docker-compose.yml`:

```yaml
services:
  localstack:
    image: localstack/localstack:latest
    ports:
      - "4566:4566"
    environment:
      - SERVICES=sns
    healthcheck:
      test: ["CMD", "awslocal", "sns", "list-topics"]
      interval: 10s
      timeout: 5s
      retries: 5

  sms-viewer:
    build:
      context: https://github.com/steelydylan/localstack-sns-sms-viewer.git
    environment:
      - LOCALSTACK_HOST=http://localstack:4566
      - PORT=3006
    ports:
      - "3006:3006"
    depends_on:
      localstack:
        condition: service_healthy
```

### Running Locally

```bash
npm install
LOCALSTACK_HOST=http://localhost:4566 PORT=3006 node server.js
```

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `LOCALSTACK_HOST` | LocalStack endpoint URL | `http://localhost:4566` |
| `PORT` | Web server port | `3006` |
| `POLL_INTERVAL` | Auto-refresh interval in milliseconds | `5000` |

## Sending Test SMS

Use the AWS CLI with LocalStack to send a test SMS:

```bash
aws --endpoint-url=http://localhost:4566 sns publish \
  --phone-number "+1234567890" \
  --message "Hello from LocalStack!"
```

Or using `awslocal`:

```bash
awslocal sns publish \
  --phone-number "+1234567890" \
  --message "Hello from LocalStack!"
```

## API Endpoints

The viewer proxies the following LocalStack endpoints:

- `GET /api/sms-messages` - Get all SMS messages
- `DELETE /api/sms-messages` - Clear all SMS messages
- `GET /api/config` - Get viewer configuration

## LocalStack Direct Access

You can also access SMS messages directly from LocalStack:

```bash
# Get all SMS messages
curl http://localhost:4566/_aws/sns/sms-messages

# Clear all SMS messages
curl -X DELETE http://localhost:4566/_aws/sns/sms-messages
```

## License

MIT
