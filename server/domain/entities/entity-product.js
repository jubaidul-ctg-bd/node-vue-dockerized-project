'use strict'

module.exports = (db) => {
    const productSchema = new db.Schema(
        {  
            productId: String,
            name: String,
            imgUrl: String,
            startDateTime: Date,
            price: Number,
            duration: Number,
            bidingPriceLimit: Number,
            lastBidderId: String,
            lastBidderName: String,
            IsDelete: Boolean
        },
        {
            timestamps: {
                createdAt: 'created_at',
                updatedAt: 'updated_at'
            }
        }
    );
    return db.model('Products', productSchema);
};