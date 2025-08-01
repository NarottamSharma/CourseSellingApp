const { Schema } = require("mongoose");
const ObjectId = Schema.ObjectId();

const userSchema = Schema({
    email: { String, unique: true },
    password: String,
    firstName: String,
    lastName: String,
});

const adminSchema = Schema({
    email: { String, unique: true },
    password: String,
    firstName: String,
    lastName: String,
});

const courseSchema = Schema({
    title: String,
    description: String,
    price: Number,
    imageUrl: String,
    creatorId: ObjectId,
});

const purchaseSchema = Schema({
    userId:ObjectId,
    courseId:ObjectId,
});

const userModel = mongoose.Model("user", userSchema);
const adminModel = mongoose.Model("user", adminSchema);
const courseModel = mongoose.Model("user", courseSchema);
const purchaseModel = mongoose.Model("user", purchaseSchema);


module.export ={
    
}