# Datadog monitoring backend

This small node app is getting the CPU load normalized and serving it through a simple API endpoint.

This uses the UNIX load average metrics. Not working on Windows.

## Prerequisites

- MacOS or Linux
- Node installed (tested only on Node 18.*)

## How to run

- `node load` to launch the server on the specifed port

Then get the current load by calling the `/load` endpoint.

Example:

```bash
curl localhost:8080/load
```

```json
{
  "normalizedLoad": 0.14544677734375
}
```

You can change the HTTP port by overriding the PORT variable
```bash
PORT=4000 node load
```