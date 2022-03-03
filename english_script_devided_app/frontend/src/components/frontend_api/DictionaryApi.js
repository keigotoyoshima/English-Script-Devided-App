import axios from "axios";

const dictionaryApi = async (language, word) => {
  try {
    const data = await axios.get(
      `https://api.dictionaryapi.dev/api/v2/entries/${language}/${word}`
      // `https://api.dictionaryapi.dev/api/v2/entries/en/plane`
    );
    console.log(data.data, 'int dictionaryApi');
    return data.data
  } catch (error) {
    console.log(error);
  }
};

export default dictionaryApi;