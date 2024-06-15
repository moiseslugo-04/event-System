import { events, addEvent, deleteEvent, updateEvent } from './data.js'

window.addEventListener('DOMContentLoaded', () => {
  const links = document.querySelectorAll('nav a')
  const container = document.getElementById('container')

  const buttonActions = {
    delete: handleDeleteEvent,
    update: handleUpdateEvent,
    detail: handleShowDetails,
  }
  const routes = {
    '/': showHome,
    '/register': showRegister,
    '/events': showEvents,
  }
  if (Notification.permission === 'default') permissionNotification()

  links.forEach((link) => link.addEventListener('click', handleNavigation))

  function handleNavigation(e) {
    e.preventDefault()
    links.forEach((link) => link.classList.remove('active'))
    const link = e.target
    link.classList.add('active')
    const url = link.getAttribute('name')
    navigateTo(url)
  }

  function navigateTo(url) {
    history.pushState(null, null, `?=${url}`)
    router(url)
  }

  function router(url) {
    const route = Object.keys(routes).find((route) => {
      const regex = new RegExp(`^${route.replace(/:\w+/g, '\\w+')}$`)
      return regex.test(url)
    })
    if (route) {
      routes[route](url)
    } else {
      console.log('Page not found ')
    }
  }

  function showHome() {
    container.innerHTML = `
      <h1>welcome to event registration system</h1>
      <p>Manage your events easily and efficiently.</p>
      `
  }

  function showRegister() {
    container.innerHTML = `
  <form id='createEvent'> 
      <h2>Welcome to registration system</h2>
      <label>Title
      <input type="text" name="title" placeholder="Title : April Roses" required/>
      </label>
      <label>Description
        <textarea name="description" placeholder="description" required></textarea>
      </label> 
      <label>Date<input type="date" required name="date"/></label>
      <label>Time<input type="time" name="time" required /></label>
      <label>Category
        <select name="category" required>
          <option value="personal">Personal</option>
          <option value="work">Work</option>
          <option value="other">Other</option>
        </select>
      </label>
      <button>Register Event</button>
    </form>`

    document
      .getElementById('createEvent')
      .addEventListener('submit', handleEventRegistration)
  }

  function showEvents() {
    if (events.length <= 0) {
      container.innerHTML = `<h1>There's Not Events Found</h1>`
      return
    }
    container.innerHTML = `
    <div class="events-content">
       <table class="table">
          <thead class='head'>
             <tr>
               <th scope="col">Name</th>
               <th scope="col">Date</th>
               <th scope="col">Time</th>
               <th class='hidden' scope="col">Description</th>
               <th class='hidden' scope="col">Category</th>
           </tr>
         </thead>
         <tbody id='body'></tbody>
        </table>
    </div>`

    const eventTableBody = document.getElementById('body')
    eventTableBody.innerHTML = ''
    events.forEach((event) => eventTableBody.appendChild(createEventRow(event)))

    document
      .querySelectorAll('button')
      .forEach((btn) => btn.addEventListener('click', handleButtonClick))

    function handleButtonClick({ target }) {
      const button = target
      const action = button.getAttribute('name')
      const eventId = button.closest('tr').getAttribute('id')
      if (buttonActions[action]) {
        buttonActions[action](eventId, button)
      }
    }
  }

  function handleEventRegistration(e) {
    e.preventDefault()
    const formData = new FormData(e.target)
    const data = Object.fromEntries(formData.entries())
    data.id = Date.now().toString()
    addEvent(data)
    e.target.reset()
    navigateTo('/events')
  }

  function handleDeleteEvent(eventId) {
    showEvents()
    document.getElementById(eventId).remove()
    deleteEvent(eventId)
  }

  function handleUpdateEvent(eventId, button) {
    const row = button.closest('tr')
    const spans = row.querySelectorAll('span')
    const isUpdating = button.textContent === 'Update'

    if (isUpdating) {
      button.textContent = 'Save'
      spans.forEach((span) => (span.contentEditable = true))
    } else {
      const updateData = {}
      spans.forEach((span) => {
        const name = span.getAttribute('name')
        updateData[name] = span.textContent
      })
      updateEvent(eventId, updateData)
      spans.forEach((span) => (span.contentEditable = false))
      button.textContent = 'Update'
    }
  }

  function handleShowDetails(eventId) {
    const row = document.getElementById(eventId)
    const hiddenElements = row.querySelectorAll('.hidden')
    hiddenElements.forEach((el) => el.classList.toggle('hidden'))
  }

  function createEventRow({ title, description, date, time, category, id }) {
    let tr = document.createElement('tr')
    tr.className = 'event'
    tr.id = id
    tr.innerHTML = `
          <td><span name="title">${title}</span></td>
          <td><span name="date">${date}</span></td>
          <td><span name="time">${time}</span></td>
          <td class='hidden'><span name="description">${description}</span></td>
          <td class='hidden'><span name="category">${category}</span></td>
          <td>
            <div name="buttons" class='buttons'>
              <button class='detail' name='detail' >Details</button>
              <button class='update' name='update'>Update</button>
              <button class='delete' name='delete'>Deleted</button>
            </div> 
          </td>`
    return tr
  }

  async function permissionNotification() {
    const permission = await Notification.requestPermission()
  }

  const urlParams = new URLSearchParams(window.location.search)
  const url = urlParams.get('url') || '/'
  navigateTo(url)
})
