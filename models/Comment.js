const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');

class Comment extends Model {}

Comment.init({
    body: {
        type:DataTypes.TEXT,
        allowNull:false
    },
    date: {
        type:DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },
    user_id:{
        type: DataTypes.INTEGER,
        references: {
            model: 'user',
            key:'id',
        },
    },

},{
    sequelize,   
    freezeTableName: true,
    underscored: true,
    modelName: 'comment',
});

module.exports=Comment