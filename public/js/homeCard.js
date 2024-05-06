window.onload = async function(){

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
            card.classList.add("cardH");

            //create card content title
            let cardTitle = document.createElement('h1');
            cardTitle.classList.add('cardTitleH');
            cardTitle.innerHTML = 'Spidey sighted in ' + location + '!<br>' + date;
            card.appendChild(cardTitle);

            //container for the image and the description
            let cardContent = document.createElement('section');
            cardContent.classList.add("cardContentH");

                //create image
                let cardImage = document.createElement('img');
                cardImage.classList.add("cardImageH");
                //img.src = imageURL;
                cardImage.src = 'https://elasticbeanstalk-eu-west-1-924511948270.s3.eu-west-1.amazonaws.com/images/spidey.jpg?response-content-disposition=inline&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEFMaCXVzLWVhc3QtMSJHMEUCIQCkEIfaAt8tatIGDzAIOICnn3dJPgbzEcA1e%2FfgzIPXrwIgAWjYoVjfMSdBhrsWKVEXEZvNXYoyDfr477At5Z%2FPUZ8q7QMIrP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw5MjQ1MTE5NDgyNzAiDKO%2BrxVgk%2F9rcBpuHyrBA9Ch6dRWspBjJReK5gYP4YrIhU%2Brfx2X6F5mw%2BV6z6diuwmXpam1ML5tac6XxIO93X153mxY7eRP2rRdE5YUG91y2aUoQI0Bf9TIxYwQm8E2dfLVFzUp93IhKed2r8fYKSMIWYvyFFI5rFLtc0P5dj5naSGNQi653XMtZkPSuSt8Ic0WjN5Kw2WEUN3bzsFTTY7F8IEeEFkhSQQ2KWWiv8966XK8aw24%2BoTHPv%2BtZ%2Ff3aaL%2BFsZqLZOaGZP1rzgib%2BaaVpAmqNHBVMNLtcDop3P%2BMaER6BQ1SjO1mQVyhvu9EIt6N8rFDdYpMSiIww8sJSWcemj8uJuOEfypIk6wdVCJAIQPCH57fnDQxvqcbiHUZmrRvkfHB3Dc1Qtud6zkAKYNlrrzoHRMUWPYHCxSSQPSmA1iBNVECop0HTiCKJIFKALXhJpqH5a1ecSjh80FngWsPBnfhH%2BJPbAF82XDNEs0%2FStHqA4XKJZzWedFi46ydevPUuJEy1Uui%2BVND8UwA28CLhVrWrh%2FaMYa2ACyMoPjBAc0koUtc564k9VVE9ZYIfvoXbu5IFU6W6goCeL0WKQCOxMBR%2F0DLqXi1CurqXw4MJyh37EGOpQCSbqdLtswzV%2FRQOgZzYOWWCLo1xUB3K4ojyzNIpWtpZ0wZLDZBwmPis01GhdvE6tBKsV2Yc8Xlp3BiPhZ%2BN2swIfPFb9o1pm9accxBG6uKlnzJVT3IlyyQqwoPnLKu7r76jnzgAReppzYWImRula2TH3Eo4ilRKWCJt9CcyYfsllYN%2FgBBcZP6Ipl84TjDdKp4WUoy6J%2BUYNmFsLhSWTU5Nc5TxaXsOeMjJh5DnG249TkFwMHNRMQ4dLUEMEB7d0YtQ%2BW2fiXaVOw79piml4T7%2BSXApccjlE68mDEAgigekJiwOmJyJUv63%2BWHi6G5JyuMa%2BjB7Zyh5U7ErVuL3NoM30rREWbywPWMX755OIERbL0QXoX&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20240505T183400Z&X-Amz-SignedHeaders=host&X-Amz-Expires=300&X-Amz-Credential=ASIA5OQJUZXXBKAHO6NQ%2F20240505%2Feu-west-1%2Fs3%2Faws4_request&X-Amz-Signature=353cd099e2beda7d0ed86c10e1098c1f938c6dc90b45c4bb856bd343994049b3';
                cardContent.appendChild(cardImage);

                //create card content description
                let cardDescription = document.createElement('p');
                cardDescription.classList.add('cardDescriptionH');
                cardDescription.innerHTML = 'Spider-man was sighted on ' + date + ' at ' + time + '! <br><br>' + description;
                cardContent.appendChild(cardDescription);

            card.appendChild(cardContent)
            cardHolder.appendChild(card);
        }

        let body = document.body;
        body.appendChild(cardHolder);
    }
}

function getSightings(){

    return fetch('https://da0t9he4bchaj.cloudfront.net/sightings')
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