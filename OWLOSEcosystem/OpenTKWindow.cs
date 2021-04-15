using LearnOpenTK.Common;
using OpenTK.Graphics.OpenGL4;
using OpenTK.Windowing.Common;
using OpenTK.Windowing.GraphicsLibraryFramework;
using OpenTK.Windowing.Desktop;
using System.Collections.Generic;
using SGWW;
using OpenTK.Mathematics;

namespace OWLOSEcosystem
{
    // Be warned, there is a LOT of stuff here. It might seem complicated, but just take it slow and you'll be fine.
    // OpenGL's initial hurdle is quite large, but once you get past that, things will start making more sense.
    public class OpenTKWindow : GameWindow
    {

        // These are the handles to OpenGL objects. A handle is an integer representing where the object lives on the
        // graphics card. Consider them sort of like a pointer; we can't do anything with them directly, but we can
        // send them to OpenGL functions that need them.

        // What these objects are will be explained in OnLoad.
        private int _vertexBufferObject;
        private int _elementBufferObject;

        private int _vertexArrayObject;
        private int _elementArrayObject;



        private List<byte[]> obj;

        private int vertexLocation;
        private int texCoordLocation;



        // I have removed the view and projection matrices as we dont need them here anymore
        // They can now be found in the new camera class

        // We need an instance of the new camera class so it can manage the view and projection matrix code
        // We also need a boolean set to true to detect whether or not the mouse has been moved for the first time
        // Finally we add the last position of the mouse so we can calculate the mouse offset easily
        private Camera _camera;

        private bool _firstMove = true;

        private Vector2 _lastPos;

        private double _time;

        private Texture _texture;


        // This class is a wrapper around a shader, which helps us manage it.
        // The shader class's code is in the Common project.
        // What shaders are and what they're used for will be explained later in this tutorial.
        private Shader _shader;

        public OpenTKWindow(GameWindowSettings gameWindowSettings, NativeWindowSettings nativeWindowSettings)
            : base(gameWindowSettings, nativeWindowSettings)
        {
        }

        // Now, we start initializing OpenGL.
        protected override void OnLoad()
        {
            // This will be the color of the background after we clear it, in normalized colors.
            // Normalized colors are mapped on a range of 0.0 to 1.0, with 0.0 representing black, and 1.0 representing
            // the largest possible value for that channel.
            // This is a deep green.
            GL.ClearColor(0.2f, 0.3f, 0.3f, 1.0f);
            GL.Enable(EnableCap.DepthTest);

            // We need to send our vertices over to the graphics card so OpenGL can use them.
            // To do this, we need to create what's called a Vertex Buffer Object (VBO).
            // These allow you to upload a bunch of data to a buffer, and send the buffer to the graphics card.
            // This effectively sends all the vertices at the same time.

            // First, we need to create a buffer. This function returns a handle to it, but as of right now, it's empty.

            ObjParser objParser = new ObjParser();
            obj = objParser.GetVBOs(null, "Shaders\\denhouse1.obj");
            //obj = objParser.GetVBOs(null, "Shaders\\cube.obj");


            int vsize = obj[0].Length;
            float[] vArray = new float[vsize / 4];
            //Copy source array data to floatArray (convert bytes to floats)
            System.Buffer.BlockCopy(obj[0], 0, vArray, 0, (int)vsize);

            int tsize = obj[1].Length;
            float[] tArray = new float[tsize / 4];
            //Copy source array data to floatArray (convert bytes to floats)
            System.Buffer.BlockCopy(obj[1], 0, tArray, 0, (int)tsize);

            int rFloatSize = vsize / 4 + tsize / 4;
            float[] rArray = new float[rFloatSize];
            uint[] ind = new uint[rFloatSize / 5];

            int vcount = 0;
            int tcount = 0;
            uint indCount = 0;
            for (int i=0; i < rFloatSize; i+=5)
            {
                rArray[i + 0] = vArray[vcount + 0];
                rArray[i + 1] = vArray[vcount + 1];
                rArray[i + 2] = vArray[vcount + 2];
                rArray[i + 3] = tArray[tcount + 0];
                rArray[i + 4] = tArray[tcount + 1];
                vcount += 3;
                tcount += 2;

                ind[indCount] = indCount;
                indCount++;
            }


            // shader.frag has been modified yet again, take a look at it as well.
            _shader = new Shader("Shaders/shader.vert", "Shaders/shader.frag");
            _shader.Use();

            //Vertexes --------------------------------
            _vertexArrayObject = GL.GenVertexArray();
            GL.BindVertexArray(_vertexArrayObject);

            _vertexBufferObject = GL.GenBuffer();
            GL.BindBuffer(BufferTarget.ArrayBuffer, _vertexBufferObject);
            GL.BufferData(BufferTarget.ArrayBuffer, rFloatSize * sizeof(float), rArray, BufferUsageHint.StaticDraw);

            _elementBufferObject = GL.GenBuffer();
            GL.BindBuffer(BufferTarget.ElementArrayBuffer, _elementBufferObject);
            GL.BufferData(BufferTarget.ElementArrayBuffer, rFloatSize / 5 * sizeof(uint), ind, BufferUsageHint.StaticDraw);

            // The shaders have been modified to include the texture coordinates, check them out after finishing the OnLoad function.
            _shader = new Shader("Shaders/shader.vert", "Shaders/shader.frag");
            _shader.Use();

            // Because there's now 5 floats between the start of the first vertex and the start of the second,
            // we modify this from 3 * sizeof(float) to 5 * sizeof(float).
            // This will now pass the new vertex array to the buffer.
            var vertexLocation = _shader.GetAttribLocation("aPosition");
            GL.EnableVertexAttribArray(vertexLocation);
            GL.VertexAttribPointer(vertexLocation, 3, VertexAttribPointerType.Float, false, 5 * sizeof(float), 0);

            // Next, we also setup texture coordinates. It works in much the same way.
            // We add an offset of 3, since the first vertex coordinate comes after the first vertex
            // and change the amount of data to 2 because there's only 2 floats for vertex coordinates
            var texCoordLocation = _shader.GetAttribLocation("aTexCoord");
            GL.EnableVertexAttribArray(texCoordLocation);
            GL.VertexAttribPointer(texCoordLocation, 2, VertexAttribPointerType.Float, false, 5 * sizeof(float), 3 * sizeof(float));


            //_texture = Texture.LoadFromFile("Shaders/den_housetextutre.png");
            _texture = Texture.LoadFromFile("Shaders/housetex1.png");
            
            //_texture = Texture.LoadFromFile("Shaders/skin.png");
            // Texture units are explained in Texture.cs, at the Use function.
            // First texture goes in texture unit 0.
            _texture.Use(TextureUnit.Texture0);


           


            _camera = new Camera(Vector3.UnitZ * 3, Size.X / (float)Size.Y);

            

            // Setup is now complete! Now we move to the OnRenderFrame function to finally draw the triangle.

            base.OnLoad();
        }

