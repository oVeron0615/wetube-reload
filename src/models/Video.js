import mongoose from "mongoose";

/*
export const formatHashtags = (hashtags) => 
  hashtags.split(",")
  .map((word) => (word.startsWith("#") ? word : `#${word}`));
*/

const videoSchema = new mongoose.Schema({
  title: {type: String, required: true, trim: true, maxLength: 80},
  description: {type: String, required: true, trim: true, minLength: 20 },
  createdAt: {type:Date, required: true, default: Date.now},
  hashtags: [{ type: String, trim: true }],
  meta: {
    views: {type: Number, default: 0, required: true},
    rating: {type: Number, default: 0, required: true},
  },
});

/*
videoSchema.pre("save", async function(){
  console.log(this);
  this.hashtags = this.hashtags[0] //입력된 hashtag가 전부 array의 첫 index에 저장되어 있다.
    .split(",")
    .map((word) => (word.startsWith("#") ? word : `#${word}`));
});
//mongoose middleware
//this : document 그 자체를 가리킨다.
*/
//이런 식으로 middleware를 따로 만들어 hashtag에 대한 처리를 할 수도 있고, 
//위의 주석 처리한 formatHashtags처럼 export할 함수 하나를 만들 수도 있다.
//밑처럼 static을 만들 수도 있다.

//findById와 같은 함수를 직접 만들 수도 있는데, 이를 static이라 한다.
videoSchema.static('formatHashtags', function(hashtags){
  return hashtags.split(",")
  .map((word) => (word.startsWith("#") ? word : `#${word}`));
});

const Video = mongoose.model("Video", videoSchema);
export default Video;