export function index(req, res) {
  res.json({
    endpoints: req.url,
    status: 'Ok',
  });
}
