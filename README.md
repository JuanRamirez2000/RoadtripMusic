# Road Trip Playlists

An app that gathers an estimated time frame throughout a RoadTrip and will auto-generate a playlis that fulfills that time slot

## A Note On Contributions:

Contributions are closed right now due to this being a personal project. However during production I might be inclined to add more users to the project

## Built With:

Frontend Tech

- ReactJS
- TypescriptJS
- MapboxAPI
- React Map GL JS
- DeckGL

Backend tech

- NextJS (app Directory)
- AuthJS

Infra

- Vercel

Other notable tech

- Spotfy Web API

## Current and Future Additions:

- [x] Safe user logins with OAUTH2
- [x] Users allowed to select the destinations
- [x] Playlist saves onto user's spotify account
- [x] Create a light and dark mode
- [ ] Show the songs on the map itself
- [ ] Users should be able to delete songs on the playlist 
- [ ] Song cards should link to the preview
- [ ] Add settings for the playlist
    - [ ] Users should be allowed to change the name of the playlist
    - [ ] Users should be able to change the source playlist/artists for the recommendation system
    - [ ] Users should be able to add some "extra time" to the playlist
- [ ] Add settings for the map
    - [ ] Make it so that users can add more than one destination
    - [ ] Make it so that users can change their driving method
    - [ ] Look at MapBox directions API to see other useful options



## Changes and optimizations needed
- [x] Clean up the API calls in the backend
- [x] Clean up map code
- [x] Clean up landing page (possible hero only)
- [ ] Added a logger to track user flow

## Bugs to fix
- [ ] Playlist generation fails if more than 100 songs are going to be added at once
- [ ] Mobile UI drawer open button is above from search field

## Lessons learned from the project

- Working with multiple different APIs
- Handling interactions with a backend and frontend
- Cookie and Session handling for backend development
- OAuth Flow
- Creating a structured and reuasable API

Built by Juan Ramirez