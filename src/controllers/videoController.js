import Video from "../models/Video"; 
//default export와 default export가 아닌 export를 동시에 할 수도 있다.

export const home = async (req, res) => {
    const videos = await Video.find({}).sort({createdAt:"asc"});
    return res.render("home", { pageTitle: "Home", videos });
};

export const watch = async (req, res) => 
{
    const {id} = req.params;
    const video = await Video.findById(id); //id를 통해 video를 찾는다.(mongoose에서 지원)
    if(!video) //if(video == null)
        return res.render("404", {pageTitle:"Video not found."});
    return res.render("watch", {pageTitle : video.title, video});
};

export const getEdit = async (req, res) => {
    const {id} = req.params;
    const video = await Video.findById(id);
    if(!video)
        return res.render("404", {pageTitle:"Video not found."});
    return res.render("edit", {pageTitle : `Edit ${video.title}`, video});
    //여기에서는 exist를 쓰지 않았는데, video 객체 자체를 edit template에 보내야 하기 때문이다.
};

export const postEdit = async (req, res) => {
    const {id} = req.params;
    const {title, description, hashtags} = req.body;
    const video = await Video.exists({_id: id});
    //exist : 넣어준 argument의 값이 존재하는지 확인해 bool type으로 return
    //argument는 모든 조건이 될 수 있다.(title, description 등)
    //현재는 return받은 id로 해당 id를 가진 video가 존재하는지 확인하고 있다.
    if(!video)
        return res.render("404", {pageTitle:"Video not found."});
    await Video.findByIdAndUpdate(id, {
        title,
        description,
        hashtags: Video.formatHashtags(hashtags), 
        //static 함수 - 내가 만든 model function
    });
    //findByIdAndUpdate : video를 id로 찾은 다음 update한다.
    return res.redirect(`/videos/${id}`);
};

export const getUpload = (req, res) => {
    return res.render("upload", {pageTitle: "Upload Video"});
};

export const postUpload = async (req, res) => {
    const {title, description, hashtags} = req.body;
    try{
        await Video.create({
            title,
            description,
            hashtags: Video.formatHashtags(hashtags), //static 함수
        });
        return res.redirect("/");
    }
    catch(error){
        return res.render("upload", {
            pageTitle: "Upload Video", 
            errorMessage: error._message,
        });
    }
};

export const deleteVideo = async (req, res) => {
    const {id} = req.params;
    await Video.findByIdAndDelete(id);
    return res.redirect("/");
}

export const search = async (req, res) => {
    const {keyword} = req.query;
    let videos = [];
    if(keyword){
        videos = await Video.find({
            title: {
                $regex: new RegExp(`${keyword}$`, "i"),
                //정규 표현식(regular expression)
                //mongodb, mdn regex 참조
            },
        });
    }
    return res.render("search", {pageTitle: "Search", videos});
}