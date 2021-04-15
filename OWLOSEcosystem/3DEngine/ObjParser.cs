//Created Denis Kirin and Vladimir Kovalevich
using System;
using System.Collections;
using System.Collections.Generic;
using System.Globalization;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

#if __ANDROID__
using Android.Content;
using Android.Opengl;
#endif


namespace SGWW
{

    public class Context
    {

    }

    public class Face
    {
        public int vertex = 0;
        public int texture = 0;
        public int normal = 0;
    }

    public class ObjParser
    {

        public List<byte[]> GetVBOs(Context context, string fileName)
        {
            return ParsedObject(context, fileName);
        }

        public List<byte[]> ParsedObject(Context context, string fileName)
        {
            List<byte[]> result = new List<byte[]>();

            int countVertexes = 0;

            string sLine = "";
            ArrayList arrText = new ArrayList();

            ArrayList vertexModel = new ArrayList();
            ArrayList textureModel = new ArrayList();
            ArrayList normalModel = new ArrayList();

            ArrayList facesModel = new ArrayList();

            StreamReader objReader = FileWrapper.OpenFile(context, "raw", fileName);

            while (sLine != null)
            {
                sLine = objReader.ReadLine();
                if (sLine != null)
                    arrText.Add(sLine);
            }
            objReader.Close();

            //Шаг 1
            //получаем и укладываем в список вертексы модели
            foreach (string line in arrText)
            {
                if (line.Contains("v "))
                {

                    string[] splitedLine = line.Split(' ');
                    splitedLine = splitedLine.Where(a => a != "v").ToArray();

                    float[] convertedLine = new float[splitedLine.Length];
                    for (int i = 0; i < splitedLine.Length; i++)
                    {
                        convertedLine[i] = float.Parse(splitedLine[i], new CultureInfo("en-US").NumberFormat);
                    }
                    vertexModel.Add(convertedLine);
                }
            }

            Face face;
            Face[] faces;
            //получаем и укладываем в список вертексы модели
            foreach (string line in arrText)
            {
                if (line.Contains("f "))
                {

                    string[] splitedLine = line.Split(' ');
                    splitedLine = splitedLine.Where(a => a != "f").ToArray();
                    faces = new Face[splitedLine.Length];

                    //string splitedItem = string.Empty;
                    for (int i = 0; i < splitedLine.Length; i++)

                    {
                        string[] splitedItem = splitedLine[i].Split('/');

                        face = new Face();
                        face.vertex = Convert.ToInt32(splitedItem[0]);
                        face.texture = Convert.ToInt32(splitedItem[1]);
                        face.normal = Convert.ToInt32(splitedItem[2]);

                        faces[i] = face;
                    }

                    facesModel.Add(faces);
                }
            }

            //счетчик вершин
            foreach (Face[] facesForCount in facesModel)
            {
                foreach (Face faceForCount in facesForCount)
                {
                    countVertexes++;
                }
            }

            float[] vertexArray = new float[countVertexes * 3];
            int count = 0;
            //собираем массив флоатов с вершинами для построения модели
            foreach (Face[] facesForCount in facesModel)
            {
                foreach (Face faceForCount in facesForCount)
                {
                    int positionVertex = faceForCount.vertex;
                    float[] coordinateVertex = (float[])vertexModel[positionVertex - 1];

                    foreach (float item in coordinateVertex)
                    {
                        vertexArray[count] = item;

                        count++;
                    }
                }
            }

            byte[] byteArrayVertex = new byte[vertexArray.Length * 4];
            Buffer.BlockCopy(vertexArray, 0, byteArrayVertex, 0, byteArrayVertex.Length);
            result.Add(byteArrayVertex);

            // vt ШАГ 2
            //получаем и укладываем в список все координаты текстур модели
            foreach (string line in arrText)
            {
                if (line.Contains("vt "))
                {

                    string[] splitedLine = line.Split(' ');
                    splitedLine = splitedLine.Where(a => a != "vt").ToArray();

                    float[] convertedLine = new float[splitedLine.Length];
                    for (int i = 0; i < splitedLine.Length; i++)
                    {
                        convertedLine[i] = float.Parse(splitedLine[i], new CultureInfo("en-US").NumberFormat);
                    }
                    textureModel.Add(convertedLine);
                }
            }


            float[] textureArray = new float[countVertexes * 2];
            count = 0;
            //собираем массив флоатов с координатоми текстур для построения модели
            foreach (Face[] facesForCount in facesModel)
            {
                foreach (Face faceForCount in facesForCount)
                {
                    int positionTexture = faceForCount.texture;
                    float[] coordinateTexture = (float[])textureModel[positionTexture - 1];

                    foreach (float item in coordinateTexture)
                    {
                        textureArray[count] = item;

                        count++;
                    }
                }
            }


            byte[] byteArrayTexture = new byte[textureArray.Length * 4];
            Buffer.BlockCopy(textureArray, 0, byteArrayTexture, 0, byteArrayTexture.Length);
            result.Add(byteArrayTexture);



            // vn ШАГ 3
            //получаем и укладываем в список все координаты текстур модели
            foreach (string line in arrText)
            {
                if (line.Contains("vn "))
                {

                    string[] splitedLine = line.Split(' ');
                    splitedLine = splitedLine.Where(a => a != "vn").ToArray();

                    float[] convertedLine = new float[splitedLine.Length];
                    for (int i = 0; i < splitedLine.Length; i++)
                    {
                        convertedLine[i] = float.Parse(splitedLine[i], new CultureInfo("en-US").NumberFormat);
                    }
                    normalModel.Add(convertedLine);
                }
            }


            float[] normalArray = new float[countVertexes * 3];
            count = 0;
            //собираем массив флоатов с координатоми нормалей для построения модели
            foreach (Face[] facesForCount in facesModel)
            {
                foreach (Face faceForCount in facesForCount)
                {
                    int positionNormal = faceForCount.normal;
                    float[] coordinateNormal = (float[])normalModel[positionNormal - 1];

                    foreach (float item in coordinateNormal)
                    {
                        normalArray[count] = item;

                        count++;
                    }
                }
            }


            byte[] byteArrayNormal = new byte[normalArray.Length * 4];
            Buffer.BlockCopy(normalArray, 0, byteArrayNormal, 0, byteArrayNormal.Length);
            result.Add(byteArrayNormal);
            return result;
        }

    }
}
