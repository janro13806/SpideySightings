let user_id = 1
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
    document.getElementById("loader").classList.toggle("hidden");

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

const sightingsbydate = async (jsonData) => {
    // Delete the main feed card holder (if it exists)
    try {
        let mainFeed = document.getElementById('main-sightings-feed');
        mainFeed.remove();
    } catch (error) {
        console.log('Could not delete main feed.')
    }


    let sightings = await getSightingsByDate(jsonData);
    
    let cardHolder = document.createElement('section');
    cardHolder.classList.add("cardHolder");
    cardHolder.id = 'main-sightings-feed';

    if (sightings != null) {
        for (i = 0; i < sightings.length; i++) {

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
            card.classList.add("card-feed");
            //create image
            let cardImage = document.createElement('img');
            cardImage.classList.add("card-image");
            cardImage.src = imageURL;
            card.appendChild(cardImage);

            let cardContent = document.createElement('section');
            cardContent.classList.add('card__content');

            let cardTitle = document.createElement('p');
            cardTitle.classList.add('card__title');
            cardTitle.innerText = 'Spidey sighted in ' + location + '!';

            let cardTitleDate = document.createElement('p');
            cardTitleDate.innerText = date;
            cardTitle.appendChild(cardTitleDate);

            cardContent.appendChild(cardTitle);

            let cardDesc = document.createElement('p');
            cardDesc.classList.add('card__description');
            cardDesc.innerText = 'Spider-man was sighted on ' + date + ' at ' + time;

            let cardDescInner = document.createElement('p');
            cardDescInner.innerText = description;
            cardDesc.appendChild(cardDescInner);

            cardContent.appendChild(cardDesc);

            card.appendChild(cardContent);

            cardHolder.appendChild(card);
        }

        let body = document.body;
        body.appendChild(cardHolder);
    }
};

const sightingsbyid = async () => {
    // Delete the main feed card holder (if it exists)
    try {
        let mainFeed = document.getElementById('main-sightings-feed');
        mainFeed.remove();
    } catch (error) {
        console.log('Could not delete main feed.')
    }


    let sightings = await getSightingsById();
    
    let cardHolder = document.createElement('section');
    cardHolder.classList.add("cardHolder");
    cardHolder.id = 'main-sightings-feed';

    if (sightings != null) {
        for (i = 0; i < sightings.length; i++) {

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
            card.classList.add("card-feed");
            //create image
            let cardImage = document.createElement('img');
            cardImage.classList.add("card-image");
            cardImage.src = imageURL;
            card.appendChild(cardImage);

            let cardContent = document.createElement('section');
            cardContent.classList.add('card__content');

            let cardTitle = document.createElement('p');
            cardTitle.classList.add('card__title');
            cardTitle.innerText = 'Spidey sighted in ' + location + '!';

            let cardTitleDate = document.createElement('p');
            cardTitleDate.innerText = date;
            cardTitle.appendChild(cardTitleDate);

            cardContent.appendChild(cardTitle);

            let cardDesc = document.createElement('p');
            cardDesc.classList.add('card__description');
            cardDesc.innerText = 'Spider-man was sighted on ' + date + ' at ' + time;

            let cardDescInner = document.createElement('p');
            cardDescInner.innerText = description;
            cardDesc.appendChild(cardDescInner);

            cardContent.appendChild(cardDesc);

            card.appendChild(cardContent);

            cardHolder.appendChild(card);
        }

        let body = document.body;
        body.appendChild(cardHolder);
    }
};

