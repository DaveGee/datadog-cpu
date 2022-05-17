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
- [x] React Frontend (+redux?) able to fetch the current load
- [x] Fetch on load and every 10s
    - [x] Store in the front in an appropriate DS. Discard useless data points
    - [ ] Identify load events in the front (heavy load = 2min+ @ >1.0, recovery = 2min+ @ <1.0)
    - [x] Keep track of each heavy load or recovery event with timestamps
- [ ] Display load in line graph + display current load
    - [ ] Use recharts?
- [ ] Display heavy loads in the graph
- [ ] Display events (load + recovery)
- [ ] Alert each time there's a detected change (desktop alert? other?)
- [ ] Add a loading indicator for when is the next update (10s) indicating how old is the update

### Misc

- [] No types (TS would be nice) to test for robustness. Did not bother to add tests for "types"
- [] Trusting that the API returns what it says. Not handling API errors, timeouts

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

### `2022-05-17`

- Keeping track of load trends seems a bit too much for a 60-element array. Might be premature optimization....
- Multiple ways of measuring the 2min windows for detecting loads and recoveries:
-- 1/ Counting samples (based on sample frequency) -> Easy but not precise, and dependent on polling freq
-- 2/ Keeping track of samplings timestamps when polling -> More precise, not dependent on polling freq
-- Chose to go with timestamps, as it feels more natural to write tests and code is closer to instructions (speaking of window of 2 minutes instead of 120 samples)
- Issues with testing state... because of non-reinitialized store
- LoadChart doing both setInterval and dispatch is difficult to test

### `2022-05-16`

- Use of redux might be over-engineering for this PoC
- How to deduplicate api subscriptions across components? Best is to have a common higher component managing the setInterval.
- Discovered `msw` package. Would be maybe useful instead of mocking fetch

### `2022-05-15`

- 10s interval is hard coded
- Considered RTK Query, but made the whole thing difficult to AT test
- React-redux is the binding to simplify boilerplate between React and redux (the connect, mapStateToProps, etc...)
- Redux toolkit is a wrapper to redux boilerplates, and RTK Query is a toolset to simplify common data fetching user cases (building API)

### `2022-05-14`

- Used Create-react-app to speed up the process
- 1 data point every 10s, for 10min window = 60 data points max
- 2min window = 12 data points (=12 consecutive values > 1.0)
- events: 
    - when 12 data points are over or equal 1.0 => heavy load event detected
    - when 12 data points are below 1.0, and after an unsolved heavy load => system has recovered
- Assumed that the node service does neither store, nor remember past values (doesn't keep it in memory). Meaning the front app can't retrieve past data, it has to be launched. It can also not retrieve "missed" data if for example a few call are unsuccessful.

