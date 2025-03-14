const apiUrl = "https://57b5-86-58-12-206.ngrok-free.app/";

let currentUser = null;

const localStorageKeys = {
  user: "user",
  token: "authToken",
};

const elements = {
  loginFormContainer: undefined,
  registerformContainer: undefined,
  loadingPageContainer: undefined,
  loginButton: undefined,
  logoutButton: undefined,
  sendMessageButton: undefined,
  chatContainer: undefined,
  messagesContainer: undefined,
  textArea: undefined,
  lackOfInfoRegistration: undefined,
  registerButton: undefined,
  chatDiv: undefined,
  welcomeMessageLogin: undefined,
  navbar: undefined,
  allUsersBtn: undefined,
  allUsersDiv: undefined,
  navElement: undefined,
  chatLink: undefined,
  MyProfileButton: undefined,
  MyProfileDiv: undefined,
  userProfileForm: undefined,
};

function getCurrentTime() {
  const now = new Date();
  const current = now.getHours() + ":" + now.getMinutes();
  return current;
}

async function readingMessagesFromServer() {
  if (!currentUser || !currentUser._id) {
    console.log("test2 messaeges 0.3");

    return;
  }

  console.log("Reading messages from server");
  const token = localStorage
    .getItem(localStorageKeys.token)
    .trim()
    .replace(/^"|"$/g, "");

  const response = await fetch(apiUrl + "messages", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      "ngrok-skip-browser-warning": "skip-browser-warning",
    },
  });

  if (response.status !== 200) {
    return;
  }

  const messages = await response.json();

  const messagesContainer = document.getElementById("messagesContainer");
  messagesContainer.innerHTML = "";
  messages.forEach((message) => {
    const messageDiv = document.createElement("div");
    messageDiv.classList.add(
      "groupMessages",
      "border",
      "p-2",
      "mb-3",
      "rounded"
    );

    //Preverjanje cigavo je sporocilo
    if (message.authorId === currentUser._id) {
      messageDiv.classList.add("sent-message");
    } else {
      messageDiv.classList.add("received-message");
    }

    messageDiv.innerHTML = `
      <p><strong>${message.authorName}</strong> at ${message.timestamp} said:</p>
      <p>${message.content}</p>
    `;

    messagesContainer.appendChild(messageDiv);
  });
}
function showAllUsers() {
  console.log("ShowAllUsers called");
  elements.chatDiv.classList.add("hidden");
  elements.allUsersDiv.classList.remove("hidden");
}
function showWelcomePageContainer() {
  console.log("showWelcomePageContainer");
  console.log("Chat container:", elements.chatContainer);
  console.log("Messages container:", elements.messagesContainer);
  elements.navbar.classList.remove("hidden");
  elements.loginFormContainer.classList.add("hidden");
  elements.registerformContainer.classList.add("hidden");
  elements.chatContainer.classList.remove("hidden");
  elements.messagesContainer.classList.remove("hidden");
  console.log(
    "Classes on chatContainer after removal:",
    elements.chatContainer.classList
  );
  if (currentUser.role == "admin") {
    elements.allUsersBtn.classList.remove("hidden");
  } else {
    elements.allUsersBtn.classList.add("hidden");
  }
  readingMessagesFromServer();
}

function showLoginFormContainer() {
  console.log("showLoginFormContainer");
  elements.loginFormContainer.classList.remove("hidden");
  elements.chatContainer.classList.add("hidden");
  elements.messagesContainer.classList.add("hidden");
  elements.chatDiv.classList.add("hidden");
}

function showTheChat() {
  console.log("showTheChat");
  // elementsnavElement.classList.remove("hidden");
  elements.loginFormContainer.classList.add("hidden");
  elements.messagesContainer.classList.remove("hidden");
}

