document.addEventListener('DOMContentLoaded', function() {

  // Use buttons to toggle between views
  document.querySelector('#inbox').addEventListener('click', () => load_mailbox('inbox'));
  document.querySelector('#sent').addEventListener('click', () => load_mailbox('sent'));
  document.querySelector('#archived').addEventListener('click', () => load_mailbox('archive'));
  document.querySelector('#compose').addEventListener('click', compose_email);
  
  //To post user's email
  document.querySelector('#compose-form').addEventListener('submit', send_email);

  // By default, load the inbox
  load_mailbox('inbox');
});

function compose_email(sender, subject, timestamp, body) {

  // Show compose view and hide other views
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'block';

  // Clear out composition fields
  if (sender){
    document.querySelector('#compose-recipients').value = sender;
    if (subject.startsWith("Re: "))
    {
      document.querySelector('#compose-subject').value = `${subject}`;
    }
    else{
    document.querySelector('#compose-subject').value = `Re: ${subject}`;
    }
    document.querySelector('#compose-body').value = `On ${timestamp} ${sender} wrote: ${body}`;
  }
  else{
  document.querySelector('#compose-recipients').value = '';
  document.querySelector('#compose-subject').value = '';
  document.querySelector('#compose-body').value = '';
  }
}

function load_mailbox(mailbox) {
  
  // Show the mailbox and hide other views
  document.querySelector('#emails-view').style.display = 'block';
  document.querySelector('#compose-view').style.display = 'none';

  // Show the mailbox name
  document.querySelector('#emails-view').innerHTML = `<h3>${mailbox.charAt(0).toUpperCase() + mailbox.slice(1)}</h3>`;
  fetch(`/emails/${mailbox}`)
  .then(response => response.json())
  .then(emails => {
      // Print emails
      console.log(emails);

      // ... do something else with emails ...
      for(i = 0; i < emails.length; i++){
        let email = emails[i];
        let email_id = email.id;
        let sender = email.sender;
        let recipient = email.recipients;
        let subject = email.subject;
        let body = email.body;
        let timestamp = email.timestamp;
        let read = email.read;
        let archived = email.archived;
        if (read === true){
          background_color = "#D3D3D3";
        }
        else{
          background_color = "white";
        }

        const element = document.createElement('div');
        element.innerHTML = `<div style = "background : ${background_color}" ,class="card mb-3" ><div class = "clickable">
        <div class="card-body">
          <h5 class="card-title" id = "email-view-sender">${sender}</h5>
          <p class="card-text", id = "email-view-body">${body}</p>
          <p class="card-text" style = "margin-left : 85%"><small class="text-muted" id = "email-view-timestamp">${timestamp}</small></p>
        </div>
        </div>
      </div>`;     
        element.addEventListener('click', function() {
        console.log('This element has been clicked!');
        open_email(email_id)
        });
        document.querySelector('#emails-view').append(element);      
      }
});
}

function send_email(event) {
  event.preventDefault();
  console.log("HI I am send_email function and i am working fine");
  recipients = document.querySelector("#compose-recipients").value;
  subject = document.querySelector("#compose-subject").value;
  body = document.querySelector("#compose-body").value;
  fetch('/emails', {
    method: 'POST',
    body: JSON.stringify({
        recipients: recipients,
        subject: subject,
        body: body
    })
  })
  .then(response => response.json())
  .then(result => {
      // Print result
      console.log(result);
      load_mailbox("sent");
  })
   // Catch any errors and log them to the console
   .catch(error => {
    console.log('Error:', error);
});
  

  return false;
}
/*
<div class="card mb-3">
            <div class="card-body">
              <h5 class="card-title" id = "email-view-sender"></h5>
              <p class="card-text", id = "email-view-body"></p>
              <p class="card-text" ><small class="text-muted" id = "email-view-timestamp"></small></p>
            </div>
          </div>
*/

