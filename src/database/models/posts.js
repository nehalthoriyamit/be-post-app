const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    class Posts extends Model {
        static associate(models) {
            Posts.belongsTo(models.Users, {
                as: 'userDetails',
                foreignKey: 'userId',
            });
            Posts.hasMany(models.Likes, {
                as: 'likesData',
                foreignKey: 'postId',
            });
        }
    }

    Posts.init(
        {
            id: {
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
                primaryKey: true,
            },
            content: {
                type: DataTypes.TEXT,
                allowNull: false,
            },
            imageUrl: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            createdAt: {
                type: DataTypes.DATE,
                defaultValue: DataTypes.NOW,
                allowNull: false,
            },
            updatedAt: {
                type: DataTypes.DATE,
                allowNull: true,
            },
            deletedAt: {
                type: DataTypes.DATE,
                allowNull: true,
            },
        },
        {
            sequelize,
            timestamps: true,
            modelName: 'Posts',
            tableName: 'posts',
        },
    );

    return Posts;
};
