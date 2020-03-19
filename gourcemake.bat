rem install gource from https://gource.io/ and setup PATH variable
rem install ffmpeg from https://ffmpeg.zeranoe.com/builds/ and setup PATH variable
rem install git from https://gitforwindows.org/ and setup PATH variable
rem use cmd->gource at this folder to see render
gource  -1280x720 -s .5 -o - | ffmpeg -y -r 60 -f image2pipe -vcodec ppm -i - -vcodec libx264 -preset ultrafast -pix_fmt yuv420p -crf 1 -threads 0 -bf 0 gource.mp4