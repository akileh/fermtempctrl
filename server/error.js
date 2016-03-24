export default function error(status, message) {
  const err = new Error(isNaN(message) ? status : null)
  err.status = status
  return err
}
