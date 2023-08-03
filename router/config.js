/* ------------------------- 配置路由(集中管理) ------------------------- */ 
import Home from '../views/home/Home.vue'// 首页
import Center from '../views/center/Center.vue'// 个人中心
import UserAdd from '../views/user-manage/UserAdd.vue'// 添加用户
import UserList  from '../views/user-manage/UserList.vue'// 用户列表
import NewsAdd from '../views/news-manage/NewsAdd.vue'// 新闻添加
import NewsEdit from '../views/news-manage/NewsEdit.vue'// 新闻编辑
import NewsList from '../views/news-manage/NewsList.vue'// 新闻列表
import ProductAdd from '../views/product-manage/ProductAdd.vue'// 产品添加
import ProductList from '../views/product-manage/ProductList.vue'// 产品列表
import ProductEdit from '../views/product-manage/ProductEdit.vue'// 产品编辑
import NotFound from '../views/notfound/NotFound.vue'// 404 页面

/* ------------------------ 创建路由数据(数组) ------------------------- */ 
const  routes = [
    {// 首页
        path:"/index",
        component:Home
    },
    {// 个人中心
        path:"/center",
        component:Center
    },
    {// 添加用户
        path:"/user-manage/adduser",
        component:UserAdd,
        requireAdmin:true// 管理员才渲染(标志位)
    },
    {// 用户列表
        path:"/user-manage/userlist",
        component:UserList,
        requireAdmin:true// 管理员才渲染(标志位)
    },

    {// 新闻添加
        path:"/news-manage/addnews",
        component:NewsAdd
    },
    {// 新闻编辑(动态传参路由)
        path:"/news-manage/editnews/:id",
        component:NewsEdit
    },
    {// 新闻列表
        path:"/news-manage/newslist",
        component:NewsList
    },
    {// 产品添加
        path:"/product-manage/addproduct",
        component:ProductAdd
    },
    {// 产品列表
        path:"/product-manage/productlist",
        component:ProductList
    },
    {// 产品编辑
        path:"/product-manage/editproduct/:id",
        component:ProductEdit
    },
    {// 路由重定向
        path:"/",
        redirect:"/index"
    },
    { // 404 页面
        path:"/:pathMatch(.*)*",// 官网写法
        name:"Notfound",
        component:NotFound
    }
]

export default routes