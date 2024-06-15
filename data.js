export let events = JSON.parse(localStorage.getItem('events')) || []

function notification(msg) {
  if (Notification.permission === 'granted') {
    new Notification('System', { body: msg })
  }
}
export function addEvent(event) {
  events.push(event)
  saveEventToStorage()
  notification('add Event With Successful')
}

export function deleteEvent(eventId) {
  events = events.filter(({ id }) => id !== eventId)
  saveEventToStorage()
  notification('deleted Event With Successful')
}

export function updateEvent(eventId, updateDate) {
  const index = events.findIndex(({ id }) => id === eventId)
  if (index !== -1) {
    console.log(events[index], 1)
    events[index] = { ...events[index], ...updateDate }
    console.log(events[index], 2)
    saveEventToStorage()
    notification('updated Event With Successful')
  }
}
function saveEventToStorage() {
  localStorage.setItem('events', JSON.stringify(events))
}
