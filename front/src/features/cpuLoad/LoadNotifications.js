import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { HIGH_LOAD_EVENT_TYPE, RECOVERY_EVENT_TYPE } from './alertingRules'
import { selectNewEvents, silence } from './loadSlice'

const strings = {
  [HIGH_LOAD_EVENT_TYPE]: {
    body: 'A high CPU load has been happening for 2 minutes',
    title: 'High CPU load detected'
  },
  [RECOVERY_EVENT_TYPE]: {
    body: 'The CPU recovered from heavy work',
    title: 'CPU Recovered (great success!)'
  }
}

const LoadNotifications = () => {
  
  useEffect(() => {
    if ('Notification' in window) {
      Notification.requestPermission()
    }
  })
  
  const newEvents = useSelector(selectNewEvents)
  const dispatch = useDispatch()

  useEffect(() => {

    if (!newEvents)
      return 

    newEvents.forEach(event => {
      const options = {
        body: strings[event.type].body,
      }
      new Notification(strings[event.type].title, options)

      dispatch(silence(event))
    })

  }, [newEvents, dispatch])

  return null
}

export default LoadNotifications