/**
 * Takes a rating and turns it into a color representing how good it is.
 * @param {Number} ratingNumber - the rating to convert to a color
 * @return {String} the color representing the rating
 */
const ratingToColor = (ratingNumber) => {
  if (ratingNumber > 4) {
    return "green";
  } else if (ratingNumber > 3) {
    return "yellow";
  } else if (ratingNumber > 2) {
    return "orange";
  } else {
    return "red";
  }
};

export default ratingToColor;
