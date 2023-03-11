const db = require("../data/database");
const mongodb = require("mongodb");
const objectId = mongodb.ObjectId;

class Post {
  constructor(name, title, content, id) {
    this.title = title;
    this.content = content;
    this.id = id;
    this.name = name;
  }
  static async fetchAll() {
    const data = await db.getDb().collection("blogs").find().toArray();
    return data
  }

  async fetch() {
    if(!this.id) {
      return
    }

    const postDoc = await db
      .getDb()
      .collection("blogs")
      .findOne({ _id: new objectId(this.id) })

      return postDoc
  }

  async save() {
    const result = await db
      .getDb()
      .collection("blogs")
      .insertMany([
        { name: this.name, content: this.content, title: this.title },
      ]);
    return result;
  }

  async update() {
    const updatedContent = await db
      .getDb()
      .collection("blogs")
      .updateOne(
        { _id: new objectId(this.id) },
        { $set: { title: this.title, content: this.content } }
      );
    return updatedContent;
  }

  async delete() {
    await db
      .getDb()
      .collection("blogs")
      .deleteOne({ _id: new objectId(this.id) });
  }
}

module.exports = Post;
