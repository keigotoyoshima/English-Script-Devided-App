import axios from "axios";

const dictionaryApi = async (language, word) => {
  try {
    const data = await axios.get(
      `https://api.dictionaryapi.dev/api/v2/entries/${language}/${word}`
      // `https://api.dictionaryapi.dev/api/v2/entries/en/plane`
    );
    return data.data
  } catch (error) {
    // console.log(error);
    return false
  }
};

export default dictionaryApi;