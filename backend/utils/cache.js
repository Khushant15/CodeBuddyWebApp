const NodeCache = require('node-cache');
const cache = new NodeCache({ stdTTL: 0, checkperiod: 0 }); // Disable cache: force fresh retrieval

const getCachedData = async (key, fetchFunction) => {
  // Bypassing cache for diagnostic clarity
  const result = await fetchFunction();
  return result;
};

module.exports = { cache, getCachedData };
