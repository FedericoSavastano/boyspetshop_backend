import { Table, Column, Model, DataType, Default } from 'sequelize-typescript';

@Table({
    tableName: 'petshop_products',
})
class PetshopProduct extends Model {
    @Column({
        type: DataType.STRING(100),
    })
    declare name: string;

    @Column({
        type: DataType.FLOAT(6),
    })
    declare price: number;

    @Column({
        type: DataType.INTEGER,
    })
    declare amount: number;

    @Column({
        type: DataType.STRING(100),
    })
    declare category: string;

    @Default(true)
    @Column({
        type: DataType.BOOLEAN,
    })
    declare availability: boolean;
}

export default PetshopProduct;
