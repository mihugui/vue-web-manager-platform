 //routes自动生成的文件,执行 npm run route 可以生成此文件
//只需在map文件夹定义不同的路由,即可自动import进此项目
import route0 from "./map/LoginPage/index.js"
import route1 from "./map/System/index.js"
import route2 from "./map/System/PlaceManager/index.js"
let routes = []
let myRoutes = routes.concat(route0,route1,route2)
export default myRoutes;