# Datadog CPU monitoring

This web app retrieves the normalized CPU load, and displays a 10min history of it. It also sends alerts when it detects high loads, or recoveries from high loads. This was done in the context of the hiring process at Datadog

- [Original task instructions](instructions.md)
- [Work logs](logs.md): notes and details about some topic, task list

## How to run the app

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

(To change the URL of the backend, edit the `config.js` file in the  `front` folder, or set the env var `REACT_APP_BASE_URL`)

## User guide

- Launch the backend + frontend as state above
- If the browser asks you to activate notification, it's because it wants to gently alert you about your CPU, even if you're not looking at the tab. Please activate them for a better experience (I promise I don't send spam)
- At first load, as the backend doesn't remember anything, your charts might look empty. If you want to speed up because you have other tests to review, you can use the "SIMULATE LOAD" button on the right to "inject some simulated data".
    - It's also helpful if you have a Mac M1 and all your CPUs never go above 1 in terms of load...

- The **High load alerts** indicator is the number of times the threshold was hit (2 minutes above 1.0) since the frontend started
    - They show as small "triangles" in the charts

- The **Recoveries** indicator is the number of times the CPU went back below 1.0 for more than 2 minutes, given a previous alert.
    - They show as "white circles" in the charts

- The **Events timeline** at the bottom gives you a timeline view of all the alerts (high load and recoveries) detected. They can span beyond the 10 minutes window of the load history

- Note: tested only on Chrome and Safari (MacOS)

## Note to reviewer

Due to the nature of the work (PoC in a hiring process), the focus was on:
1. Delivering something that works
2. Clean code
3. Testing the core part (alerting and load history) as much as possible (TDD)
4. Making it look nice visually (chose a very minimalistic style)
5. Making sure instructions where fulfilled at the very least

This app is not ready for production. To get there, the following points need some attention

- **Error handling**. Especially if there is a communication problem with the backend. Currently, no error message is shown in the UI. Meaning the only symptom is a non-dynamic UI.
- Tested only on Chrome and Safari. Needs more tests.
- **Could use more unit tests**, outsides the ones linked to the alerting mechanism (`cpuLoad.test.js`).
    - Few React components are tested (either through snapshots or through other means)
    - Not all paths are covered. Tests focus was on positive paths mostly.
- **Maybe add types** (through Typescript or Flow) to add robustness by ensuring domain entities are type-checked
- **Backend has no tests**, and is only here to support the frontend in terms of feature.
- **Remove the simulation feature** and code (button that generates fake data) or add a feature flag around it
- Better **internationalization** (formatting, units, etc.).
- **Responsiveness and adaptability**. No mobile version. Should work well on normal computer screens when resizing only.
- For the current usage, the way `history` and `events` are stored is fine. However for production, there is probably some optimization possible in terms of performance as a lot of filters or made on those lists. Especially if the feature is extended.