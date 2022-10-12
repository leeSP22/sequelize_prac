'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Post extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here

      // this.belongsTo(models.Users,{foreignKey:"userId"});
    }
  }
  Post.init({
    postId: {
      allowNull: false,
      autoIncrement: true,
      primaryKey:true,
      type: DataTypes.INTEGER,
    },
    userId:{
       type: DataTypes.INTEGER,
       references: {
        model: 'Users',
        key:'userId',
          }
      },
    username: DataTypes.STRING,
    title: DataTypes.STRING,
    likes: DataTypes.INTEGER,
    content: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Post',
  });
  return Post;
};