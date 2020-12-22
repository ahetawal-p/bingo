const util = {}

util.wait = ms => new Promise(r => setTimeout(r, ms));

export default util;