function open_email(email_id){
  fetch(`/emails/${email_id}`)
.then(response => response.json())
.then(email => {
    // Print email
    console.log(email);
    let email_id = email.id;
    let sender = email.sender;
    let recipient = email.recipients;
    let subject = email.subject;
    let body = email.body;
    let timestamp = email.timestamp;
    let read = email.read;
    let archived = email.archived;

        if (read === false)
        {
          fetch(`emails/${email_id}`, {
            method: 'PUT',
            body: JSON.stringify({
                read: true
            })
          })
        }
        let userDataElement = document.getElementById('user-data');
        let userEmail = userDataElement.dataset.email;

        if (archived === true)
        {
          var arch = "Unarchive"
        }
        else{
          arch = "Archive"
        }

        if (sender === userEmail)
        {
          btntoadd = "";
        }
        else{
          
          btntoadd = ` <a id = "archbtn", style="width:90%; 
          max-width: 150px; min-width : 130px;
          position: absolute; margin-left : 30%;" class="btn btn-primary p-3 fw-700" href = "">${arch}</a>`;
        }

        btntoadd = `<button id = "archbtn" style = "margin: 10px" type="button" class="btn btn-primary">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-archive" viewBox="0 0 16 16">
        <path d="M0 2a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1v7.5a2.5 2.5 0 0 1-2.5 2.5h-9A2.5 2.5 0 0 1 1 12.5V5a1 1 0 0 1-1-1V2zm2 3v7.5A1.5 1.5 0 0 0 3.5 14h9a1.5 1.5 0 0 0 1.5-1.5V5H2zm13-3H1v2h14V2zM5 7.5a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5z"/>
        </svg>
        ${arch}
        </button>`;


        let Reply_button = `<button id = "rplbtn" style = "margin: 10px" type="button" class="btn btn-success">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-reply" viewBox="0 0 16 16">
                <path d="M6.598 5.013a.144.144 0 0 1 .202.134V6.3a.5.5 0 0 0 .5.5c.667 0 2.013.005 3.3.822.984.624 1.99 1.76 2.595 3.876-1.02-.983-2.185-1.516-3.205-1.799a8.74 8.74 0 0 0-1.921-.306 7.404 7.404 0 0 0-.798.008h-.013l-.005.001h-.001L7.3 9.9l-.05-.498a.5.5 0 0 0-.45.498v1.153c0 .108-.11.176-.202.134L2.614 8.254a.503.503 0 0 0-.042-.028.147.147 0 0 1 0-.252.499.499 0 0 0 .042-.028l3.984-2.933zM7.8 10.386c.068 0 .143.003.223.006.434.02 1.034.086 1.7.271 1.326.368 2.896 1.202 3.94 3.08a.5.5 0 0 0 .933-.305c-.464-3.71-1.886-5.662-3.46-6.66-1.245-.79-2.527-.942-3.336-.971v-.66a1.144 1.144 0 0 0-1.767-.96l-3.994 2.94a1.147 1.147 0 0 0 0 1.946l3.994 2.94a1.144 1.144 0 0 0 1.767-.96v-.667z"/>
                </svg>
                Reply
              </button>`;

        


    // ... do something else with email ...
    const element = document.createElement('div');
        element.innerHTML = `<div style="font-family: 'Roboto', sans-serif;" class="bg-red-100">
        <div class="container">
          
          <div class="card rounded-3xl px-4 py-8 p-lg-10 mb-6">
            <h3 class="text-center">Email</h3>
            <table class="p-2 w-full">
              <tbody>
                <tr>
                  <td class="font-weight-bold">From:</td>
                  <td class="text-right" >${sender}</td>
                </tr>
                <tr>
                  <td class="font-weight-bold">To:</td>
                  <td class="text-right">${recipient}</td>
                </tr>
                <tr>
                  <td class="font-weight-bold">Subject:</td>
                  <td class="text-right">${subject}</td>
                </tr>
                <tr>
                <td class="font-weight-bold">Timestamp:</td>
                <td class="text-right">${timestamp}</td>
              </tr>
              </tbody>
            </table>
            <hr class="my-6">
            <p>${body}</p>
          </div>
          ${btntoadd}
          ${Reply_button}
        </div>
      </div>`;
      document.querySelector('#emails-view').innerHTML = '';
      document.querySelector('#emails-view').append(element); 

      document.querySelector("#archbtn").addEventListener("click", function() {
        console.log('This element has been clicked!');
        archiveftn(email_id, arch)
        });

      document.querySelector("#rplbtn").addEventListener("click", function() {
          console.log('This element has been clicked!');
          rplftn(sender, subject, timestamp, body)
          });
});
}

function archiveftn(email_id, arch){
  if (arch === "Archive"){
    arch = true;
  }
  else{
    arch = false;
  }
  fetch(`/emails/${email_id}`, {
    method: 'PUT',
    body: JSON.stringify({
        archived: arch
    })
  })
  .then(response => {
    if (response.ok) {
      load_mailbox("inbox"); // Reload mailbox after the fetch request is complete
    }
  });
}

function rplftn(sender, subject, timestamp, body){
  compose_email(sender, subject, timestamp, body);
}