using OpenTK.Mathematics;
using OpenTK.Windowing.Desktop;
using System;
using System.Collections.Generic;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Data;
using System.Windows.Documents;
using System.Windows.Input;
using System.Windows.Media;
using System.Windows.Media.Imaging;
using System.Windows.Navigation;
using System.Windows.Shapes;

namespace OWLOSEcosystem
{
    /// <summary>
    /// Interaction logic for MainWindow.xaml
    /// </summary>
    public partial class MainWindow : Window
    {
        private OpenTKWindow window;
        private BuildWindow bwindow;

        private double dpi = 1.5f;
        public MainWindow()
        {
            InitializeComponent();
            MakeObj_Click(null, null);
        }

        private void GoOpenGL_Click(object sender, RoutedEventArgs e)
        {
            var nativeWindowSettings = new NativeWindowSettings()
            {
                Size = new Vector2i(800, 600),
                Title = "LearnOpenTK - Creating a Window",
            };

            // To create a new window, create a class that extends GameWindow, then call Run() on it.
            using (window = new OpenTKWindow(GameWindowSettings.Default, nativeWindowSettings))
            {
                window.Load += Window_Load;
                window.FocusedChanged += Window_FocusedChanged;                
                window.Move += Window_Move;
                window.Resize += Window_Resize;
                window.Closed += Window_Closed;
                window.MouseMove += Window_MouseMove;
                
                window.Run();


            }
        }

        private void Window_Resize(OpenTK.Windowing.Common.ResizeEventArgs obj)
        {
            this.Left = window.Location.X / dpi;
            this.Top = window.Location.Y / dpi;
            this.Width = window.Size.X / dpi;
            this.Height = window.Size.Y / dpi;

        }

        private void Window_Move(OpenTK.Windowing.Common.WindowPositionEventArgs obj)
        {
            
            this.Left = window.Location.X / dpi;
            this.Top = window.Location.Y / dpi;
            this.Width = window.Size.X / dpi;
            this.Height = window.Size.Y / dpi;

        }

        private void Window_FocusedChanged(OpenTK.Windowing.Common.FocusedChangedEventArgs obj)
        {
            if (obj.IsFocused)
            {
                this.Width = window.Size.X / dpi;
                this.Height = window.Size.Y / dpi;

            }
            else
            {
                this.Width = 0;
                this.Height = 0;

            }

        }

        private void Window_Load()
        {
            this.Left = window.Location.X / dpi;
            this.Top = window.Location.Y / dpi;
            this.Width = window.Size.X / dpi;
            this.Height = window.Size.Y / dpi;
            this.Focus();
        }

        private void Window_MouseMove(OpenTK.Windowing.Common.MouseMoveEventArgs obj)
        {
            //
        }

        private void Window_Closed()
        {
            Close();
        }

        private void MakeObj_Click(object sender, RoutedEventArgs e)
        {
            var nativeWindowSettings = new NativeWindowSettings()
            {
                Size = new Vector2i(800, 600),
                Title = "LearnOpenTK - Creating a Window",
            };

            // To create a new window, create a class that extends GameWindow, then call Run() on it.
            using (bwindow = new BuildWindow(GameWindowSettings.Default, nativeWindowSettings))
            {

                bwindow.Run();


            }

        }
    }
}
