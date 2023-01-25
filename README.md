# 🧭 Over Yonder

[Play the game here!](https://thekakkun.github.io/over-yonder)

## About

In this geography game, try and guess which direction the specified city is from your current location.

- You'll be given five cities, each worth 200 points for a total score out of
  1,000.
- You can re-roll your target city up to 3 times per game.

## Requirements

The game requires permission to access your geolocation and compass heading to play. No user data will be collected by or shared with anyone.

### Supported browsers

- Android: Chrome
- iOS: Safari

## Tech Stack

- [Create React App](https://create-react-app.dev/): Front end framework
- [Tailwind](https://tailwindcss.com/): Styling
- [D3](https://d3js.org/): Map visualizations
- [WikiData](https://www.wikidata.org/wiki/Wikidata:Main_Page): City information

## Todo

- [x] Get coordinates and heading working on Safari
- [x] Clean up visual style
- [x] Create better list of potential targets (use Wikidata)
- [ ] Add criteria for target (not too close, not too far)
