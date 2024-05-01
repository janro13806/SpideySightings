USE spideyDb;
GO

-- Insert dummy data into Users table
INSERT INTO Users (email)
VALUES ('ivan@gmail.com'),
       ('janro@gmail.com'),
       ('timo@gmail.com'),
       ('daniel@gmail.com'),
       ('navi@gmail.com'),
       ('omit@gmail.com'),
       ('leinad@gmail.com'),
       ('ivan2@gmail.com'),
       ('janro2@gmail.com'),
       ('timo2@gmail.com');

-- Insert dummy data into Sightings table
INSERT INTO Sightings (userId, location, image, description, timestamp)
VALUES 
    (1, 'Johannesburg', 0x, 'Amidst the bustling cityscape, a figure clad in vibrant red and blue maneuvers with unparalleled grace, swinging effortlessly from building to building. Citizens glance skyward, catching glimpses of this mysterious hero whose agility defies belief, inspiring whispers of admiration and wonder.', '2024-04-29'),
    (2, 'Pretoria', 0x, 'Scaling sheer walls with the ease of a spider, a masked vigilante traverses the urban labyrinth, evading capture with uncanny speed and agility. Spectators below gasp in amazement as the enigmatic hero performs feats of acrobatics, a fleeting yet mesmerizing sight amidst the city''s chaos.', '2024-04-28'),
    (3, 'Bloemfontein', 0x, 'Against the backdrop of towering skyscrapers, a figure donning the iconic red-and-blue attire of Spider-Man navigates the urban jungle with unparalleled finesse. His movements, a symphony of athleticism and determination, captivate onlookers, leaving them in awe of his spectacular displays of agility and bravery.', '2024-04-27'),
    (4, 'Benoni', 0x, 'Cloaked in shadows, a masked hero darts through labyrinthine alleys, his presence barely discernible save for the occasional glimpse of crimson and cobalt. With each graceful leap and swift swing, he eludes pursuit, disappearing into the night like a phantom, leaving only whispers of his heroic deeds in his wake.', '2024-04-26'),
    (5, 'Amsterdam', 0x, 'Amidst the chaos of the city streets, a symbol of hope emerges—a crimson spider insignia emblazoned against the night sky. Citizens pause in awe as the masked hero known as Spider-Man swings into action, his every move a testament to courage and resilience, inspiring admiration and gratitude in equal measure.', '2024-04-25'),
    (6, 'London', 0x, 'Like a ballet dancer in midair, Spider-Man pirouetted through the cityscape, his movements a mesmerizing blend of grace and power, leaving bystanders spellbound by his aerial prowess.', '2024-04-24'),
    (7, 'Seoul', 0x, 'A blur of red and blue streaked across the skyline, weaving through the concrete jungle with the finesse of an urban arachnid. Spectators craned their necks, catching fleeting glimpses of the elusive hero''s daring exploits.', '2024-04-23'),
    (8, 'New York', 0x, 'Against the backdrop of towering skyscrapers, a figure swung effortlessly, propelled by webs that glistened in the sunlight. With each swing, Spider-Man defied gravity, his acrobatic feats a testament to his superhuman agility and unwavering resolve.', '2024-04-22'),
    (9, 'New York', 0x, 'In the heart of the bustling metropolis, Spider-Man leaped from rooftop to rooftop, his movements fluid and precise, a silent guardian watching over the city''s denizens with unwavering vigilance.', '2024-04-21'),
    (10, 'New York', 0x, 'Amidst the chaos of the urban landscape, Spider-Man moved with the fluidity of silk, his every motion calculated and deliberate. Citizens marveled at the sight of their masked protector, a beacon of hope in a city plagued by darkness.', '2024-04-20');
