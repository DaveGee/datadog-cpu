# Datadog CPU monitoring

[Task instructions](instructions.md)

## How to run

Start the backend first (see [details](backend/readme.md))

```bash
cd backend && node load
```

Start the front once the backend is running. Default port for the backend is 8080. If you change above, change below too.

```bash
cd front && npm start
```

To run tests
```bash
cd front && npm test
```

## Todos

- [x] Backend that can give back the cpu load through an API
- [ ] React Frontend (+redux?) to get the data every 10s and display the current load
    - [ ] Store in the front in an appropriate DS. Discard useless data points
    - [ ] Identify load events in the front (heavy load = 2min+ @ >1.0, recovery = 2min+ @ <1.0)
- [ ] Display load in line graph + display current load
    - [ ] Use recharts?
- [ ] Display heavy loads in the graph
- [ ] Display events (load + recovery)
- [ ] Alert each time there's a detected change (desktop alert? other?)

## Architecture & UX

- Each data point retrieved is "now". Meaning all other existing data points are "moved" -1 pos in the past (or -10s)
- DS: 
    - array: need to fill the last position, and move all others down. OR need to reverse the array when displaying
    - LL: can easily add a new data point, keep track of the "load status" separately. Can add even with the data point. Keep track of the last (Doubly LL?). To display, Run through the list "60x" max (start from the end). Easy to insert and destroy

### UX

- Show the current value (decimals)
- Show a line graph for -10min -> now, with all values
- Show events on the line graph
- highlight high load intervals if any

## Notes

- Used Create-react-app to speed up the process
- 1 data point every 10s, for 10min window = 60 data points max
- 2min window = 12 data points (=12 consecutive values > 1.0)
- events: 
    - when 12 data points are over or equal 1.0 => heavy load event detected
    - when 12 data points are below 1.0, and after an unsolved heavy load => system has recovered
- Assumed that the node service does neither store, nor remember past values (doesn't keep it in memory). Meaning the front app can't retrieve past data, it has to be launched. It can also not retrieve "missed" data if for example a few call are unsuccessful.

