# Datadog monitoring backend

This small node app is getting the CPU load, normalizing it and serving it through a simple API call

This uses the UNIX load average metrics. Not working on Windows.

## Prerequisites

- Node installed (tested only on Node 18.*)

## How to run

1. `npm i`
2. `node load`

Then get the current load by calling the `/load` endpoint.

Example:

```bash
curl localhost:8080/load
```

```json
{
  "numCpus": 8,
  "load1": 1.16357421875,
  "normalizedLoad": 0.14544677734375
}
```

You can change the HTTP port by overriding the PORT variable
```bash
PORT=4000 node load
```