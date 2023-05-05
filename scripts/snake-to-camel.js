function snakeToCamel(str) {
  return str.replace(/([-_][a-z])/ig, ($1) => $1.toUpperCase()
    .replaceAll('-', '')
    .replaceAll('_', ''));
}

module.exports = function (fileInfo, api) {
  const j = api.jscodeshift;
  const root = j(fileInfo.source);

  root.find(j.Identifier).forEach((path) => {
    if (path.node.name.includes('_')) {
      path.node.name = snakeToCamel(path.node.name);
    }
  });

  return root.toSource();
};
