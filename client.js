const apiUrl = "http://localhost:3000/";
let currentUser = null;
const localStorageKeys = {
  user: "user",
};
const elements = {
  loginFormContainer: undefined,
  welcomePageContainer: undefined,
  loadingPageContainer: undefined,
  loginButton: undefined,
  logoutButton: undefined,
  sendMessageButton: undefined,
  chatContainer: undefined,
  messagesContainer: undefined,
  textArea: undefined,
};

function getCurrentTime() {
  const now = new Date();
  const current = now.getHours() + ":" + now.getMinutes();
  return current;
}

async function readingMessagesFromServer() {
  console.log(currentUser);
  if (!currentUser || !currentUser.id) {
    return;
  }

  console.log("Reading messages from server");

  const response = await fetch(apiUrl + "messages", {
    method: "GET",
    headers: {
      authorization: currentUser.id,
    },
  });
  if (response.status !== 200) {
    return;
  }

  const messages = await response.json();

  const existingMessagesElements = document.querySelectorAll(".groupMessages");

  // const user = await response();

  if (existingMessagesElements) {
    for (let i = 0; i < existingMessagesElements.length; i++) {
      console.log("remove", i, existingMessagesElements.length);
      existingMessagesElements[i].remove();
    }
  }

  for (let i = 0; i < messages.length; i++) {
    const messageDiv = document.createElement("div");
    messageDiv.classList.add("groupMessages");
    messageDiv.innerHTML =
      "at " +
      messages[i].timestamp +
      "  " +
      messages[i].authorName +
      " said : " +
      messages[i].content;
    elements.messagesContainer.append(messageDiv);
  }
}

// function checkConiditons(firstSring, SecondString){

// }

function showWelcomePageContainer() {
  console.log("showWelcomePageContainer");
  elements.loginFormContainer.classList.add("hidden");
  elements.loadingPageContainer.classList.add("hidden");
  elements.welcomePageContainer.classList.remove("hidden");

  const greetingsDiv = document.getElementById("resultPragraph");
  greetingsDiv.innerHTML =
    currentUser.firstName +
    " " +
    currentUser.lastName +
    " was signed in succesfully!";

  elements.chatContainer.classList.remove("hidden");
  elements.messagesContainer.classList.remove("hidden");
  readingMessagesFromServer();
}

function showLoginFormContainer() {
  console.log("showLoginFormContainer");
  // hidden welcomePageContainer and loadingPageContainer
  elements.loadingPageContainer.classList.add("hidden");
  elements.welcomePageContainer.classList.add("hidden");
  elements.loginFormContainer.classList.remove("hidden");
  elements.chatContainer.classList.add("hidden");
  elements.messagesContainer.classList.add("hidden");
}

function showTheChat() {
  console.log("showTheChat");
  elements.loadingPageContainer.classList.add("hidden");
  elements.loginFormContainer.classList.add("hidden");
  elements.messagesContainer.classList.remove("hidden");
}
window.addEventListener("DOMContentLoaded", async () => {
  console.log("DOMContentLoaded");
  elements.loginButton = document.getElementById("loginButton");
  elements.logoutButton = document.getElementById("logoutButton");
  elements.sendMessageButton = document.getElementById("sendMessageButton");
  elements.chatContainer = document.getElementById("chatContainer");
  elements.loginFormContainer = document.getElementById("loginFormContainer");
  elements.welcomePageContainer = document.getElementById(
    "welcomePageContainer"
  );
  elements.loadingPageContainer = document.getElementById(
    "loadingPageContainer"
  );
  elements.messagesContainer = document.getElementById("messagesContainer");
  elements.textArea = document.getElementById("message");

  const storedUserString = localStorage.getItem(localStorageKeys.user);
  if (storedUserString) {
    const storedUser = JSON.parse(storedUserString);
    if (storedUser && storedUser.id) {
      const params = new URLSearchParams({
        id: storedUser.id,
      });

      const response = await fetch(apiUrl + "user" + "?" + params);
      if (response.status === 200) {
        const user = await response.json();

        if (user && user.id) {
          currentUser = user;
        }
      }
    }
  }
  if (currentUser && currentUser.id) {
    // call API to get user information
    showWelcomePageContainer();
  } else {
    currentUser = null;
    showLoginFormContainer();
  }

  elements.loginButton.addEventListener("click", async () => {
    console.log("loginButton clicked");

    const first = document.getElementById("Fname");
    const second = document.getElementById("Lname");

    const firstName = first.value;
    const secondName = second.value;

    const data = {
      firstName,
      lastName: secondName,
    };
    // tu dobimo da se v en obkejt shrai kaj mi damo v First name in pa second name
    function checkConiditons() {}

    // function checkConiditons(first, secondName) {
    if (!data.firstName || !data.lastName) {
      const lackOfInfo = document.getElementById("lackOfInformation");
      lackOfInfo.innerHTML = "Fill in both fields please!";
      return;
    }
    // }

    // nato pa postamo ta objekt na naš server

    const response = await fetch(apiUrl + "user", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    const user = await response.json();
    if (user && user.id) {
      currentUser = user;
      window.localStorage.setItem(
        localStorageKeys.user,
        JSON.stringify(currentUser)
      );
      showWelcomePageContainer();
      const lackOfInfo = document.getElementById("lackOfInformation");
      lackOfInfo.innerHTML = "";
    }
  });

  elements.logoutButton.addEventListener("click", async () => {
    console.log("logoutButton clicked");

    const params = new URLSearchParams({
      id: currentUser.id,
    });

    await fetch(apiUrl + "user" + "?" + params, {
      method: "DELETE",
    })
      .then((x) => x.text())
      .then((response) => console.log(response));
    currentUser = null;
    window.localStorage.removeItem(localStorageKeys.user);

    // await fetch(apiUrl + "messages", {
    //   method: "DELETE",
    // });
    // .then((x) => x.text())
    // .then((response) => console.log(response));

    showLoginFormContainer();
  });

  elements.sendMessageButton.addEventListener("click", async () => {
    console.log("send message was clicked");
    const authorId = currentUser.id;
    const authorName = currentUser.firstName + " " + currentUser.lastName;
    const timestamp = getCurrentTime();
    const contentEl = document.getElementById("message");
    const content = contentEl.value;

    if (!content) {
      return;
    }

    const messageToServer = {
      authorId,
      authorName,
      timestamp,
      content,
    };

    console.log(messageToServer);
    const messagePosted = await fetch(apiUrl + "messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: authorId,
        // authorId,L?
      },
      body: JSON.stringify(messageToServer),
    });

    elements.textArea.value = "";
    readingMessagesFromServer();
    showTheChat();
  });

  console.log("beforeReadingMessages");
  console.log(currentUser);

  setInterval(() => {
    readingMessagesFromServer();
  }, 5000);
});

// ce ti vnre promise rabis se en thn drugace pa ne pri awaitu