const sightings = async () => {
    // Delete the my sightings feed card holder (if it exists)
    try {
        let mainFeed = document.getElementById('main-sightings-feed');
        mainFeed.remove();
    } catch (error) {
        //console.log('Could not delete my sightings feed.')
    }
    let sightings = await getSightings();

    let cardHolder = document.createElement('section');
    cardHolder.classList.add("cardHolder");
    cardHolder.id = 'main-sightings-feed';

    if (sightings != null) {
        for (i = 0; i < sightings.length; i++) {

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
            card.classList.add("card-feed");
            //create image
            let cardImage = document.createElement('img');
            cardImage.classList.add("card-image");
            cardImage.src = imageURL;
            card.appendChild(cardImage);

            let cardContent = document.createElement('section');
            cardContent.classList.add('card__content');

            let cardTitle = document.createElement('p');
            cardTitle.classList.add('card__title');
            cardTitle.innerText = 'Spidey sighted in ' + location + '!';

            let cardTitleDate = document.createElement('p');
            cardTitleDate.innerText = date;
            cardTitle.appendChild(cardTitleDate);

            cardContent.appendChild(cardTitle);

            let cardDesc = document.createElement('p');
            cardDesc.classList.add('card__description');
            cardDesc.innerText = 'Spider-man was sighted on ' + date + ' at ' + time;

            let cardDescInner = document.createElement('p');
            cardDescInner.innerText = description;
            cardDesc.appendChild(cardDescInner);

            cardContent.appendChild(cardDesc);


            card.appendChild(cardContent);

            cardHolder.appendChild(card);
        }

        let body = document.body;
        body.appendChild(cardHolder);
    }
};

async function ViewMySightingClicked()
{
    await sightingsbyid();
}

async function ViewMainFeedClicked()
{
    await sightings();
}


async function getSightings() {
    try {
        const response = await fetch('http://localhost:8080/sightings');
        if (!response.ok) {
            console.log(response.text());
            throw new Error('Woopsie, API broke');
        }
        return await response.json();
    } catch (error) {
        console.error(error);
        return null;
    }
}

async function getSightingsById() {
        const token = await auth0Client.getTokenSilently();

        try{
            const response = await fetch('/sightingsbyid', {
                method: 'POST',
                body: JSON.stringify({}),
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            if (!response.ok) {
                console.log(response.text());
                throw new Error('Woopsie, API broke');
            }
            return await response.json();
        }
        catch(err){
            console.error(err);
            return null;
        }
}

async function getSightingsByDate(jsonData){
    const token = await auth0Client.getTokenSilently();

    try{
        const response = await fetch('/sightingsbydate', {
            method: 'POST',
            body: JSON.stringify(jsonData),
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        if (!response.ok) {
            console.log(response.text());
            throw new Error('Woopsie, API broke');
        }
        return await response.json();
    }
    catch(err){
        console.error(err);
        return null;
    }
}

document.getElementById("dateForm").addEventListener("submit", async function(event) {
    event.preventDefault();

    var formData = new FormData(event.target);

    var jsonData = {};
    formData.forEach(function(value, key){
        jsonData[key] = value;
    });

    if (!jsonData.hasOwnProperty("userSightingsOnly")){
        jsonData["userSightingsOnly"] = "off";
    }

    await sightingsbydate(jsonData);

});

const displayProfile = async () => {
    const userData = JSON.stringify(await auth0Client.getUser());
    if (userData.length > 0) {
        document.getElementById("profile-card").classList.toggle("hidden");
        document.getElementById("cardAvatar").src = JSON.parse(userData).picture;
        document.getElementById("name").innerText = JSON.parse(userData).name;
        document.getElementById("email").innerText = JSON.parse(userData).email;
    }
};

const updateUI = async () => {
    const isAuthenticated = await auth0Client.isAuthenticated();
    document.getElementById("btn-call-api").disabled = !isAuthenticated;

    if (isAuthenticated) {
        document.getElementById("gated-content").classList.toggle("hidden");

        //document.getElementById("profile-card").style.display = "block";
        document.getElementById("SightingForm").style.display = "none";

        document.getElementById("btn-nav-login").removeEventListener("click", login);
        document.getElementById("btn-nav-login").addEventListener("click", logout);
        document.getElementById("btn-nav-login").textContent = 'Logout';
    } else {
        document.getElementById("gated-content").classList.toggle("hidden");
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
        method: 'POST',
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