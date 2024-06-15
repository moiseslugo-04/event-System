// <== Api History ==>

// Main methods
/**
 * history.pushState(state,title,url) => add a new state
 * history.replaceState(state,title,url) => modify the current state
 * history.back() => Navigate back
 * history.forward() => Navigate forward
 * history.go(n) => navigate based on parameter n
 */

//Properties
/**
 * history.length => return The number of entries
 * history.state => return the current state
 */

//Events
/**
 * popstate => is executed when the current state changes
 */

//Example

//add a new entry
//history.pushState({ page: 1 }, 'title 1', '?page=1')

// modify  current entry
//history.replaceState({ page: 2 }, 'title 2', '?page=2')

//handle event popstate
window.addEventListener('popstate', ({ state }) => {
  console.log(window.location.href, state)
})
// moving between histories
/*
history.back()
history.forward()
history.go(1)*/

// <== Api Notification ==>

// Permission
/**
 * Request permission from user with Notification.requestPermission()
 * The promise is resolved with ,granted,denied,default
 */

//create Notification
/**
 * to use constructor new Notification(title,object)
 * tile => notification title
 * object => icon,body,vibrate,etc
 */
//Events
/**
 * click => when  clicked
 * close => when it is  closed
 * error => when a error is happening
 * show => when the notification is displayed
 */

async function allowNotification() {
  const permission = await Notification.requestPermission()
  if (permission === 'granted') {
    const notification = new Notification('hello', {
      body: 'this is a body',
      icon: 'icon.png',
    })
    notification.addEventListener('close', () => console.log('closed'))
    notification.addEventListener('click', () => console.log('click'))
  }
}
allowNotification()
