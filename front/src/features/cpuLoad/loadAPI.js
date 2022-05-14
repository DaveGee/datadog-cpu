
const apiUrl = 'http://localhost:8080'

export function fetchLoadMetric() {
  const options = {
    method: 'GET',
    headers: new Headers({ 
      'Content-Type': 'application/json',
    })
  }

  return fetch(apiUrl + '/load', options)
    .then(res => res.json())
}