        // Now that initialization is done, let's create our render loop.
        protected override void OnRenderFrame(FrameEventArgs e)
        {
            // This clears the image, using what you set as GL.ClearColor earlier.
            // OpenGL provides several different types of data that can be rendered.
            // You can clear multiple buffers by using multiple bit flags.
            // However, we only modify the color, so ColorBufferBit is all we need to clear.
            GL.Clear(ClearBufferMask.ColorBufferBit | ClearBufferMask.DepthBufferBit);

            // To draw an object in OpenGL, it's typically as simple as binding your shader,
            // setting shader uniforms (not done here, will be shown in a future tutorial)
            // binding the VAO,
            // and then calling an OpenGL function to render.


            // Bind the shader
            _shader.Use();


            var model = Matrix4.Identity * Matrix4.CreateRotationX((float)MathHelper.DegreesToRadians(_time));
            _shader.SetMatrix4("model", model);
            _shader.SetMatrix4("view", _camera.GetViewMatrix());
            _shader.SetMatrix4("projection", _camera.GetProjectionMatrix());

            // Bind the VAO

            //GL.BindBuffer(BufferTarget.ArrayBuffer, _vertexBufferObject);
            //GL.EnableVertexAttribArray(vertexLocation);
            //GL.BindVertexArray(_vertexArrayObject);
            //GL.EnableVertexAttribArray(vertexLocation);
            //GL.VertexAttribPointer(vertexLocation, 3, VertexAttribPointerType.Float, false, 3 * sizeof(float), 0);

            GL.BindVertexArray(_vertexArrayObject);
            //GL.BindBuffer(BufferTarget.ArrayBuffer, _vertexBufferObject);
            //GL.EnableVertexAttribArray(vertexLocation);
            //GL.VertexAttribPointer(vertexLocation, 3, VertexAttribPointerType.Float, false, 3 * sizeof(float), 0);
           // GL.BindBuffer(BufferTarget.ArrayBuffer, 0); // unbind VBO
           // GL.BindVertexArray(0); // unbind VAO


            //GL.BindVertexArray(_elementBufferObject);
            //GL.BindBuffer(BufferTarget.ElementArrayBuffer, _elementBufferObject);
            //GL.EnableVertexAttribArray(texCoordLocation);
            //GL.VertexAttribPointer(texCoordLocation, 2, VertexAttribPointerType.Float, false, 2 * sizeof(float), 0);
            //GL.BindBuffer(BufferTarget.ArrayBuffer, 0); // unbind VBO
          //  GL.BindVertexArray(0); // unbind VAO


            _texture.Use(TextureUnit.Texture0);


            // And then call our drawing function.
            // For this tutorial, we'll use GL.DrawArrays, which is a very simple rendering function.
            // Arguments:
            //   Primitive type; What sort of geometric primitive the vertices represent.
            //     OpenGL used to support many different primitive types, but almost all of the ones still supported
            //     is some variant of a triangle. Since we just want a single triangle, we use Triangles.
            //   Starting index; this is just the start of the data you want to draw. 0 here.
            //   How many vertices you want to draw. 3 for a triangle.
            GL.DrawArrays(PrimitiveType.Triangles, 0, obj[0].Length / 4 / 3);
            

            // OpenTK windows are what's known as "double-buffered". In essence, the window manages two buffers.
            // One is rendered to while the other is currently displayed by the window.
            // This avoids screen tearing, a visual artifact that can happen if the buffer is modified while being displayed.
            // After drawing, call this function to swap the buffers. If you don't, it won't display what you've rendered.
            SwapBuffers();

            // And that's all you have to do for rendering! You should now see a yellow triangle on a black screen.
            base.OnRenderFrame(e);
        }

