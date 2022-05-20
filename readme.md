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
    - [x] Identify load events in the front (heavy load = 2min+ @ >1.0, recovery = 2min+ @ <1.0)
    - [x] Keep track of each heavy load or recovery event with timestamps
- [x] Display load in line graph + display current load
- [x] Display events (load + recovery) -> pass recent alerts to the chart
- [x] Display the current load in a separate component (isolate polling?)
- [x] Add a simulation button to work on the UI
- [ ] Alert each time there's a detected change (desktop alert? other?)
- [ ] Add a loading indicator for when is the next update (10s) indicating how old is the update
- [ ] Show if there's an active alert, and since when
- [ ] Show event history (timeline)
- [ ] Show bar chart of events for a typical day
- [ ] Make it a bit more beautiful

### Misc

- No types (TS would be nice) to test for robustness. Did not add tests for JS objects
- Trusting that the API returns what it says. Not handling API errors, timeouts, or data misalignments

## Architecture & UX

- Each data point retrieved is "now". Meaning all other existing data points are "moved" -1 pos in the past (or -10s)
- DS: 
    - array: need to fill the last position, and move all others down. OR need to reverse the array when displaying
    - LinkedList: can easily add a new data point, keep track of the "load status" separately. Can add even with the data point. Keep track of the last (Doubly LL?). To display, Run through the list "60x" max (start from the end). Easy to insert and destroy.
    - For this exercise: used an array with a push. Not ideal in performance, but fine for a PoC for 60 data points, and only 1 feature on the screen

### UX

- Show the current value (decimals?)
- Show a line graph for -10min -> now, with all values
- Show events on the line graph
- highlight high load intervals if any
- show the number of alerts, and recovery events
- show if there is a current open alert
- show notification when events happen
- display concentration of heavy loads by time of day, zoomable?

## Notes

### `2022-05-20`

- Tested only on Chrome & Safari. 
- Discussing with the "PO" (Coralie), we agree that: 
-- It's fine to use a framework for charts (rechart), no need to chart myself.
-- No extra effort on making it responsive or adapted (normal computer screen with minimum resize capabilities)
-- Backend can be very dumb, a bit smarter, or very smart. Keeping it very dumb for now (no memory at all, not even live. Only the front remembers).
- Getting rid of old samples (>10min) might be not very efficient. The previous way of doing was buggy if for some reason we had more than 1 sample falling at the same time outside of the window
- Adding a fake data generator for 2 reasons: test my UI easily + demonstrate the full capability easily. Adding a button on the Front to "simulate". This is not unit tested at all

### `2022-05-19`

- Did not insist on UI testing (with testing library or through snapshot)
- Did not test: some helpers, edge cases (like API responses and type of data in properties)
- selectors in the `alertingRules` files don't work the same as the selector in the official redux selectors to be connected to hooks

### `2022-05-18`

- VSCode has Jest tests debug integrated.. no need for a plugin
- Isolated "business rules" out of the reducer to make the extraReducer cleaner, and have the 10min/2min rules in a single file
- Redux under-utilized, but still provide a nice separation of concern for testing. Also easily extendable.

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

