# BCQ
Battle Choice Question (V1)

# Code Combat (V2)

Code Combat is an application where users can engage in live CODING/MCQ battles. This README provides an overview of the application's features and how it works.

## Main Features

### User Authentication
- Users must be logged in to access the main page.
- The application redirects users to the login page if they are not authenticated.
- The sign-up page allows users to select and upload a profile picture, which is stored in Firebase along with other user details.
- Forgot password feature with error validation is available for users who need to reset their passwords.
- Users who forgot their password can receive OTPs via email to reset their passwords.

### Live MCQ Battles
- Users can participate in MCQ battles with a live leaderboard displayed during the game.
- Socket.IO is used to implement real-time features.
- Game statistics, including correct and incorrect answers, are shown after the game.
- Users can return to the lobby or home page and start new games.

### Search and Filter Rooms
- Users can search for rooms based on room name, description, or creator.
- Search results are displayed based on matching properties.

### User Profiles
- User profiles display game history with pagination to load data efficiently.
- Users can follow others and view their profiles.
- Users can challenge others to a game, which triggers a push notification for the recipient.
- Ranking system: Users are assigned ranks based on their points. Ranks include Noob, Rookie, Guardian, Pro, Master, Grandmaster, Specialist, Champion, Legend, Hacker, and Godlike (0, 25, 50, 75, 100, 125, 150, 175, 200, 225, 250+ points).

### In-Room and Global Chat
- Users in the same room can chat with each other.
- A global chat feature allows users to communicate and challenge each other from the home session.

### Live Coding Battles (Under Construction)
- All the Users present in game room will receive random coding problems to solve within a time limit.
- If the user is able to solve the problem (passing all the testcases) he will gain 5 points and will be given a new question thereafter.
- The user is also allowed to skip 3 questions in a given game, if he is unable to solve it.
- At the end of the game the user who has most points will be the winner of the game, this data/game stats will be reflected in the gamers profile in about 10 minutes buffer.

### Room management
- Users can create rooms with customizable settings, such as game type (CODING battle or MCQ battle), number of players, time limit, difficulty level, and room password.
- Users can basically make their rooms private(with a password) or public(open for anyone to join) and share the invites with their friends (through whatsapp)
- Users can also visit an other user and challenge him directly through the profile, this will send a real time request or a push notification to the other user
- Any person joining the room(uninvited) will have to wait for the current room owner to accept him in nor he can not join

### Code Combat (GYM)
- Users can solve coding problems randomly in either of the 2 languages c++ or python
- This is a small sample of how live coding battle will happen

## Technical Details
- The application uses three servers: front end, back end, and socket server.
- The coding battle feature will be integrated with a dedicated code socket server once completed.

### Quick Match Feature
- Fed up with the time consuming protected rooms and strict owners who wont accept you in? no worries.
- Users can join available rooms or create a new room if no rooms are available.
- The quick match feature allows users to enter a game without needing approval from the room owner.

## Installation and Setup

To run the application locally, follow these steps:

1. Clone the repository:
    ```bash
    git clone https://github.com/yeshwanth9py/BCQ.git
    ```
2. Install dependencies for the front end, back end, and socket server:
    ```bash
    cd code-combat
    npm install
    cd backend
    npm install
    cd socket-server
    npm install
    ```
3. Start the 3 servers:
    ```bash
    cd frontend
    npm run dev
    cd backend
    npm index
    cd socket
    npm server
    ```

## Future Improvements
- Complete the live coding battle feature.
- Improve the UI for a better user experience.
- Address minor bugs and enhance overall performance.

## Feedback
If you have any suggestions or feedback, please feel free to open an issue or contact me directly.

Mail: yeshwanthsai2008@gmail.com  
Phone: +91 9063299400

Thank you for checking out Code Combat!
