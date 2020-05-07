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
- **nunjucks:** To merge the html partials and output the complete html files
- **style:** Complies sass to css
- **graphics:** Minimizes, copies new images into build folder
- **typography:** Copies new font files to build folder
- **sassCopy:** Copies scss files to build->scss folder
- **js:** Copies and debugs the script files


# Pass Flag with Gulp Task
- Set Flag to True: **gulp --prod=true**