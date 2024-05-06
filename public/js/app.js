let auth0Client = null;

const fetchAuthConfig = () => fetch("/auth_config.json");

const configureClient = async () => {
    const response = await fetchAuthConfig();
    const config = await response.json();
  
    auth0Client = await auth0.createAuth0Client({
      domain: config.domain,
      clientId: config.clientId,
      authorizationParams: {
        audience: config.audience
      }
    });
  };

window.onload = async () => {
    await configureClient();
    updateUI();

    const isAuthenticated = await auth0Client.isAuthenticated();

    if (isAuthenticated) {
        return;
    }

    const query = window.location.search;
    if (query.includes("code=") && query.includes("state=")) {
        await auth0Client.handleRedirectCallback();

        updateUI();

        window.history.replaceState({}, document.title, "/");
    }
};

const updateUI = async () => {
    const isAuthenticated = await auth0Client.isAuthenticated();
    document.getElementById("btn-logout").disabled = !isAuthenticated;
    document.getElementById("btn-call-api").disabled = !isAuthenticated;

    if (isAuthenticated) {
        document.getElementById("gated-content").classList.remove("hidden");

        document.getElementById(
            "ipt-access-token"
        ).innerHTML = await auth0Client.getTokenSilently();

        const userData = JSON.stringify(await auth0Client.getUser());
        console.log(JSON.parse(userData).picture);

        document.getElementById("cardAvatar").src = JSON.parse(userData).picture;

        document.getElementById(
            "ipt-user-profile"
        ).textContent = userData;

        document.getElementById("btn-nav-login").removeEventListener("click", login);
        document.getElementById("btn-nav-login").addEventListener("click", logout);
        document.getElementById("btn-nav-login").textContent = 'Logout';
    } else {
        document.getElementById("gated-content").classList.add("hidden");

        document.getElementById("btn-nav-login").removeEventListener("click", logout);
        document.getElementById("btn-nav-login").addEventListener("click", login);
        document.getElementById("btn-nav-login").textContent = 'Login';
    }
};

const login = async () => {
    await auth0Client.loginWithRedirect({
        authorizationParams: {
            redirect_uri: window.location.origin
        }
    });
};

const logout = () => {
    auth0Client.logout({
        logoutParams: {
            returnTo: window.location.origin
        }
    });
};


const callApi = async () => {
    try {
      const token = await auth0Client.getTokenSilently();
  
      const response = await fetch("/api/external", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      const responseData = await response.json();
  
      const responseElement = document.getElementById("api-call-result");
  
      responseElement.innerText = JSON.stringify(responseData, {}, 2);
  
  } catch (e) {
      console.error(e);
    }
  };


document.getElementById('SightingForm').addEventListener('submit', async (event) => {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const token = await auth0Client.getTokenSilently();

    const location = formData.get('location');
    console.log("🚀 ~ document.getElementById ~ location:", location);
    const description = formData.get('description');
    console.log("🚀 ~ document.getElementById ~ description:", description);
    const sightingTime = formData.get('sightingTime');
    console.log("🚀 ~ document.getElementById ~ sightingTime:", sightingTime);
    const image = formData.get('image');
    console.log("🚀 ~ document.getElementById ~ image:", image);

    fetch('/upload', {
        method : 'POST',
        body: formData,
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
    .then(response => response.json())
    .then(data => {
        console.log('Success : ', data);
    })
    .catch((error) => {
         console.error('Error : ', error);
     });
    
});