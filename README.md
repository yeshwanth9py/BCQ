# BCQ
Battle Choice Question(V1)

# Code Combat

Code Combat is an application where users can engage in live MCQ battles and live coding battles. This README provides an overview of the application's features and how it works.

## Main Features

### User Authentication
- Users must be logged in to access the main page.
- The application redirects users to the login page if they are not authenticated.
- The sign-up page allows users to select and upload a profile picture, which is stored in Firebase along with other user details.
- Forgot password feature with error validation is available for users who need to reset their passwords.

### Room Management
- Available rooms are displayed with an expiration time to ensure data is cleared periodically.
- Users can create rooms with customizable settings, such as game type (MCQ battle or coding battle), number of players, time limit, difficulty level, and room password.
- Room creators can delete their rooms, and other users need to be accepted by the room owner to join.
- The room owner must accept join requests from other users.
- Rooms can be shared via WhatsApp for easy invitations.

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

### In-Room and Global Chat
- Users in the same room can chat with each other.
- A global chat feature allows users to communicate and challenge each other from the home session.

### Live Coding Battles (Under Construction)
- Users will receive random coding problems to solve within a time limit.
- The front end uses the Monaco Editor.
- The back end uses child processes to handle code execution.
- Polling is used to check the status of code execution.

## Technical Details
- The application uses three servers: front end, back end, and socket server.
- The coding battle feature will be integrated with a dedicated code socket server once completed.

### Quick Match
- Users can join available rooms or create a new room if no rooms are available.
- The quick match feature allows users to enter a game without needing approval from the room owner.

## Installation and Setup

To run the application locally, follow these steps:

1. Clone the repository:
    ```bash
    git clone https://github.com/yourusername/code-combat.git
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

Mail:- yeshwanthsai200*gmail.com
Phone:+91 9063299400



Thank you for checking out Code Combat!



