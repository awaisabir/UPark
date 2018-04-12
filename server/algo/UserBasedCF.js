const { sqrt, pow } = Math;

/**
 * returns an array with filling the predicted values filled in
 * @param   : the matrix to compute CF on
 * @returns : the complete matrix
 */
class UserBasedCF {
  constructor(matrix) {
    this.matrix = matrix;
  }

  /** 
   * Calls cf on the matrix
   * @returns : the new matrix
   */
  computeUserBasedCF() {
    for (let i=0; i<this.matrix.length; i++) {
      for (let j=0; j<this.matrix[i].length; j++) {
        if (this.matrix[i][j] === -1)
          this.matrix[i][j] = this._computeUserBasedPrediction(i, j);
      }
    }

    return this.matrix;
  }
  
  /**
   * Computes user based prediction
   * @param userIndex : the index of the user
   * @param itemIndex : the index of the item
   * @returns : the predicted value
   */
  _computeUserBasedPrediction(userIndex, itemIndex) {
    const average = this._computeUserBasedAverage(this.matrix[userIndex]);

    let numerator = 0;
    let denominator = 0;

    for (let i=0; i<this.matrix.length; i++) {
			if (i != userIndex && this.matrix[i][itemIndex] != -1) {
				let similarity = this._computeUserBasedSimilarity(this.matrix[userIndex], this.matrix[i]);
				if (similarity > 0) {
					numerator  	+= similarity * (this.matrix[i][itemIndex] - this._computeUserBasedAverage(this.matrix[i]));
					denominator += this._computeUserBasedSimilarity(this.matrix[userIndex], this.matrix[i]);					
				}
			}
		}
		
		return average + (numerator / denominator);
  }

  /**
   * Computes user based similarity
   * @param userARatings : ratings for user A
   * @param userBRatings : ratings for user B
   * @returns the similarity of the 2 users
   */
  _computeUserBasedSimilarity(userARatings = [], userBRatings = []) {
    const averageA = this._computeUserBasedAverage(userARatings);
    const averageB = this._computeUserBasedAverage(userBRatings);

    let totalNumerator = 0;
    let totalDenominator1 = 0;
    let totalDenominator2 = 0;

    for (let i=0; i<userARatings.length; i++) {

      // if both users have rated the item
      if (userARatings[i] !== -1 && userBRatings[i] !== -1) {
        let userANumerator = userARatings[i] - averageA;
        let userBNumerator = userBRatings[i] - averageB;

        totalNumerator += (userANumerator*userBNumerator);

        totalDenominator1 += pow(userANumerator, 2);
        totalDenominator2 += pow(userBNumerator, 2);
      }
    }

    const finalDenominator = sqrt(totalDenominator1) * sqrt(totalDenominator2);
    return totalNumerator / finalDenominator;
  }

  /**
   * Computes user based average
   * @param userRatings : The ratings to compute the average
   * @returns The average ratings for a user
   */
  _computeUserBasedAverage(userRatings) {
    let size = 0;
    let total = 0;

    for (let i=0; i<userRatings.length; i++) {
      if (userRatings[i] !== -1) {
        size++;
        total += userRatings[i];
      }
    }

    return total / size;
  }
}

module.exports = CollaborativFiltering;