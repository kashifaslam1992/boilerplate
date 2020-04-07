# Installations

- install Node.js [Node.js](https://nodejs.org/en/)
- install gulp and gulp-cli Globally **npm i -g gulp gulp-cli**
- Now install dependencies and package wit this command
    - **Command => npm install**


# Directory Structure

- All of your working files will be in src folder and it will output the file in dist folder
- Add all the font file in src->fonts
- Add all the image files in src->images
- Add all the js file in src->js for libraries use lib folder
- Add all the .scss file in src->sass
- Add all the html partials file in src->html


# Gulp Tasks

- **gulp:** Runs all the tasks automatically and waits for any change
- **cleanBuild:** Cleans the build folder
- **browsersync:** For reload and mobile testing
- **html:** To merge the html partials and output the complete html files
- **sass:** Complies sass to css
- **images:** Minimizes, copies new images into build folder
- **fonts:** Copies new font files to build folder
- **scripts:** Copies and debugs the script files