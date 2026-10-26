const longestCommonPrefix = function (strs) {
  const check = strs[0];
  let data = [];
  strs.map((word) => {
    let result = "";
    for (let i = 0; i < word.length; i++) {
      if (check[i] === word[i]) {
        result += check[i];
      }
    }
    data.push(result);
  });
  if (data.length === 0) {
    return "";
  } else {
    return data.reduce((acc, cur) => (acc.length < cur.length ? acc : cur));
  }
};
