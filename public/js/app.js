let auth0Client = undefined;

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

    document.getElementById("start").max = new Date().toISOString();
    document.getElementById("end").max = new Date().toISOString();
};

const sightingsbydate = async (jsonData) => {
    // Delete the my sightings feed card holder (if it exists)
    try {
        const mainFeed = document.getElementById('main-sightings-feed');
        mainFeed.remove();
    } catch (error) {
        console.log('Could not delete my sightings feed.')
    }
    
    const sightings = await getSightingsByDate(jsonData);

    const cardHolder = document.createElement('section');
    cardHolder.classList.add("cardHolder");
    cardHolder.id = 'main-sightings-feed';

    if (sightings != undefined) {
        for (i = 0; i < sightings.length; i++) {

            //information show for each post
            const location = sightings[i]['location'];
            const imageURL = sightings[i]['image'];
            const description = sightings[i]['description'];

            const timestamp = sightings[i]['timestamp'];
            const dateTime = new Date(timestamp);
            const date = dateTime.toDateString();
            const hours = dateTime.getHours();
            const minutes = dateTime.getMinutes();
            const time = ('0' + hours).slice(-2) + ':' + ('0' + minutes).slice(-2);

            //create card
            const card = document.createElement('section');
            card.classList.add("card-feed");
            //create image
            const cardImage = document.createElement('img');
            cardImage.classList.add("card-image");
            cardImage.src = imageURL;
            card.appendChild(cardImage);

            const cardContent = document.createElement('section');
            cardContent.classList.add('card-content');

            const cardHeader = document.createElement('section');
            cardHeader.classList.add('card-header');

            const cardHeaderTime = document.createElement('p');
            cardHeaderTime.innerText = date;
            cardHeaderTime.classList.add('card-time');

            const headerPlaceholder = document.createElement('aside');
            headerPlaceholder.classList.add('card-delete-button');
            headerPlaceholder.classList.add('delete-hidden');

            const cardTitle = document.createElement('p');
            cardTitle.classList.add('card-title');

            cardTitle.innerText = 'Spidey sighted in ' + location + '!';

            cardHeader.appendChild(cardHeaderTime);
            cardHeader.appendChild(cardTitle);
            cardHeader.appendChild(headerPlaceholder);
            cardContent.appendChild(cardHeader);

            const cardDesc = document.createElement('p');

            cardDesc.classList.add('card-description');

            cardDesc.innerText = 'Spider-man was sighted on ' + date + ' at ' + time;

            const cardDescInner = document.createElement('p');
            cardDescInner.innerText = description;
            cardDesc.appendChild(cardDescInner);

            cardContent.appendChild(cardDesc);


            card.appendChild(cardContent);

            cardHolder.appendChild(card);
        }

        const body = document.body;
        body.appendChild(cardHolder);
    }
};

const sightingsbyid = async () => {
    document.getElementById("loader").classList.toggle("hidden");

    // Delete the main feed card holder (if it exists)
    try {
        const mainFeed = document.getElementById('main-sightings-feed');
        if (mainFeed != undefined){
            mainFeed.remove();
        }
    } catch (err) {
        throw new Error('Woopsie, FE broke : ' + err.message);
    }
    try {
        const emptyFeed = document.getElementById('empty-message');
        if (emptyFeed != undefined){
            emptyFeed.remove();
        }
    } catch (err) {
        throw new Error('Woopsie, FE broke : ' + err.message);
    }
    const sightings = await getSightingsById();
    document.getElementById("loader").classList.toggle("hidden");

    const cardHolder = document.createElement('section');
    cardHolder.classList.add("cardHolder");
    cardHolder.id = 'main-sightings-feed';

    if (sightings != undefined) {
        for (i = 0; i < sightings.length; i++) {

            //id of the post
            const sightingId = sightings[i]['sightingId'];

            //information show for each post
            const location = sightings[i]['location'];
            const imageURL = sightings[i]['image'];
            const description = sightings[i]['description'];

            const timestamp = sightings[i]['timestamp'];
            const dateTime = new Date(timestamp);
            const date = dateTime.toDateString();
            const hours = dateTime.getHours();
            const minutes = dateTime.getMinutes();
            const time = ('0' + hours).slice(-2) + ':' + ('0' + minutes).slice(-2);

            //create card
            const card = document.createElement('section');
            card.classList.add("card-feed");
            //create image
            const cardImage = document.createElement('img');
            cardImage.classList.add("card-image");
            cardImage.src = imageURL;
            card.appendChild(cardImage);

            const cardContent = document.createElement('section');
            cardContent.classList.add('card-content');

            const cardHeader = document.createElement('section');
            cardHeader.classList.add('card-header');

            const cardHeaderTime = document.createElement('p');
            cardHeaderTime.innerText = date;
            cardHeaderTime.classList.add('card-time');

            const cardTitle = document.createElement('p');
            cardTitle.classList.add('card-title');

            const headerDeleteButton = document.createElement('button');
            headerDeleteButton.classList.add('card-delete-button');
            headerDeleteButton.classList.add('delete-hidden');
            headerDeleteButton.innerText = ' Delete ';
            headerDeleteButton.onclick = async () => {
                await deleteClicked(sightingId);
            };

            card.addEventListener('mouseleave', () => {
                headerDeleteButton.classList.add('delete-hidden');
            });
            card.addEventListener('mouseenter', () => {
                headerDeleteButton.classList.remove('delete-hidden');
            });

            cardTitle.innerText = 'Spidey sighted in ' + location + '!';

            cardHeader.appendChild(cardHeaderTime);
            cardHeader.appendChild(cardTitle);
            cardHeader.appendChild(headerDeleteButton);
            cardContent.appendChild(cardHeader);

            const cardDesc = document.createElement('p');

            cardDesc.classList.add('card-description');

            cardDesc.innerText = 'Spider-man was sighted on ' + date + ' at ' + time;

            const cardDescInner = document.createElement('p');
            cardDescInner.innerText = description;
            cardDesc.appendChild(cardDescInner);

            cardContent.appendChild(cardDesc);


            card.appendChild(cardContent);

            cardHolder.appendChild(card);
        }

        const body = document.body;
        body.appendChild(cardHolder);
    }
};