        protected override void OnUpdateFrame(FrameEventArgs e)
        {
            if (!IsFocused) // check to see if the window is focused
            {
                return;
            }

            var input = KeyboardState;

            if (input.IsKeyDown(Keys.Escape))
            {
                Close();
            }

            const float cameraSpeed = 1.5f;
            const float sensitivity = 0.2f;

            if (input.IsKeyDown(Keys.W))
            {
                _camera.Position += _camera.Front * cameraSpeed * (float)e.Time; // Forward
            }

            if (input.IsKeyDown(Keys.S))
            {
                _camera.Position -= _camera.Front * cameraSpeed * (float)e.Time; // Backwards
            }
            if (input.IsKeyDown(Keys.A))
            {
                _camera.Position -= _camera.Right * cameraSpeed * (float)e.Time; // Left
            }
            if (input.IsKeyDown(Keys.D))
            {
                _camera.Position += _camera.Right * cameraSpeed * (float)e.Time; // Right
            }
            if (input.IsKeyDown(Keys.Space))
            {
                _camera.Position += _camera.Up * cameraSpeed * (float)e.Time; // Up
            }
            if (input.IsKeyDown(Keys.LeftShift))
            {
                _camera.Position -= _camera.Up * cameraSpeed * (float)e.Time; // Down
            }

            // Get the mouse state
            var mouse = MouseState;

            if (_firstMove) // this bool variable is initially set to true
            {
                _lastPos = new Vector2(mouse.X, mouse.Y);
                _firstMove = false;
            }
            else
            {
                // Calculate the offset of the mouse position
                var deltaX = mouse.X - _lastPos.X;
                var deltaY = mouse.Y - _lastPos.Y;
                _lastPos = new Vector2(mouse.X, mouse.Y);

                // Apply the camera pitch and yaw (we clamp the pitch in the camera class)
                _camera.Yaw += deltaX * sensitivity;
                _camera.Pitch -= deltaY * sensitivity; // reversed since y-coordinates range from bottom to top
            }

            base.OnUpdateFrame(e);
        }

        // In the mouse wheel function we manage all the zooming of the camera
        // this is simply done by changing the FOV of the camera
        protected override void OnMouseWheel(MouseWheelEventArgs e)
        {
            _camera.Fov -= e.OffsetY;
            base.OnMouseWheel(e);
        }

        protected override void OnResize(ResizeEventArgs e)
        {
            GL.Viewport(0, 0, Size.X, Size.Y);
            // We need to update the aspect ratio once the window has been resized
            _camera.AspectRatio = Size.X / (float)Size.Y;
            base.OnResize(e);
        }

        protected override void OnUnload()
        {
            GL.BindBuffer(BufferTarget.ArrayBuffer, 0);
            GL.BindVertexArray(0);
            GL.UseProgram(0);

            GL.DeleteBuffer(_vertexBufferObject);
            GL.DeleteVertexArray(_vertexArrayObject);

            GL.DeleteProgram(_shader.Handle);

            base.OnUnload();
        }
    }
}
