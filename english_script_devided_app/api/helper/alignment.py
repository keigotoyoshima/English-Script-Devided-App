# original-functions
class db_library:
  def getCountOf10Minites(duration):
      count = int(duration)
      if count%10==0:
          count = count//10
      else:
          count = count//10 + 1
      
      return count
  
  def removeIrregular(capture):
      capture = capture.replace('...', '.')
      capture = capture.replace('?!', '?')
      capture = capture.replace('!?', '!')
      capture = capture.replace('!!', '!')
      capture = capture.replace('??', '?')
      capture = capture.replace('.?', '?')
      capture = capture.replace('.!', '!')
      capture = capture.replace('\n', '')
      capture = capture.replace('\r', '')
      
      return capture.replace('.', '.  \n').replace('?', '?  \n').replace('!', '!  \n')

  # def getContentsWithAlignment(contents, num):
  #   contents = contents
  #   if num == 1:
  #       contents =  contents.capture1
  #   elif num == 2:
  #       contents =  contents.capture2
  #   elif num == 3:
  #       contents =  contents.capture3
  #   elif num == 4:
  #       contents =  contents.capture4
  #   elif num == 5:
  #       contents =  contents.capture5
  #   elif num == 6:
  #       contents =  contents.capture6
  #   elif num == 7:
  #       contents =  contents.capture7
  #   elif num == 8:
  #       contents =  contents.capture8
  #   elif num == 9:
  #       contents =  contents.capture9
  #   elif num == 10:
  #       contents =  contents.capture10
  #   elif num == 11:
  #       contents =  contents.capture11
  #   elif num == 12:
  #       contents =  contents.capture12
  #   elif num == 13:
  #       contents =  contents.capture13
  #   elif num == 14:
  #       contents =  contents.capture14
  #   elif num == 15:
  #       contents =  contents.capture15
    
  #   return contents.replace('.', '.  \n').replace('?', '?  \n').replace('!', '!  \n')


