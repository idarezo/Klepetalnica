const apiUrl = "http://localhost:3000/user";
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
};

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
}

function showLoginFormContainer() {
  console.log("showLoginFormContainer");
  // hidden welcomePageContainer and loadingPageContainer
  elements.loadingPageContainer.classList.add("hidden");
  elements.welcomePageContainer.classList.add("hidden");
  elements.loginFormContainer.classList.remove("hidden");
}

window.addEventListener("DOMContentLoaded", async () => {
  console.log("DOMContentLoaded");
  elements.loginButton = document.getElementById("loginButton");
  elements.logoutButton = document.getElementById("logoutButton");
  elements.loginFormContainer = document.getElementById("loginFormContainer");
  elements.welcomePageContainer = document.getElementById(
    "welcomePageContainer"
  );
  elements.loadingPageContainer = document.getElementById(
    "loadingPageContainer"
  );

  const storedUserString = localStorage.getItem(localStorageKeys.user);
  if (storedUserString) {
    const storedUser = JSON.parse(storedUserString);

    // tu pokličeš get api in pridobiš podatke uporabnika in šele če ti API vrne podatke, potem je  uporabnik res prijavljen
    currentUser = storedUser;
  }
  console.log(currentUser);
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

    if (!data.firstName || !data.lastName) {
      const lackOfInfo = document.getElementById("lackOfInformation");
      lackOfInfo.innerHTML = "Fill in both fields please";
      return;
    }

    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    const user = await response.json();
    console.log(user);
    if (user && user.id) {
      currentUser = user;
      window.localStorage.setItem(
        localStorageKeys.user,
        JSON.stringify(currentUser)
      );
      showWelcomePageContainer();
      console.log(window.localStorage.getItem(localStorageKeys.user));
    }
  });

  elements.logoutButton.addEventListener("click", async () => {
    console.log("logoutButton clicked");

    await fetch(apiUrl, {
      method: "DELETE",
    })
      .then((x) => x.text())
      .then((response) => console.log(response));
    currentUser = null;
    window.localStorage.removeItem(localStorageKeys.user);
    showLoginFormContainer();
  });
  // call API to logout user
  // show welcome showLoginFormContainer()

  // const response = await fetch(apiUrl);
  // if (response.status === 200) {
  //   const users = await response.json();
  //   console.log(users);
  //   if (users.length > 0) {
  //     showWelcomePageContainer();
  //     return;
  //   }
  // }
});

// ce ti vnre promise rabis se en thn drugace pa ne pri awaitu