document.getElementById("profile").addEventListener("click", async () => {
    const isAuthenticated = await auth0Client.isAuthenticated();
    if (!isAuthenticated) {
        await login();
    }
    else {
        document.getElementById('gated-content').classList.toggle('hidden');
    }
});

document.getElementById("search").addEventListener("click", async () => {
    const isAuthenticated = await auth0Client.isAuthenticated();
    if (!isAuthenticated) {
        await login();
    }
    else {
        document.getElementById('gated-content').classList.toggle('hidden');
    }
});

const sightings = async () => {
    // Delete the my sightings feed card holder (if it exists)
    try {
        const mainFeed = document.getElementById('main-sightings-feed');
        if (mainFeed != undefined){
            mainFeed.remove();
        }
    } catch (err) {
        throw new Error('Woopsie, FE broke : ' + err.message);
    }
    try {
        const emptyFeed = document.getElementById('empty-message');
        if (emptyFeed != undefined){
            emptyFeed.remove();
        }
    } catch (err) {
        throw new Error('Woopsie, FE broke : ' + err.message);
    }
    const sightings = await getSightings();

    const cardHolder = document.createElement('section');
    cardHolder.classList.add("cardHolder");
    cardHolder.id = 'main-sightings-feed';
    if (sightings != undefined) {
        for (i = 0; i < sightings.length; i++) {
            //information show for each post
            const location = sightings[i]['location'];
            const imageURL = sightings[i]['image'];
            const description = sightings[i]['description'];

            const timestamp = sightings[i]['timestamp'];
            const dateTime = new Date(timestamp);
            const date = dateTime.toDateString();
            const hours = dateTime.getHours();
            const minutes = dateTime.getMinutes();
            const time = ('0' + hours).slice(-2) + ':' + ('0' + minutes).slice(-2);

            //create card
            const card = document.createElement('section');
            card.classList.add("card-feed");
            //create image
            const cardImage = document.createElement('img');
            cardImage.classList.add("card-image");
            cardImage.src = imageURL;
            card.appendChild(cardImage);

            const cardContent = document.createElement('section');
            cardContent.classList.add('card-content');

            const cardHeader = document.createElement('section');
            cardHeader.classList.add('card-header');

            const cardHeaderTime = document.createElement('p');
            cardHeaderTime.innerText = date;
            cardHeaderTime.classList.add('card-time');

            const headerPlaceholder = document.createElement('aside');
            headerPlaceholder.classList.add('card-delete-button');
            headerPlaceholder.classList.add('delete-hidden');

            const cardTitle = document.createElement('p');
            cardTitle.classList.add('card-title');

            cardTitle.innerText = 'Spidey sighted in ' + location + '!';

            cardHeader.appendChild(cardHeaderTime);
            cardHeader.appendChild(cardTitle);
            cardHeader.appendChild(headerPlaceholder);
            cardContent.appendChild(cardHeader);

            const cardDesc = document.createElement('p');

            cardDesc.classList.add('card-description');

            cardDesc.innerText = 'Spider-man was sighted on ' + date + ' at ' + time;

            const cardDescInner = document.createElement('p');
            cardDescInner.innerText = description;
            cardDesc.appendChild(cardDescInner);

            cardContent.appendChild(cardDesc);


            card.appendChild(cardContent);

            cardHolder.appendChild(card);
        }
        if (sightings.length == 0){
            const emptyMessage = document.createElement('h1');
            emptyMessage.id = 'empty-message';
            emptyMessage.innerText = 'No sightings of spiderman ...yet';
            cardHolder.appendChild(emptyMessage);
        }
        const body = document.body;
        body.appendChild(cardHolder);
    }
};


