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

    document.getElementById("start").max = new Date().toISOString();
    document.getElementById("end").max = new Date().toISOString();
};

const sightingsbydate = async (jsonData) => {
    // Delete the my sightings feed card holder (if it exists)
    try {
        let mainFeed = document.getElementById('main-sightings-feed');
        mainFeed.remove();
    } catch (error) {
        console.log('Could not delete my sightings feed.')
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
            cardContent.classList.add('card-content');

            let cardHeader = document.createElement('section');
            cardHeader.classList.add('card-header');

            let cardHeaderTime = document.createElement('p');
            cardHeaderTime.innerText = date;
            cardHeaderTime.classList.add('card-time');

            let headerPlaceholder = document.createElement('aside');
            headerPlaceholder.classList.add('card-delete-button');
            headerPlaceholder.classList.add('delete-hidden');

            let cardTitle = document.createElement('p');
            cardTitle.classList.add('card-title');

            cardTitle.innerText = 'Spidey sighted in ' + location + '!';

            cardHeader.appendChild(cardHeaderTime);
            cardHeader.appendChild(cardTitle);
            cardHeader.appendChild(headerPlaceholder);
            cardContent.appendChild(cardHeader);

            let cardDesc = document.createElement('p');

            cardDesc.classList.add('card-description');

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
    document.getElementById("loader").classList.toggle("hidden");

    // Delete the main feed card holder (if it exists)
    try {
        const mainFeed = document.getElementById('main-sightings-feed');
        mainFeed.remove();
    } catch (error) {
        console.log('Could not delete main feed.')
    }
    try {
        let emptyFeed = document.getElementById('empty-message');
        mainFeed.remove();
    } catch (error) {
        //console.log('Could not delete my sightings feed.')
    }
    const sightings = await getSightingsById();
    document.getElementById("loader").classList.toggle("hidden");

    const cardHolder = document.createElement('section');
    cardHolder.classList.add("cardHolder");
    cardHolder.id = 'main-sightings-feed';

    if (sightings != null) {
        for (i = 0; i < sightings.length; i++) {

            //id of the post
            const sightingId = sightings[i]['sightingId'];

            //id of the user, will need to use another api call to get user info
            const userId = sightings[i]['userId'];

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
            cardContent.classList.add('card-content');

            let cardHeader = document.createElement('section');
            cardHeader.classList.add('card-header');

            let cardHeaderTime = document.createElement('p');
            cardHeaderTime.innerText = date;
            cardHeaderTime.classList.add('card-time');

            let cardTitle = document.createElement('p');
            cardTitle.classList.add('card-title');

            let header_delete_button = document.createElement('button');
            header_delete_button.classList.add('card-delete-button');
            header_delete_button.classList.add('delete-hidden');
            header_delete_button.innerText = ' Delete ';
            header_delete_button.onclick = async () => {
                await deleteClicked(sightingId);
            }

            card.addEventListener('mouseleave', () => {
                header_delete_button.classList.add('delete-hidden');
            });
            card.addEventListener('mouseenter', () => {
                header_delete_button.classList.remove('delete-hidden');
            });

            cardTitle.innerText = 'Spidey sighted in ' + location + '!';

            cardHeader.appendChild(cardHeaderTime);
            cardHeader.appendChild(cardTitle);
            cardHeader.appendChild(header_delete_button);
            cardContent.appendChild(cardHeader);

            let cardDesc = document.createElement('p');

            cardDesc.classList.add('card-description');

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

document.getElementById("profile").addEventListener("click", () => {
    document.getElementById('gated-content').classList.toggle('hidden');
});

const sightings = async () => {
    // Delete the my sightings feed card holder (if it exists)
    try {
        let mainFeed = document.getElementById('main-sightings-feed');
        mainFeed.remove();
    } catch (error) {
        //console.log('Could not delete my sightings feed.')
    }
    try {
        let emptyFeed = document.getElementById('empty-message');
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
            cardContent.classList.add('card-content');

            let cardHeader = document.createElement('section');
            cardHeader.classList.add('card-header');

            let cardHeaderTime = document.createElement('p');
            cardHeaderTime.innerText = date;
            cardHeaderTime.classList.add('card-time');

            let headerPlaceholder = document.createElement('aside');
            headerPlaceholder.classList.add('card-delete-button');
            headerPlaceholder.classList.add('delete-hidden');

            let cardTitle = document.createElement('p');
            cardTitle.classList.add('card-title');

            cardTitle.innerText = 'Spidey sighted in ' + location + '!';

            cardHeader.appendChild(cardHeaderTime);
            cardHeader.appendChild(cardTitle);
            cardHeader.appendChild(headerPlaceholder);
            cardContent.appendChild(cardHeader);

            let cardDesc = document.createElement('p');

            cardDesc.classList.add('card-description');

            cardDesc.innerText = 'Spider-man was sighted on ' + date + ' at ' + time;

            let cardDescInner = document.createElement('p');
            cardDescInner.innerText = description;
            cardDesc.appendChild(cardDescInner);

            cardContent.appendChild(cardDesc);


            card.appendChild(cardContent);

            cardHolder.appendChild(card);
        }
        if (sightings.length == 0){
            let emptyMessage = document.createElement('h1');
            emptyMessage.id = 'empty-message';
            emptyMessage.innerText = 'No sightings of spiderman ...yet';
            cardHolder.appendChild(emptyMessage);
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
            console.log(response.text());
            throw new Error('Woopsie, API broke');
        }
        let countJson = await response.json();
        if(countJson.rowsAffected == 0){
            console.log("No post deleted");
        }
        await sightingsbyid();
        document.getElementById("loader").classList.toggle("hidden");
    }
    catch(err){
        console.error(err);
        return null;
    }

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
                throw new Error(response.text());
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
        document.getElementById("gated-content").classList.toggle("hidden");

        await displayProfile();

        document.getElementById("btn-nav-login").removeEventListener("click", login);
        document.getElementById("btn-nav-login").addEventListener("click", logout);
        const SightForm = document.getElementById("gated-content");
        SightForm.classList.toggle('hidden');
        const temp = document.getElementById("SightingForm");
        temp.classList.toggle('hidden');
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
        console.error(err);
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
    const SightForm = document.getElementById("gated-content");
    SightForm.classList.toggle('hidden');
    const temp = document.getElementById("SightingForm");
    temp.classList.toggle('hidden');
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
    }).then(response => response.json())
    .then(async (data) => {
        await sightingsbyid()
        console.log('Success : ', data);
        document.getElementById("loader").classList.toggle("hidden");
    })
    .catch((error) => {
        console.error('Error : ', error);
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
    // var form = document.getElementById('dateForm');
    // form.classList.toggle('show');

    var profile = document.getElementById('profile-card');
    profile.classList.toggle('search-adjust');
  });