const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    class Likes extends Model {
        static associate(models) {
            Likes.belongsTo(models.Posts, {
                as: 'postDetails',
                foreignKey: 'postId',
            });
            Likes.belongsTo(models.Users, {
                as: 'userDetails',
                foreignKey: 'userId',
            });
        }
    }

    Likes.init(
        {
            id: {
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
                primaryKey: true,
            },
            userId: {
                type: DataTypes.UUID,
                references: {
                    model: 'Users',
                    key: 'id',
                },
            },
            postId: {
                type: DataTypes.UUID,
                references: {
                    model: 'Posts',
                    key: 'id',
                },
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
        },
        {
            sequelize,
            timestamps: true,
            modelName: 'Likes',
            tableName: 'likes',
        },
    );

    return Likes;
};
