
import { baseUrl } from '../config' 

export function fetchLoadMetric() {
  const options = {
    method: 'GET',
    headers: new Headers({ 
      'Content-Type': 'application/json',
    })
  }

  return fetch(baseUrl + 'load', options)
    .then(res => res.json())
}