//Ko se nalozijo elementi se pogleda ce je user ze prijavljen
window.addEventListener("DOMContentLoaded", async () => {
  console.log("DOMContentLoaded");
  elements.MyProfileButton = document.getElementById("myProfileButton");
  elements.MyProfileDiv = document.getElementById("MyProfile");
  elements.userInfo = document.getElementById("userList");
  elements.loginButton = document.getElementById("loginButton");
  elements.navbar = document.getElementById("navbar");
  elements.welcomeMessageLogin = document.getElementById("welcomeMessageLogIn");
  elements.logoutButton = document.getElementById("logoutButton");
  elements.sendMessageButton = document.getElementById("sendMessageButton");
  elements.allUsersBtn = document.getElementById("viewUsersTab");
  elements.allUsersDiv = document.getElementById("allUsers");
  elements.navElement = document.getElementById("hiddenNav");
  elements.userProfileForm = document.getElementById("userProfileForm");
  elements.chatLink = document.getElementById("showChatLink");
  //ustvarjanje sporocil
  elements.chatContainer = document.getElementById("chatContainer");
  elements.registerButton = document.getElementById("registerButton");
  elements.loginFormContainer = document.getElementById("loginFormContainer");
  elements.lackOfInfoRegistration =
    document.getElementById("lackOfInformationR");

  elements.loadingPageContainer = document.getElementById(
    "loadingPageContainer"
  );
  // prikaz sporocil
  elements.messagesContainer = document.getElementById("messagesContainer");
  elements.textArea = document.getElementById("message");
  elements.chatDiv = document.getElementById("chatContainer");
  elements.registerformContainer = document.getElementById(
    "registerFormContainer"
  );

  document
    .getElementById("userProfileForm")
    .addEventListener("submit", async function (event) {
      event.preventDefault();
      console.log("Form submitted without refresh!");

      const userProfileData = {
        firstName: document.getElementById("profileFname").value,
        lastName: document.getElementById("profileLname").value,
        email: document.getElementById("profileEmail").value,
        password: document.getElementById("profilePassword").value,
        phone: document.getElementById("profilePhone").value,
        gender: document.getElementById("profileGender").value,
      };
      const userId = currentUser._id;
      const token = localStorage
        .getItem(localStorageKeys.token)
        .trim()
        .replace(/^"|"$/g, "");
      try {
        const response = await fetch(
          ` https://192.168.1.10:443/userInfo/${userId}`,

          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(userProfileData),
          }
        );

        if (!response.ok) {
          throw new Error("Failed to update profile");
        }

        const result = await response.json();
        console.log("Profile updated successfully:", result);

        // Lahko dodaš obvestilo za uporabnika (npr. alert)
        alert("Profile updated successfully!");
      } catch (error) {
        console.error("Error updating profile:", error);
        alert("Error updating profile. Please try again.");
      }
    });

  const storedUserString = localStorage.getItem(localStorageKeys.user);
  const token = localStorage.getItem(localStorageKeys.token);
  if (storedUserString && token) {
    const storedUser = JSON.parse(storedUserString);

    const response = await fetch(apiUrl + "verifyToken", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "ngrok-skip-browser-warning": "skip-browser-warning",
      },
    });
    if (response.status === 200) {
      console.log("Token je veljaven");
      currentUser = storedUser;
      showWelcomePageContainer();
    } else {
      console.log("Token ni veljaven");
      currentUser = null;
      window.localStorage.removeItem(localStorageKeys.user);
      window.localStorage.removeItem(localStorageKeys.token);
      showLoginFormContainer();
    }
  } else {
    currentUser = null;
    showLoginFormContainer();
  }

  document
    .getElementById("registerLink")
    .addEventListener("click", function (event) {
      event.preventDefault();

      document.getElementById("loginFormContainer").classList.add("hidden");

      document
        .getElementById("registerFormContainer")
        .classList.remove("hidden");
    });

  document
    .getElementById("loginLink")
    .addEventListener("click", function (event) {
      event.preventDefault();

      document.getElementById("loginFormContainer").classList.remove("hidden");

      document.getElementById("registerFormContainer").classList.add("hidden");
    });

  //Preusmeritev na chat
  elements.chatLink.addEventListener("click", async () => {
    showWelcomePageContainer();
    elements.allUsersDiv.classList.add("hidden");
  });
  //Pridobivanje vseh uporabnikov
  elements.allUsersBtn.addEventListener("click", async () => {
    const token = localStorage
      .getItem(localStorageKeys.token)
      .trim()
      .replace(/^"|"$/g, "");
    console.log("AllUsers was clicked, shranjeni token : " + token);
    const usersList = await fetch(apiUrl + "allUsers", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        "ngrok-skip-browser-warning": "skip-browser-warning",
      },
    });

    const clonedResponse = await usersList.clone().json();
    console.log("JSON Response:", clonedResponse);
    if (clonedResponse.success === true) {
      const users = clonedResponse.users;
      const userListElement = document.getElementById("userList");
      userListElement.innerHTML = "";

      if (Array.isArray(users)) {
        users.forEach((user) => {
          const userItem = document.createElement("li");
          userItem.classList.add("list-group-item");
          userItem.textContent = `${user.firstName} ${user.lastName} (${user.email})`;

          const deleteButton = document.createElement("button");
          deleteButton.textContent = "Delete";
          deleteButton.classList.add("delete-btn-user");
          deleteButton.addEventListener("click", async function () {
            const token = localStorage
              .getItem(localStorageKeys.token)
              .trim()
              .replace(/^"|"$/g, "");
            userItem.remove();

            try {
              const response = await fetch(
                `${apiUrl}usersDelete/${user.uuid}`,
                {
                  method: "DELETE",
                  headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                  },
                }
              );

              if (response.ok) {
                console.log(`User with ID ${user.uuid} deleted successfully.`);
                userItem.remove();
              } else {
                const errorData = await response.json();
                console.error(
                  "Napaka pri brisanju uporabnika:",
                  errorData.message
                );
                alert("Brisanje ni uspelo: " + errorData.message);
              }
            } catch (error) {
              console.error("Napaka pri povezavi z API-jem:", error);
              alert("Napaka pri povezavi z API-jem.");
            }
          });

          userListElement.appendChild(userItem);
          userItem.appendChild(deleteButton);
        });
        document.getElementById("allUsers").classList.remove("hidden");
        showAllUsers();
      } else {
        console.error("Users ni array:", users);
      }
    } else {
      console.error("Napaka pri pridobivanju uporabnikov:", usersList.status);
    }
  });

  //My profile button
  elements.MyProfileButton.addEventListener("click", async () => {
    console.log("TRENUTNI UPORABNIK" + currentUser._id);
    const token = localStorage
      .getItem(localStorageKeys.token)
      .trim()
      .replace(/^"|"$/g, "");
    const response = await fetch(apiUrl + "userInfo", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        "ngrok-skip-browser-warning": "skip-browser-warning",
      },
    });
    const responseData = await response.json();
    console.log(responseData.user);
    if (responseData.success == true) {
      console.log("Moj profil najden");
      console.log(responseData.user);

      document.getElementById("MyProfile").classList.remove("hidden");
      const fnameInput = document.getElementById("profileFname");
      const lnameInput = document.getElementById("profileLname");
      const emailInput = document.getElementById("profileEmail");
      const phoneInput = document.getElementById("profilePhone");
      const passwordInput = document.getElementById("profilePassword");
      const genderInput = document.getElementById("profileGender");

      fnameInput.value = responseData.user.firstName;
      lnameInput.value = responseData.user.lastName;
      emailInput.value = responseData.user.email;
      phoneInput.value = responseData.user.phoneNumber;

      genderInput.value = responseData.user.gender;

      elements.chatContainer.classList.add("hidden");
      elements.chatContainer.classList.add("hidden");
    } else if (responseData.status == 404) {
      console.log("Napaka 404 pri iskanju profila");
    } else {
      console.log("unathorized?");
    }
  });

  //pošiljanje sporočil delujoče
  //to je sedaj uredu
  elements.sendMessageButton.addEventListener("click", async () => {
    console.log("send message was clicked");

    const currentUserStrinigiy = JSON.stringify(currentUser);
    console.log("send message was clicked user" + currentUserStrinigiy);
    const authorId = currentUser._id;
    const authorEmail = currentUser.email;
    const authorName = currentUser.firstName + " " + currentUser.lastName;
    const timestamp = getCurrentTime();
    const contentEl = document.getElementById("message");
    const content = contentEl.value;
    if (!content) {
      return; // If the content is empty, return and don't send
    }
    const messageToServer = {
      authorId,
      authorEmail,
      authorName,
      timestamp,
      content,
    };

    console.log(messageToServer);
    const token = localStorage
      .getItem(localStorageKeys.token)
      .trim()
      .replace(/^"|"$/g, "");
    console.log("TOKEN" + token);
    console.log("TOKEN 2" + currentUser.token);

    const messagePosted = await fetch(apiUrl + "postMessage", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        "ngrok-skip-browser-warning": "skip-browser-warning",
      },
      body: JSON.stringify(messageToServer),
    });
    if (messagePosted.ok) {
      elements.textArea.value = "";
      readingMessagesFromServer();
      showTheChat();
    } else {
      console.error("Failed to post message.");
    }
  });

  //Log in delujoči
  elements.loginButton.addEventListener("click", async () => {
    console.log("loginButton clicked");
    const email = document.getElementById("email");
    const password = document.getElementById("passwordLogin");
    const emailValue = email.value;
    const psw = password.value;

    const data = {
      emailValue,
      psw,
    };

    if (!data.emailValue || !data.psw) {
      const lackOfInfo = document.getElementById("lackOfInformation");
      lackOfInfo.innerHTML =
        "Fill in all fields (first name, last name, email) please!";
      return;
    }

    const response = await fetch(apiUrl + "userLogin", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        // "ngrok-skip-browser-warning": "skip-browser-warning",
      },
      body: JSON.stringify(data),
    });

    if (response.status == 404) {
      const errorData = await response.text();
      console.error("User doesn't exist:", errorData);
      const lackOfInfo = document.getElementById("lackOfInformation");
      lackOfInfo.innerHTML = "User doesn't exist.";
      return;
    }
    if (response.status == 401) {
      const errorData = await response.text();
      console.error("Incorrect password:", errorData);
      const lackOfInfo = document.getElementById("lackOfInformation");
      lackOfInfo.innerHTML = "Incorrect password.";
      return;
    }
    if (!response.ok) {
      const errorData = await response.text();
      console.error("Error response from server:", errorData);
      const lackOfInfo = document.getElementById("lackOfInformation");
      lackOfInfo.innerHTML = "Something went wrong, please try again later!";
      return;
    }

    const responseTwo = await response.json();
    console.log("user" + responseTwo.user.body);
    console.log("Token" + responseTwo.token);

    if (responseTwo.success == true) {
      currentUser = responseTwo.user;
      attributedToken = responseTwo.token;
      window.localStorage.setItem(
        localStorageKeys.user,
        JSON.stringify(currentUser)
      );
      window.localStorage.setItem(
        localStorageKeys.token,
        JSON.stringify(attributedToken)
      );

      showWelcomePageContainer();
      elements.welcomeMessageLogin.innerHTML = `Welcome back, ${currentUser.firstName} ${currentUser.lastName} !`;
      const lackOfInfo = document.getElementById("lackOfInformation");
      elements.loginFormContainer.classList.add("hidden");
      lackOfInfo.innerHTML = "";
    }
  });

  //registracija delujoča
  elements.registerButton.addEventListener("click", async () => {
    console.log("registerButton clicked");

    const first = document.getElementById("FnameR");
    const second = document.getElementById("LnameR");
    const email = document.getElementById("emailR");
    const password = document.getElementById("passwordReg");
    const rojstniDatum = document.getElementById("dobR");
    const gender = document.getElementById("genderR");

    const firstName = first.value;
    const secondName = second.value;
    const emailValue = email.value;
    const psw = password.value;
    const rojstniDan = rojstniDatum.value;
    const genderValue = gender.value;

    const data = {
      firstName,
      lastName: secondName,
      emailValue,
      psw,
      rojstniDan,
      genderValue,
    };

    if (
      !data.firstName ||
      !data.lastName ||
      !data.emailValue ||
      !data.psw ||
      !data.rojstniDan ||
      !data.genderValue
    ) {
      const lackOfInfo = document.getElementById("lackOfInformationR");
      lackOfInfo.innerHTML =
        "Fill in all fields (first name, last name, email) please!";
      return;
    }

    const response = await fetch(apiUrl + "userRegistracija", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (response.status == 409) {
      const errorData = await response.text();
      console.error("User already exists:", errorData);
      const lackOfInfo = document.getElementById("lackOfInformationR");
      lackOfInfo.innerHTML = "User with this email already exists.";
      return;
    }
    if (!response.ok) {
      const errorData = await response.text();
      console.error("Error response from server:", errorData);
      const lackOfInfo = document.getElementById("lackOfInformationR");
      lackOfInfo.innerHTML = "Something went wrong, please try again later!";
      return;
    }

    console.log("before register");
    const responseSecond = await response.json();
    if (responseSecond.success == true) {
      const lackOfInfo = document.getElementById("lackOfInformation");
      document.getElementById("registerFormContainer").classList.add("hidden");
      lackOfInfo.innerHTML = "";
      showLoginFormContainer();
    }
  });

  //logout delujoči
  elements.logoutButton.addEventListener("click", async () => {
    elements.navbar.classList.add("hidden");
    elements.allUsersDiv.classList.add("hidden");
    console.log("logoutButton clicked");
    const email = document.getElementById("email");
    const password = document.getElementById("passwordLogin");
    email.value = "";
    password.value = "";
    currentUser = null;
    window.localStorage.removeItem(localStorageKeys.user);
    window.localStorage.removeItem(localStorageKeys.token);
    showLoginFormContainer();
  });

  console.log("beforeReadingMessages");
  console.log(currentUser);

  setInterval(() => {
    readingMessagesFromServer();
  }, 5000);
});

// ce ti vnre promise rabis se en thn drugace pa ne pri awaitu
