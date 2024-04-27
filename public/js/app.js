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
    document.getElementById("btn-login").disabled = isAuthenticated;
    document.getElementById("btn-call-api").disabled = !isAuthenticated;

    if (isAuthenticated) {
        document.getElementById("gated-content").classList.remove("hidden");

        document.getElementById(
            "ipt-access-token"
        ).innerHTML = await auth0Client.getTokenSilently();

        document.getElementById(
            "ipt-user-profile"
        ).textContent = JSON.stringify(await auth0Client.getUser());
    } else {
        document.getElementById("gated-content").classList.add("hidden");
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