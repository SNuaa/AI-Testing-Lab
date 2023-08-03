const UserModel = require("../../models/UserModel")

const UserService = {
    // 登录校验
    login: async ({ username, password }) => {
        return UserModel.find({//联通数据库对比用户信息
            username,
            password
        })
    },

    // 更新用户数据(自己)
    //根据id进行更新 第一个参数为查找的条件 后面为更新的数据
    upload: async ({ _id, username, introduction, gender, avatar }) => {
        if (avatar) {// 判断是否存在头像数据
            // 联通数据库进行数据更新
            return UserModel.updateOne({
                _id
            }, {
                username, introduction, gender, avatar
            })
        } else {
            return UserModel.updateOne({
                _id
            }, {//不更新上一次的头像数据
                username, introduction, gender
            })
        }
    },

    // 添加用户数据
    add: async ({ username, introduction, gender, avatar, password, role }) => {
        return UserModel.create({
            username, introduction, gender, avatar, password, role
        })
    },

    // 获取用户列表数据
    getList: async ({ id }) => {
        // 判断是否有用户id传进来,有则搜索单一用户,无则搜索全部用户
        return id ? UserModel.find({ _id: id }, ["username", "role", "avatar", "introduction", "gender"]) :
            UserModel.find({}, ["username", "role", "avatar", "introduction", "gender"])
    },

    // 删除用户数据
    delList: async ({ _id }) => {
        return UserModel.deleteOne({ _id })
    },

    // 修改用户数据(用户列表)
    putList: async (body) => {
        return UserModel.updateOne({ _id: body._id }, body)
    },

    //查找是否存在重复的用户的名字
    register: async ({ username, password }) => {
        try {
            const existingUser = await UserModel.findOne({ username });
            if (existingUser) {
                return -1; // 用户名已存在，返回 -1
            } else {
                const newUser = await UserModel.create({ username, password });
                return newUser; // 注册成功，返回新创建的用户对象
            }
        } catch (error) {
            console.error(error);
            return 0; // 发生错误，返回 0
        }
    }


}

module.exports = UserService