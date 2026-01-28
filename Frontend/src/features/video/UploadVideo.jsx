import { useContext, useEffect, useState } from "react";
import AlertModal from "../../components/common/Alert";
import Context from '../../Context/Context';
import api from "../../api/axios";
import { Link, useNavigate } from "react-router-dom";


const MAX_FILE_SIZE = 500 * 1024 * 1024; 
const MAX_FILE_SIZE_Thumbnail = 2 * 1024 * 1024; 




export default function UploadVideo() {
  const [step, setStep] = useState(1);

  const [videoFile, setVideoFile] = useState(null);
  const [videoFileName, setVideoFileName] = useState(null);

  const [firstRender,setFirstRender] = useState(true);


  const [thumbnail, setThumbnail] = useState(null);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [visibility, setVisibility] = useState("public");

  const [category, setCategory] = useState("sports");
  const [language, setLanguage] = useState("English");
  const [location, setLocation] = useState("India");
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState("");

  const [uploadDisable,setUploadDisable] = useState(false);

 
  const [progress, setProgress] = useState(0);


  const [processingPercent, setProcessingPercent] = useState(0);
  const [processing, setProcessing] = useState(false);



  const [videoId,setVideoId] = useState('');
  const [uploading, setUploading] = useState(false);

  const [domain,setDomain] = useState('');
  const[enablePublish,setEnablePublish] = useState(false);


  const dateUploaded = new Date()
    .toLocaleDateString("en-GB")
    .replaceAll("/", "-");



  
  const obj= useContext(Context);

  const [showFileModal,setShowFileModal] = useState({check:false,message:false});

  
  const [loading, setLoading] = useState(false);
  const [videoURL,setVideoURL] = useState(null);


  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > MAX_FILE_SIZE) {
      // alert("File size must be less than 5MB");
      setShowFileModal({check:true, message:`File size must be less than ${(MAX_FILE_SIZE/1024)/1024}MB`})
      e.target.value = ""; 
      return;
    }
    setVideoFileName(file.name);
    setVideoFile(file);
  };




  
  const handleFileChangeThumbnail = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > MAX_FILE_SIZE_Thumbnail) {
      // alert("File size must be less than 5MB");
      setShowFileModal({check:true, message:`File size must be less than ${(MAX_FILE_SIZE_Thumbnail/1024)/1024}MB`})
      e.target.value = ""; 
      return;
    }

    setThumbnail(file);
  };


  const startUpload = () => {
    if (!videoFile) return setShowFileModal({check:true, message:`Please Select a Video File`})

    setUploading(true);
    setProgress(0);

    if(obj.isLogIn){

      const formData = new FormData();

      formData.append('video',videoFile)

      setUploadDisable(true);

      api.post('/api/v1/videos/uploadVideo',formData, {
          onUploadProgress: (e) => {
            setProgress(Math.round((e.loaded * 100) / e.total));
          }
      }).then((res)=>{
        if(res?.data?.data?.videoId){
          setVideoId(res.data.data.videoId);
          localStorage.setItem('videoId',res.data.data.videoId);
          localStorage.setItem('videoFileName',videoFile.name);
          
          setUploading(false);
          setProcessing(true);
          setProcessingPercent(res.data.data.processingPercentage);
        }else{
          throw err
        }
      }).catch(err=>{
        setUploadDisable(false);
        
        setShowFileModal({"check":true, "message":err.message})
      })


    }
  };

  const addTag = (value) => {
    const cleaned = value.trim();
    if (!cleaned || tags.includes(cleaned)) return;
    setTags((prev) => [...prev, cleaned]);
  };

  const handleTagChange = (e) => {
    const value = e.target.value;
    if (value.includes(",")) {
      value
        .split(",")
        .filter(Boolean)
        .forEach(addTag);
      setTagInput("");
    } else {
      setTagInput(value);
    }
  };

  const removeTag = (tag) => {
    setTags(tags.filter((t) => t !== tag));
  };

  const handlePublish = async() => {

    if(title.length ==0 || description.length==0 || category=='None'){
      setShowFileModal({check:true,message:"Please Fill the Required Fields"})
      return;
    }
    if(!thumbnail){
      setShowFileModal({check:true,message:"Please Upload a Thumbnail*"});
      return;
    }
    if(!videoId){
        setShowFileModal({check:true,message:"Please Upload the Video"});
      return;
    }
    setLoading(true);

    const formData = new FormData();

    formData.append('thumbnail',thumbnail);
    formData.append('data',JSON.stringify({
      "title" : title,
      "description" : description,
      "category" : category,
      "language" : language,
      "dateUploaded" : dateUploaded,
      "location" : location,
      "visibility" : visibility,
      "tags":tags,
      "videoId":videoId,

    }))

    await api.post('/api/v1/videos/uploadVideoDetails',formData,{headers:
      {"Content-Type" : "multipart/form-data"}
    }).then(res=>{
      if(res?.data?.data?.videoId){
        setVideoURL(`/video/${res.data.data.videoId}`);
        setVideoFile(null);
        setVideoId(null);
        setVideoFileName(null);
        setThumbnail(null);
        setProcessing(0);
        setProgress(0);
        setUploading(false);
        setProcessing(false);
        setTitle(null);
        setDescription(null);
        setTags([]);
        localStorage.removeItem('videoId');
        localStorage.removeItem('videoFileName');

        setVisibility("public");
        setCategory("sports");
        setLanguage("English");
        setLocation("India");

      }else{
        throw err;
      }
    }).catch(err=>{
      console.log(err);
      setShowFileModal({check:true,message:err.message});
    })

    const timer =  setTimeout(()=>{
      setLoading(false);
    },1400);

    // clearTimeout(timer);
  };


  useEffect(()=>{

    if(firstRender){
        setDomain(window.location.origin);
        if(localStorage.getItem('videoId') && localStorage.getItem('videoFileName')){
          setVideoId(localStorage.getItem('videoId'))
          setVideoFileName(localStorage.getItem('videoFileName'));
          setProcessing(true);
        }
        setFirstRender(false);
    }

    const fectchDetails =async ()=>{

    if(processing && videoId){
        
        await api.post('/api/v1/videos/getProgress',{"videoId":videoId}).then(res=>{
          
          if(res?.data?.data?.processingPercentage){
              setProcessingPercent(res.data.data.processingPercentage);
            }
          if(res.data.data.processingPercentage == 100){
            setProgress(100);
            setProcessing(false);
            setUploadDisable(true);
            }
          })
        
        if(processingPercent ==100){
          setProcessing(false);
        }
      }

    }
    fectchDetails();




    let intervalId = setInterval(fectchDetails, 500);

    return () => clearInterval(intervalId);

  },[processing,processingPercent])




  return (
    <>
    <div className="flex justify-center items-center h-screen bg-gray-100 p-6 overflow-y-auto scrollbar-custom ">
     
         {!loading && !videoURL &&
         <>  <div className="w-full max-w-4xl  bg-white rounded-xl shadow-lg p-6 space-y-6 mt-30 md:mt-3">              
            {uploading && !processing && (
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Uploading...</span>
                  <span>{progress}%</span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full">
                  <div
                    className="h-full bg-indigo-600 transition-all"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            )}
            {!uploading && processing && (
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Processing...</span>
                  <span>{processingPercent}%</span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full">
                  <div
                    className="h-full bg-indigo-600 transition-all"
                    style={{ width: `${processingPercent}%` }}
                  />
                </div>
              </div>
            )}
            {!uploading && !processing && (processingPercent===100) && (
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Video Processing has been completed</span>
                  <span>{100}%</span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full">
                  <div
                    className="h-full bg-indigo-600 transition-all"
                    style={{ width: `${100}%` }}
                  />
                </div>
              </div>
            )}




        <h2 className="text-xl font-semibold">
          Upload Video — Step {step}/2
        </h2>

        {step === 1 && (
          <>
           
            <div className="border-2 border-dashed rounded-lg p-6 text-center">
              <input
                type="file"
                accept="video/*"
                hidden
                id="videoUpload"
                onChange={handleFileChange}
                disabled={uploadDisable}
              />
              <label htmlFor="videoUpload" className="cursor-pointer">
                <div className={`mx-auto h-14 w-14 rounded-full bg-indigo-100 flex items-center justify-center ${uploadDisable?'text-gray-700':'text-indigo-600'} text-2xl`}>
                  <i className="fa-solid fa-arrow-up-from-bracket"></i>
                </div>
                <p className="mt-3 font-medium">
                  {videoFileName?videoFileName : "Select video"}
                </p>
              </label>
            </div>



     
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
         
              <div className="md:col-span-2 space-y-4">
                <div>
                  <label className="text-sm font-medium">Title</label>
                  <input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="mt-1 w-full border rounded-md p-2"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium">Description</label>
                  <textarea
                    rows="4"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="mt-1 w-full border rounded-md p-2 resize-none"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium">Visibility</label>
                  <select
                    value={visibility}
                    onChange={(e) => setVisibility(e.target.value)}
                    className="mt-1 w-full border rounded-md p-2"
                  >
                    <option value="public">Public</option>
                    <option value="private">Private</option>
                    <option value="unlisted">Unlisted</option>
                  </select>
                </div>

                <p className="text-xs text-gray-500">
                  Date uploaded: {dateUploaded}
                </p>
              </div>


              <div>
                <label className="text-sm font-medium">Thumbnail</label>
                <div className="mt-2 border rounded-lg p-2 text-center">
                  {thumbnail ? (
                    <img
                      src={URL.createObjectURL(thumbnail)}
                      className="w-full object-cover rounded-md aspect-video"
                    />
                  ) : (
                    <div className="h-24 bg-gray-100 flex items-center justify-center text-gray-400 text-sm">
                      No thumbnail
                    </div>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    hidden
                    id="thumbUpload"
                    onChange={handleFileChangeThumbnail}
                  />
                  <label
                    htmlFor="thumbUpload"
                    className="block mt-2 text-indigo-600 cursor-pointer text-xs"
                  >
                    Upload thumbnail
                  </label>
                </div>
              </div>
            </div>

            <div className="flex justify-between">
              <button
                onClick={startUpload}
                className="px-4 py-2 bg-gray-200 rounded-md                         disabled:bg-gray-700
                        disabled:cursor-not-allowed
                        disabled:opacity-60"
                disabled={uploadDisable}

              >
                Start Upload
              </button>
              <button
                onClick={() => setStep(2)}
                disabled={progress < 100}
                className={`px-4 py-2 rounded-md text-white ${
                  progress < 100
                    ? "bg-gray-400"
                    : "bg-indigo-600 hover:bg-indigo-700"
                }`}
              >
                Next
              </button>
            </div>
          </>
        )}

        {step === 2 && (
          <>
            <div className="space-y-4">

    
              <div>
                <label className="text-sm font-medium">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="mt-1 w-full border rounded-md p-2"
                >
                  <option value="sports">Sports</option>
                  <option value="education">Education</option>
                  <option value="music">Music</option>
                  <option value="entertainment">Entertainment</option>
                </select>
              </div>

     
              <div>
                <label className="text-sm font-medium">Language</label>
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="mt-1 w-full border rounded-md p-2"
                >
                  <option value="english">English</option>
                  <option value="hindi">Hindi</option>
                  <option value="marathi">Marathi</option>
                  <option value="tamil">Tamil</option>
                </select>
              </div>

  
              <div>
                <label className="text-sm font-medium">Location</label>
                <input
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="mt-1 w-full border rounded-md p-2"
                />
              </div>


              <div>
                <label className="text-sm font-medium">Tags</label>
                <div className="mt-1 border rounded-md p-2 min-h-[90px]">
                  <div className="flex flex-wrap gap-2 mb-2">
                    {tags.map((tag) => (
                      <span
                        key={tag}
                        className="flex items-center gap-1 bg-indigo-100 text-indigo-700 px-2 py-1 rounded-full text-xs"
                      >
                        {tag}
                        <button
                          onClick={() => removeTag(tag)}
                          className="text-indigo-500 hover:text-indigo-700"
                        >
                          ✕
                        </button>
                      </span>
                    ))}
                  </div>
                  <textarea
                    rows="2"
                    value={tagInput}
                    onChange={handleTagChange}
                    placeholder="Type tags separated by comma"
                    className="w-full outline-none resize-none"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-between">
              <button
                onClick={() => setStep(1)}
                className="px-4 py-2 bg-gray-200 rounded-md"
              >
                Previous
              </button>
              <button
                disabled ={(videoId.length>0 && thumbnail!=null && title.length>0 && description.length>0 && category!='None' && processingPercent===100)?false:true}
                onClick={handlePublish}
                className="px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:bg-gray-700
                        disabled:cursor-not-allowed
                        disabled:opacity-60"
              >
                Publish
              </button>
            </div>
          </>
        )}
        
        
        </div>
          </>
        }

        {!loading && videoURL && <>
        <div className="w-full max-w-4xl  bg-white rounded-xl shadow-lg p-6  mt-30 md:mt-3 flex justify-center items-center text-center">
          <div><i className="fa-solid fa-circle-check text-green-700 text-5xl m-3"></i></div>
          
          <div>Video Uploaded Successfully and It is available at the following URL : <Link className="text-blue-500" to={`${domain}${videoURL}`}>{`${domain}${videoURL}`}</Link></div>
        </div>
        </>}

      {loading && <div className="w-full text-9xl text-indigo-600 flex justify-center items-center"><i className="fa-solid fa-snowflake fa-spin fa-spin-reverse"></i></div>}
      </div>
    

        <AlertModal open={showFileModal.check} message={showFileModal.message} onClose={()=>{setShowFileModal({check:false,message:false})}}  color="bg-white"/>

        </>
  );
}
