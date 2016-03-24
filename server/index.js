import 'babel-polyfill'
import server from './server'
import { getAppConfig } from './appConfig'

server.listen(getAppConfig('usePortEnv') ? process.env.PORT : getAppConfig('port'))
