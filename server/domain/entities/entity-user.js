'use strict'

module.exports = (db) => {
    var userSchema = new db.Schema(
        {  
            userId: String,
            name: String,
            email: String,
            password: String,
            IsDelete: Boolean
        },
        {
            timestamps: {
                createdAt: 'created_at',
                updatedAt: 'updated_at'
            }
        }
    );
    return db.model('Users', userSchema);
};