async function ViewMySightingClicked()
{
    const isAuthenticated = await auth0Client.isAuthenticated();
    if (!isAuthenticated) {
        await login();
    }
    else {
        await sightingsbyid();
    }
}

async function ViewMainFeedClicked()
{
    await sightings();
}

async function deleteClicked(postID)
{
    document.getElementById("loader").classList.toggle("hidden");

    const token = await auth0Client.getTokenSilently();

    jsonData = {"postID" : postID};

    try{
        const response = await fetch('/deletepostbyid', {
            method: 'POST',
            body: JSON.stringify(jsonData),
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        if (!response.ok) {
            throw new Error('Woopsie, API broke : ' + response.text());
        }
        await sightingsbyid();
        document.getElementById("loader").classList.toggle("hidden");
    }
    catch(err){
        throw new Error('Woopsie, FE broke : ' + err.message);
    }

}

async function getSightings() {
    try {
        const response = await fetch('https://da0t9he4bchaj.cloudfront.net/sightings');
        if (!response.ok) {
            throw new Error('Woopsie, API broke : ' + response.text());
        }
        return await response.json();
    } catch (err) {
        throw new Error('Woopsie, FE broke : ' + err.message);
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
                throw new Error(response.text());
            }
            return await response.json();
        }
        catch(err){
            throw new Error('Woopsie, FE broke : ' + err.message);
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
            throw new Error('Woopsie, API broke : ' + response.text());
        }
        return await response.json();
    }
    catch(err){
        throw new Error('Woopsie, FE broke : ' + err.message);
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
    const user = JSON.stringify(await auth0Client.getUser());
    if (user.length > 0) {
        document.getElementById("gated-content").classList.toggle("hidden");
        document.getElementById("cardAvatar").src = JSON.parse(user).picture;
        document.getElementById("name").innerText = JSON.parse(user).name;
        document.getElementById("email").innerText = JSON.parse(user).email;
        document.getElementById("profile-card").classList.toggle("hidden");
    }
    
};

const updateUI = async () => {
    const isAuthenticated = await auth0Client.isAuthenticated();
    
    if (isAuthenticated) {
        document.getElementById("btn-nav-login").textContent = 'Logout';
        await checkProfile();
        // document.getElementById("gated-content").classList.toggle("hidden");

        await displayProfile();

        document.getElementById("btn-nav-login").removeEventListener("click", login);
        document.getElementById("btn-nav-login").addEventListener("click", logout);
        const SightForm = document.getElementById("gated-content");
        SightForm.classList.toggle('hidden');
    } else {
        document.getElementById("gated-content").classList.toggle("hidden");

        document.getElementById("btn-nav-login").removeEventListener("click", logout);
        document.getElementById("btn-nav-login").addEventListener("click", login);
        document.getElementById("btn-nav-login").textContent = 'Login';
    }
};

const checkProfile = async () => {
    //Send request to check user profile
    try{
        const token = await auth0Client.getTokenSilently();
        const response = await fetch('/profile', {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        console.log(response);
        if (!response.ok) {
            throw new Error(response.text());
        }
    }
    catch(err){
        throw new Error('Woopsie, FE broke : ' + err.message);
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


document.getElementById("postSightingBtn").addEventListener("click", () => {
    const SightForm = document.getElementById("SightingForm");
    SightForm.classList.toggle('hidden');
});

document.getElementById('SightingForm').addEventListener('submit', async (event) => {
    document.getElementById("loader").classList.toggle("hidden");

    event.preventDefault();

    const formData = new FormData(event.target);
    const token = await auth0Client.getTokenSilently();

    fetch('/upload', {
        method: 'POST',
        body: formData,
        headers: {
            Authorization: `Bearer ${token}`
        }
    }).then()
    .then(async () => {
        await sightingsbyid();
        document.getElementById("loader").classList.toggle("hidden");
    })
    .catch((err) => {
        throw new Error('Woopsie, API broke : ' + err.message);
    });
});

const input = document.getElementById('sightImage');
const fileNameDisplay = document.getElementById('fileName');

input.onchange = () => {

    if (input.files && input.files.length > 0) {
        const fileName = input.files[0].name;
        fileNameDisplay.textContent = fileName;
    } else {
        fileNameDisplay.textContent = "No file selected";
    }
};

document.getElementById('toggleSearch').addEventListener('click', function() {
    var profile = document.getElementById('profile-card');
    profile.classList.toggle('search-adjust');
  });