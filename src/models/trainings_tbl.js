const { Model, DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  class Training extends Model {
    static associate(models) {
    //   User.belongsTo(models.Role, {
    //     foreignKey: "role_id",
    //     as: "role",
    //   });
    }
  }

  Training.init(
    {
      training_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      trainings: {
        type: DataTypes.STRING(70),
        allowNull: true,
      },
      created_date: {
        type: DataTypes.DATE,
        allowNull: true,
        defaultValue: sequelize.literal("CURRENT_TIMESTAMP"),
      },
    
    },
    {
      sequelize,
      modelName: "Training",
      tableName: "trainings_tbl",
      timestamps: false,
    }
  );

  return Training;
};
