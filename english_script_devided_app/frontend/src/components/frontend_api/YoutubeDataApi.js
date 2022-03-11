import axios from "axios";

const youtubeDataApi = async (v) => {

  try {
    const data = await axios.get(
      `https://www.googleapis.com/youtube/v3/videos?id=${v}&key=${process.env.REACT_APP_YOUTUBE_DATA_API_KEY}&part=snippet,contentDetails,statistics,status`
    );

    return data.data
  } catch (error) {
    return false
  }
};

export default youtubeDataApi;