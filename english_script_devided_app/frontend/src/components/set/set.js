
setWord = (word) => {
  this.setIsLoading("isLoadingMeanings", true);
  this.setState({
    word: word
  });
  this.getMeanings();
}
export default setWord;

setMeanings = (meanings) => {
  this.setState({
    meanings: meanings
  });
}
export default setMeanings;

setIsLoading = (name, flag) => {
  if (name == "isLoadingMeanings") {
    this.setState({
      isLoadingMeanings: flag
    });
  } else if (name == "isLoadingTranscript") {
    this.setState({
      isLoadingTranscript: flag
    });
  } else if (name == "isLoadingVideo") {
    this.setState({
      isLoadingVideo: flag
    });
  }
}
export default setIsLoading;

setError = (flag) => {
  this.setState({
    headerError: flag
  })
}
export default setError;

setTime = (time) => {
  this.setState({
    time: time
  });
}
export default setTime;
