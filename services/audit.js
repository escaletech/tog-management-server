module.exports = function audit (req, resource, body) {
  req.log.child({
    category: 'audit',
    resource,
    action: req.method,
    user: req.user.email,
    body
  }).info(`Audit: ${req.method} on ${resource}`)
}
