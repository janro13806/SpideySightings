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
    await sightings();

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

const sightings = async () => {
    let sightings = await getSightings();

    let cardHolder = document.createElement('section');
    cardHolder.classList.add("cardHolder");

    if(sightings != null){
        for(i=0; i<sightings.length; i++){

            //id of the post
            let sightingId = sightings[i]['sightingId'];

            //id of the user, will need to use another api call to get user info
            let userId = sightings[i]['userId'];

            //information show for each post
            let location = sightings[i]['location'];
            let imageURL = sightings[i]['image'];
            let description = sightings[i]['description'];

            let timestamp = sightings[i]['timestamp'];
            let dateTime = new Date(timestamp);
            let date = dateTime.toDateString();
            let hours = dateTime.getHours();
            let minutes = dateTime.getMinutes();
            let time = ('0' + hours).slice(-2) + ':' + ('0' + minutes).slice(-2);

            //create card
            let card = document.createElement('section');
            // card.classList.add("cardH");
            card.classList.add("card2");
            //create image
            let cardImage = document.createElement('img');
            cardImage.classList.add("card-image");
            cardImage.src = imageURL;
            // cardImage.src = 'https://imgbckt.s3.eu-west-1.amazonaws.com/spider-man-comic-7v7z18wgya32repe.jpg';
            card.appendChild(cardImage);

            let cardContent = document.createElement('section');
            cardContent.classList.add('card__content');

            let cardTitle = document.createElement('p');
            cardTitle.classList.add('card__title');
            cardTitle.innerHTML = 'Spidey sighted in ' + location + '!<br>' + date;
            cardContent.appendChild(cardTitle);

            let cardDesc = document.createElement('p');
            cardDesc.classList.add('card__description');
            cardDesc.innerHTML = 'Spider-man was sighted on ' + date + ' at ' + time + '! <br><br>' + description;
            cardContent.appendChild(cardDesc);

            card.appendChild(cardContent);

            cardHolder.appendChild(card);
        }

        let body = document.body;
        body.appendChild(cardHolder);
    }
};

function getSightings(){

    return fetch('http://localhost:8080/sightings')
        .then(response => {
            if (!response.ok) {
                throw new Error('Woopsie, API broke');
            }
            return response.json();
        })
        .catch(error => {
            console.error(error);
            return null;
        });

}

const updateUI = async () => {
    const isAuthenticated = await auth0Client.isAuthenticated();
    document.getElementById("btn-call-api").disabled = !isAuthenticated;

    if (isAuthenticated) {
        document.getElementById("gated-content").classList.remove("hidden");

        //document.getElementById("profile-card").style.display = "block";

        const userData = JSON.stringify(await auth0Client.getUser());

        document.getElementById("cardAvatar").src = JSON.parse(userData).picture;
        document.getElementById("name").innerHTML = JSON.parse(userData).name;
        document.getElementById("email").innerHTML = JSON.parse(userData).email;
        document.getElementById("SightingForm").style.display = "none";

        document.getElementById("btn-nav-login").removeEventListener("click", login);
        document.getElementById("btn-nav-login").addEventListener("click", logout);
        document.getElementById("btn-nav-login").textContent = 'Logout';
    } else {
        document.getElementById("gated-content").classList.add("hidden");
        //document.getElementById("profile-card").style.display = "none";

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

document.getElementById("postSightingBtn").addEventListener("click", (event) => {
    const SightForm = document.getElementById("SightingForm");

    if (SightForm.style.display === "none" || SightForm.style.display === "") {
        SightForm.style.display = "block";
    } else {
        SightForm.style.display = "none";
    }
});

document.getElementById('SightingForm').addEventListener('submit', (event) => {
    event.preventDefault();

    const formData = new FormData(event.target);

    const location = formData.get('location');
    console.log("🚀 ~ document.getElementById ~ location:", location);
    const description = formData.get('description');
    console.log("🚀 ~ document.getElementById ~ description:", description);
    const sightingTime = formData.get('sightingTime');
    console.log("🚀 ~ document.getElementById ~ sightingTime:", sightingTime);
    const image = formData.get('image');
    console.log("🚀 ~ document.getElementById ~ image:", image);

    // fetch('/upload', {
    //     method : 'POST'
    // })

});