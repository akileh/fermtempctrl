const appConfig = {
  name: 'Fermtempctrl',
  port: 3000,
  responseDelay: false,
  authEnabled: false,
  authUser: null,
  authPass: null,
  temperatureSaveInterval: 60 * 1000,
  maxDbRows: null
}

export function getAppConfig(key) { // eslint-disable-line import/prefer-default-export
  const value = process.env[`ft_${key}`] || appConfig[key]
  if (typeof value === 'string') {
    if (!value) {
      return null
    }
    else if (value.match && value.match(/^true$/i)) {
      return true
    }
    else if (value.match && value.match(/^false$/i)) {
      return false
    }
    else if (!isNaN(value)) {
      return Number(value).valueOf()
    }
    else {
      return value
    }
  }
  else {
    return value
  }
}
