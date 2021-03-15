using System.IO;
#if __ANDROID__
using Android.Content;
using Android.Graphics;
#else
using System.Drawing;
#endif

namespace SGWW
{
    class FileWrapper
    {
        public static StreamReader OpenFile(Context context, string folder, string fileName)
        {

#if __ANDROID__
            int resourceId = context.Resources.GetIdentifier(fileName, folder, context.PackageName);
            Stream fileStream = context.Resources.OpenRawResource(resourceId);
            return new StreamReader(fileStream);

#else
            //string path = System.IO.Path.GetDirectoryName(System.Reflection.Assembly.GetExecutingAssembly().Location) + @"\Resources\" + folder + @"\" + fileName;
            string path = System.IO.Path.GetDirectoryName(System.Reflection.Assembly.GetExecutingAssembly().Location) + "\\" + fileName;
            FileStream fileStream = File.OpenRead(path);
            return new StreamReader(fileStream);
#endif
        }

        public static Stream OpenFileStream(Context context, string folder, string fileName)
        {

#if __ANDROID__
            int resourceId = context.Resources.GetIdentifier(fileName, folder, context.PackageName);
            return context.Resources.OpenRawResource(resourceId) as Stream;
            
#else
            string path = System.IO.Path.GetDirectoryName(System.Reflection.Assembly.GetExecutingAssembly().Location) + @"\Resources\" + folder + @"\" + fileName;
            return File.OpenRead(path) as Stream;
#endif
        }

        public static Bitmap OpenFileBitmap(Context context, string folder, string fileName)
        {

#if __ANDROID__
        //get Android file resource ID by file name from Resource/drawable/[fileName]
        int id = context.Resources.GetIdentifier(fileName, folder, context.PackageName);
        //try decode image resource from diferent image formats (JPG, PNG) to BitMap (BMP)
        BitmapFactory.Options options = new Android.Graphics.BitmapFactory.Options();
        options.InScaled = false; // No pre-scaling
        return BitmapFactory.DecodeResource(context.Resources, id, options);
#else
            string path = System.IO.Path.GetDirectoryName(System.Reflection.Assembly.GetExecutingAssembly().Location) + @"\Resources\" + folder + @"\" + fileName;
            return new Bitmap(path);
#endif
        }
    }
}



